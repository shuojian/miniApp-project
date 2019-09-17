//app.js
import { promisic } from 'utils/common.js'
import { api } from 'utils/config.js'
App({
  globalData: {
    appId: 'wx5e388f9d4a1954c1',
    loginInfo: null,
    userInfo: null,
    code: null,
    parentUserCode: null,
    baseURL: api.base_url,
    startUrl:api.start_url,
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

  fxLogin(cb) {
    if (this.globalData.loginInfo) {
      typeof cb == "function" && cb()
      return
    }
    //调用登录接口
    wx.login({
      success: (res) => {
        if (this.globalData.userInfo && this.globalData.userInfo.rawData && this.globalData.userInfo.encryptedData && this.globalData.userInfo.iv && this.globalData.userInfo.signature) {
          this.fxWxLogin(res.code, cb)
          this.globalData.code = res.code
        } else {
          wx.showLoading()
          wx.getUserInfo({
            withCredentials: true,
            success: (userInfo) => {
              this.globalData.userInfo = userInfo
              this.fxWxLogin(res.code, cb)
            },
            fail: (res) => {
              wx.showModal({
                title: '出错啦',
                content: '获取用户信息失败',
                showCancel: false
              })
              // typeof cb == "function" && cb()
            },
            complete: (res) => {
              wx.hideLoading()
            }
          })
        }
      },
      fail: (res) => {
        wx.showModal({
          title: '出错啦',
          content: 'wx.login:失败',
          showCancel: false
        })
      }
    })
  },

  fxReLogin: function (cb) {
    wx.removeStorageSync('loginInfo')
    this.globalData.loginInfo = null
    this.fxLogin(cb)
  },

  fxWxLogin: function (code, cb) {
    this.showLoading()
    wx.request({
      // url: this.globalData.baseURL + 'acc/wxLoginTest',
      url: this.globalData.baseURL + 'acc/wxLogin',
      method: 'POST',
      data: {
        appId: this.globalData.appId,
        code: code,
        userInfo: this.globalData.userInfo.rawData,
        encryptedData: this.globalData.userInfo.encryptedData,
        iv: this.globalData.userInfo.iv,
        signature: this.globalData.userInfo.signature,
        parentUserCode: this.globalData.parentUserCode
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // console.log('code换取token res:', res)
        if (res.data.code == 0 && res.data.data && res.data.data.token) {
          this.globalData.loginInfo = res.data.data
          this.globalData.loginInfo.lastLoginDate = new Date().getTime()
          wx.setStorageSync('loginInfo', this.globalData.loginInfo)
          typeof cb == "function" && cb()
        }
      },
      fail: (res) => {
        // this.changeSetting(cb)
        wx.showModal({
          title: '出错啦',
          content: '登录失败',
          showCancel: false
        })
      },
      complete: (res) => {
        this.hideLoading()
      }
    })
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