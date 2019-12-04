//app.js
import { api } from 'utils/config.js'
import { ReqModel } from 'models/request.js'
import { promisic } from 'utils/common.js'
const util = require('utils/util.js')
const reqModel = new ReqModel()
App({
  globalData: {
    appId: 'wx5e388f9d4a1954c1',
    loginInfo: null,
    userInfo: null,
    code: null,
    parentUserCode: null,
    baseURL: api.base_url,
    startUrl: api.start_url,
    shareTitle: '你的朋友邀请你加入球队',
    shareImgUrl: api.share_img_url,
    pageLimit: api.pageLimit
  },

  onLaunch() {
    var loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo) {
      if (loginInfo.lastLoginDate &&
        (Number(loginInfo.lastLoginDate) + 2 * 60 * 60 * 1000) > new Date().getTime()) {
        this.globalData.loginInfo = loginInfo
      } else {
        wx.removeStorageSync('loginInfo')
      }
    }
  },

  async fxLogin(cb) {
    if (this.globalData.loginInfo) {
      typeof cb == "function" && cb()
      return
    }
    //调用登录接口
    try{
      const res = await promisic(wx.login)()
      console.log('wx.login ->', res)
      if (this.globalData.userInfo && this.globalData.userInfo.rawData && this.globalData.userInfo.encryptedData && this.globalData.userInfo.iv && this.globalData.userInfo.signature) {
          this.fxWxLogin(res.code, cb)
          this.globalData.code = res.code
      } 
      else {
          const userInfo = await promisic(wx.getUserInfo)()
          console.log('userInfo ->', userInfo)
          this.globalData.userInfo = userInfo
          
          this.fxWxLogin(res.code, cb)
      }
    }
    catch(err){
      util.showToast_error('wx.login:失败')
    }
  },

  async fxWxLogin(code, cb) {
    const data = {
        appId: this.globalData.appId,
        code: code,
        userInfo: this.globalData.userInfo.rawData,
        encryptedData: this.globalData.userInfo.encryptedData,
        iv: this.globalData.userInfo.iv,
        signature: this.globalData.userInfo.signature,
        parentUserCode: this.globalData.parentUserCode
    }

    try{
      const res = await reqModel.login(data)
      console.log('登录后台 ->', res)
      if (res.code == 0 && res.data && res.data.token) {
        this.globalData.loginInfo = res.data
        this.globalData.loginInfo.lastLoginDate = new Date().getTime()
        wx.setStorageSync('loginInfo', this.globalData.loginInfo) //缓存登录信息
        typeof cb == "function" && cb()
      }else{
        util.showModal(res.code, res.msg, false)
      }
    }catch(err){
      util.showToast_error('登录失败')
      console.log('err -> ', err)
    }
  },

  fxReLogin: function (cb) {
    wx.removeStorageSync('loginInfo')
    this.globalData.loginInfo = null
    this.fxLogin(cb)
  },

  showLoading() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 15000
    })
    wx.showNavigationBarLoading()
  },

  hideLoading() {
    wx.hideToast()
    wx.hideNavigationBarLoading()
  }
})