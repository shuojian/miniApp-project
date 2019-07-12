
// var util = require('../../utils/util.js')
var myData = require('../../utils/data.js').myData
import { promisic } from '../../utils/common.js'

const app = getApp()
// var isLoading = false;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    authorized: false,
    loginInfo: null,
    coinKen: 0,
    signed: false,
    inited: false,

    myDataList: myData,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    if (app.globalData.loginInfo && app.globalData.loginInfo.token) {
      console.log('页面有1 loginInfo.token:')
      console.log(app.globalData.userInfo)

      this.setData({
        loginInfo: app.globalData.loginInfo,
      })

      wx.request({
        url: app.globalData.baseURL + 'u/me',
        data: {
          token: app.globalData.loginInfo.token
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res=>{
          console.log('页面请求成功')
          console.log(res)
          if (res.data.code == 0 && res.data.data) {
            this.setData({
              coinKen: res.data.data.user.coinKen || 0
            })
          }
        }
      })
    } else if (app.globalData.userInfo) {
      console.log('页面有2userInfo:')
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log('页面有2:')
      console.log(this.data.canIUse)
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('onPullDownRefresh:' + this.route)
    if (!isLoading) {
      this.init()
    }
  },

  init() {
    var that = this
    that.setData({
      inited: true
    })

    if (app.globalData.loginInfo && app.globalData.loginInfo.token) {
      that.setData({
        loginInfo: app.globalData.loginInfo
      })

      wx.request({
        url: app.globalData.baseURL + 'u/me',
        data: {
          token: app.globalData.loginInfo.token
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('页面请求成功')
          console.log(res)
          if (res.data.code == 0 && res.data.data) {
            that.setData({
              coinKen: res.data.data.user.coinKen || 0
            })
          }
        }
      })
    }
  },

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  accountSet() {
    wx.navigateTo({
      url: '../accountSet/index'
    })
  },

  toMyData(){
    wx.navigateTo({
      url: 'mydata/mydata',
    })
  },

  toMyGame() {
    wx.navigateTo({
      url: 'mygame/mygame',
    })
  },

  toMyOrder() {
    wx.navigateTo({
      url: 'myorder/myorder',
    })
  },

  toMyTeam() {
    wx.navigateTo({
      url: 'myteam/myteam',
    })
  },

  toService(){
    wx.navigateTo({
      url: 'service/service',
    })
  },

  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },

  toAuth() {
    wx.navigateTo({
      url: '../login/auth/index',
    })
  }
})

