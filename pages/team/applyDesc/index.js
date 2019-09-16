// pages/team/detail/applyDesc/index.js
import { promisic } from '../../../utils/common.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        authorized: true,
        userInfo: app.globalData.userInfo
      })
      app.fxLogin(this._init)
    } else {
      this.userAuthorized()
    }

    const teamId = options.teamId
    this.setData({
      teamId: teamId
    })
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

  /* 申请加入球队*/
  formSubmit(e){
    console.log('加入理由：', e.detail.value)
    if (e.detail.value.applyDesc == "") {
      wx.lin.showToast({
        title: '加入理由为空',
        icon: 'error',
        iconStyle: 'color:#ff0000; size: 80',
      })
    } else {
      wx.request({
        url: app.globalData.baseURL + '/team/applyForJoin',
        method: 'POST',
        data: {
          token: app.globalData.loginInfo.token,
          teamId: this.data.teamId,
          applyDesc: e.detail.value
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          console.log("申请加入球队:", res)
          wx.lin.showToast({
            title: '申请已发送,等待确认~',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 80',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                }), 3000
              })
            }
          })
        }
      })
    }
  }

})