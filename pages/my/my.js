var myData = require('../../utils/data.js').myData
import { promisic } from '../../utils/common.js'
const app = getApp()
Page({
  data: {
    authorized: false,
    userInfo: {},
    myDataList: myData,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(o) {
    // wx.showLoading()
    if (app.globalData.userInfo) {
      this.setData({
        authorized: true,
        userInfo: app.globalData.userInfo
      })
      app.fxLogin(this._init)
    } else {
      this.userAuthorized()
    }
  },

  userAuthorized() {
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userInfo']) {
          return promisic(wx.getUserInfo)()
        }
        return false
      })
      .then(data => {
        if (!data) return
        this.setData({
          authorized: true,
          userInfo: data.userInfo
        })
      })
  },

  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
      app.globalData.userInfo = userInfo
      //调用登录接口
      app.fxLogin(this._init)
    }
  },

  _init() {
    if (app.globalData.loginInfo.inReview == 'N') {
      this.setData({
        inited: true
      })
    }
    // wx.reLaunch({
    //   url: 'my'
    // })
  },

  // accountSet() {
  //   wx.navigateTo({
  //     url: '../accountSet/index'
  //   })
  // },

  toMyData(){
    const route = "../my/my"
    if (app.globalData.loginInfo !== null) {
      wx.navigateTo({
        url: 'myData/mydata',
      })
    } else {
      wx.navigateTo({
        url: `../login/login?route=${route}`,
      })
    }
  },

  toMyEvent() {
    const route = "../my/my"
    if (app.globalData.loginInfo !== null) {
      wx.navigateTo({
        url: 'myEvent/myevent',
      })
    } else {
      wx.navigateTo({
        url: `../login/login?route=${route}`,
      })
    }
  },

  toMyOrder() {
    const route = "../my/my"
    if(app.globalData.loginInfo !== null){
      wx.navigateTo({
        url: 'myOrder/myorder',
      })
    }else{
      wx.navigateTo({
        url: `../login/login?route=${route}`,
      })
    }
  },

  toMyTeam() {
    const route = "../my/my"
    if (app.globalData.loginInfo !== null) {
      wx.navigateTo({
        url: 'myTeam/myteam',
      })
    } else {
      wx.navigateTo({
        url: `../login/login?route=${route}`,
      })
    }
  },

  toService(){
    wx.navigateTo({
      url: 'service/service',
    })
  },

  // toLogin(){
  //   wx.navigateTo({
  //     url: '../login/login',
  //   })
  // },

  // toAuth() {
  //   wx.navigateTo({
  //     url: '../login/auth/index',
  //   })
  // }
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

})

