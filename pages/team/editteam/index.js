
// editteam
// import { UploadFile } from '../../../models/uploadFile.js'
import { ReqModel } from '../../../models/request.js'
var util = require('../../../utils/util.js')
const reqModel = new ReqModel()
// const uploadFile = new UploadFile()

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    inited: true,
    lastRouteId: null,
    authLogin: true,
    //parentUserCode: null,

    teamId: null,
    teamType: null,
    attachs: null,
    teamDesc:null,
    teamName:null,
    attachsSrc: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    array: ['3人制', '5人制', '7人制', '8人制', '11人制'],
    index: 0,

    hyArray: ['政府', '企业', '校园', '球迷'],
    hyIndex: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const bid = options.bid
    const teamId = bid
    const attachs = options.attachs
    const teamName = options.teamName
    const teamType = options.teamType
    const teamDesc = options.teamDesc
    console.log('球队信息：', options)
    this.setData({
      teamId,
      attachs,
      teamName,
      // teamArea,
      teamType,
      // teamBelong,
      teamDesc,
    })

    if (attachs == "undefined"){
      this.setData({
        attachs: '/img/logo.png'
      })
    }else{
      this.setData({
        attachs: attachs,
      })
    }
  },

  choseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log('图片提交：', res)
        // const attachs = uploadFile.UploadFile({ 
        //   url: 'file/uploadToWxCos', 
        //   filePath: res.tempFilePaths[0], 
        //   file: 'teamAvata', 
        //   refId: this.data.teamId, 
        //   refType: 'team'
        // })
        this._uploadFile(res.tempFilePaths[0], 'teamAvata', this.data.teamId, 'team')
        this.setData({
          attachs: res.tempFilePaths[0]
          // attachs: res.data.url
        })
      }
    })
  },

  regionChange(e) {
    console.log('所在地区：', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  pickerChange(e) {
    console.log('擅长赛制：', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  hyChange(e) {
    console.log('所属行业：', e.detail.value)
    this.setData({
      hyIndex: e.detail.value
    })
  },

  /*修改球队*/
  async formSubmit(e) {
    app.showLoading()
    var upData = e.detail.value
    var formData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
      attachs: this.data.attachsSrc,
      teamName: upData.teamName,
      teamArea: upData.teamArea,
      teamType: upData.teamType,
      teamBelong: upData.teamBelong,
      teamDesc: upData.teamDesc,
    }

    const res = await reqModel.updateTeam(formData)
    util.showToast_success('球队修改成功！')
    util.backTo(2000, 1)
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

  _uploadFile: function (filePath, file, refId, refType) {
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
        // duration:
        file: file,
        // fileType:,
        refId: refId || '',
        refType: refType || '',
      },
      success: (res) => {
        console.log('文件上传信息：', res)
        // const pic = res.data
        // this.setData({
        //   attachsSrc: pic
        // })
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },
})

