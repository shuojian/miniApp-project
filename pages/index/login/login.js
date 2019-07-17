// pages/index/login.js
//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    lastRouteId: null,
    authLogin: true,
    inited: false,
    parentUserCode: null,
    userInfo: {},
  },

  onLoad (o) {
    if (app.globalData.userInfo) {
      app.fxLogin(this._init)
    } else {
      wx.getSetting({
        success: (res) => {
          console.log("调用getSetting成功：", res)
          if (res.authSetting && res.authSetting["scope.userInfo"]) {
            this.setData({
              authLogin: false
            })
            //调用登录接口
            app.fxLogin(this._init)
          }
        }
      })
    }
  },

  getUserInfo(e) {
    console.log('getUserInfo用户信息：', e.detail.rawData)
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        authLogin: false,
        userInfo: e.detail.rawData
      })
      app.globalData.userInfo = e.detail.rawData
      app.fxLogin(this._init)
    }
  },
  
  _init(lastRouteId) {
    if (app.globalData.loginInfo && app.globalData.loginInfo.inReview && app.globalData.loginInfo.inReview == 'N') {
      this.setData({
        inited: true
      })
    } 
    wx.reLaunch({
      // url: '../index'
      url: '../../field/index'
    })
  }
})