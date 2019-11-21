
var util = require('../../../utils/util.js')
import { ReqModel } from '../../../models/request.js'
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
    // teamAvatarSrc: '/img/logo.png',
    // attachsSrc: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    array: [ '5人制', '11人制'],
    index: 0,
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    
  },

  // 创建球队
  async formSubmit(e) {
    app.showLoading()
    var upData = e.detail.value
    console.log('teamArea-->', upData.teamArea[0], upData.teamArea[1], upData.teamArea[2])
    var formData = {
      token: app.globalData.loginInfo.token,
      // attachs: this.data.teamAvatarSrc,//球队图片
      teamDesc: upData.teamDesc,//球队说明
      teamName: upData.teamName,//球队名称
      teamType: upData.teamType,//球队 类型
      province: upData.teamArea[0],//球队所在省
      city: upData.teamArea[1],//球队所在州和省级市
      district: upData.teamArea[2],//球队所在地级市、区和县
    }
    if (!upData.teamName){
      util.showToast_error('球队队名未填写')
    } else {
        const creatTeam = await reqModel.creatTeam(formData)
        util.showToast_success('创建球队成功！')
        util.backTo(1000,1)
    } 
  },

  //选择地区
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //选择赛制
  pickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  }
})  


