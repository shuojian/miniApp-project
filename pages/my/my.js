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
  onLoad(options) {
    wx.showLoading()
    this.userAuthorized()
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
        wx.hideLoading()
      })
  },

  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },

  accountSet() {
    wx.navigateTo({
      url: '../accountSet/index'
    })
  },

  toMyData(){
    wx.navigateTo({
      url: 'myData/mydata',
    })
  },

  toMyEvent() {
    wx.navigateTo({
      url: 'myEvent/myevent',
    })
  },

  toMyOrder() {
    wx.navigateTo({
      url: 'myOrder/myorder',
    })
  },

  toMyTeam() {
    wx.navigateTo({
      url: 'myTeam/myteam',
    })
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
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh() {

  },

})

