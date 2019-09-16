// pages/index/login.js
//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    lastRoute: null,
    authLogin: true,
    inited: false,
    parentUserCode: null,
    userInfo: {},
  },

  onLoad (o) {
    const lastRoute = o.route
    this.setData({lastRoute})
    console.log("接收：", lastRoute)
    if (app.globalData.userInfo) {
      app.fxLogin(this._init(lastRoute))
    } else {
      wx.getSetting({
        success: (res) => {
          console.log("调用getSetting成功：", res)
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
        authLogin: false,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo
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