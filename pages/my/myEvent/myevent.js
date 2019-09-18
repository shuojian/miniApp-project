import { promisic } from '../../../utils/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    myevent:{},
    nodata: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userAuthorized()
  },

  userAuthorized() {
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userInfo']) {
          //调用登录接口
          app.fxLogin(this._init)
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
        // wx.hideLoading()
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
  
  // 创建赛事弹框
  onTap() {
    wx.lin.showDialog({
      type: "alert",
      title: "进驻赛事",
      content: "请联系：13888761796 或 QQ 409524497"
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
    }
  }
})