
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
    array: ['3人制', '5人制', '7人制', '8人制', '11人制'],
    index: 0,
    hyArray: ['政府', '企业', '校园', '球迷'],
    hyIndex: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    
  },
  
  async formSubmit(e) {
    app.showLoading()
    var upData = e.detail.value
    var formData = {
      token: app.globalData.loginInfo.token,
      // attachs: this.data.teamAvatarSrc,
      teamDesc: upData.teamDesc,
      teamName: upData.teamName,
      teamType: upData.teamType,
      teamArea: upData.teamArea,
      teamBelong: upData.teamBelong, 
    }
    if (!upData.teamName){
      util.showToast_error('球队队名未填写')
    } else {
        const creatTeam = await reqModel.creatTeam(formData)
        util.showToast_success('创建球队成功！')
        util.backTo(1000,2)
    } 
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
  hyChange(e) {
    this.setData({
      hyIndex: e.detail.value
    })
  },
})  


