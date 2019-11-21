
// editteam
import { ReqModel } from '../../../models/request.js'
var util = require('../../../utils/util.js')
const reqModel = new ReqModel()

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    inited: true,
    lastRouteId: null,
    authLogin: true,
    //parentUserCode: null,

    teamInfo:null,
    teamId: null,
    teamType: null,
    logoUrl:null,
    // attachs: null,
    teamDesc:null,
    teamName:null,
    attachsSrc: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    teamTypes: ['5人制', '11人制'],
    index: 0,

    // hyArray: ['政府', '企业', '校园', '球迷'],
    // hyIndex: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const teamInfo = JSON.parse(options.teamInfo) 
    console.log('球队信息：', teamInfo)
    this.setData({
      teamInfo,
      teamId: teamInfo.teamId,
      teamName: teamInfo.teamName,
      teamType: teamInfo.teamType,
      teamDesc: teamInfo.teamDesc,
    })
    if (teamInfo.teamType == '11人制'){
      this.setData({index: 1})
    }else{
      this.setData({index: 0})
    }

    if (!teamInfo.logoUrl){
      this.setData({
        logoUrl: '/img/logo.png'
      })
    }else{
      this.setData({
        logoUrl: teamInfo.logoUrl,
      })
    }
  },

  choseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log('图片提交：', res.tempFilePaths[0])
        this.uploadFile(res.tempFilePaths[0],'teamAvata', this.data.teamId, 'team')
        this.setData({logoUrl: res.tempFilePaths[0]})
      }
    })
  },

  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  pickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  /*修改球队*/
  async formSubmit(e) {
    app.showLoading()
    var upData = e.detail.value
    var formData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,//*
      teamType: upData.teamType,//*球队 类型
      attachs: this.data.logoUrl,
      teamName: upData.teamName,//球队名称
      teamDesc: upData.teamDesc,//球队说明
      province: upData.teamArea[0],//球队所在省
      city: upData.teamArea[1],//球队所在州和省级市
      district: upData.teamArea[2],//球队所在地级市、区和县
    }
    console.log('上传数据->',upData, formData)
    const res = await reqModel.updateTeam(formData)
    console.log('上传数据反馈->',res)
    if (res.code == "0"){
      util.showToast_success('球队修改成功！')
      util.backTo(1500, 1)
    }else{
      util.showToast_error(res.msg)
    }
  },
  
  /*删除球队*/
  async disableTeam(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
    }
    const res = await util.showModal('确定删除当前球队？')
    const dis = await reqModel.disableTeam(postData)
    if (dis.code == "-1") {
      util.showToast_error('删除球队出现错误，稍后再试')
      util.backTo(2000, 1)
    } else {
      util.showToast_success('球队删除成功！')
      util.backTo(2000, 3)
    } 
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },

  uploadFile(filePath, file, refId, refType) {
    console.log('token->',app.globalData.loginInfo.token)
    // UploadFile
    wx.showLoading()
    wx.uploadFile({
      url: app.globalData.baseURL + 'file/uploadToWxCos',
      filePath: filePath,
      name: 'file',
      method: "POST",
      formData: {
        token: app.globalData.loginInfo.token,
        appId: app.globalData.appId,
        file: file,
        fileType:'jpeg',
        refId: refId || '',
        refType: refType || '',
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if(data.code == "403"){
          util.showToast_error(data.msg)
        }
        console.log('文件上传信息：', res, res.data)
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },
})

