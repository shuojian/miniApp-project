// pages/index/login.js
//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    lastRoute: null,
    authLogin: true, //需要登录
    inited: false,
  },

  onLoad (o) {
    const lastRoute = o.route
    this.setData({lastRoute})
    
    if (app.globalData.userInfo) {
      app.fxLogin(this._init(lastRoute))
    } else {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting["scope.userInfo"]) {
            this.setData({
              authLogin: false
            })
            //调用登录接口
            app.fxLogin(this._init(lastRoute))
          }
        }
      })
    }
  },

  getUserInfo(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        authLogin: false, //是否登录
        userInfo: e.detail
      })
      app.globalData.userInfo = e.detail
      app.fxLogin(this._init(this.data.lastRoute))
    }
  },
  
  _init(lastRoute) {
    if (app.globalData.loginInfo&&app.globalData.loginInfo.inReview == 'N') {
      this.setData({
        inited: true
      })
    } 
    wx.reLaunch({
      url: `${lastRoute}`
    })
  }
})