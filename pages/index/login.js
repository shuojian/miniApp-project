// pages/index/login.js
//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    prds: [],
    firstPrds: [],
    lastRouteId: null,
    hotPrds: [],
    hidePost: true,
    authLogin: true,
    inited: false,
    parentUserCode: null
  },

  init: function (lastRouteId) {
    var that = this
    if (app.globalData.loginInfo && app.globalData.loginInfo.inReview && app.globalData.loginInfo.inReview == 'N') {
      that.setData({
        hidePost: false,
        inited: true
      })
    } else {
      that.setData({
        inited: true
      })
    }
    wx.reLaunch({
      url: 'index'
    })
  },

  onLoad: function (query) {
    console.log(query)
    if (query && query.scene) {
      app.globalData.parentUserCode = decodeURIComponent(query.scene)
    }

    var that = this
    if (app.globalData.userInfo) {
      app.fxLogin(that.init)
    } else {
      wx.getSetting({
        success: function (res) {
          console.log("wx.getSetting")
          console.log(res)
          if (res.authSetting && res.authSetting["scope.userInfo"]) {
            that.setData({
              authLogin: false
            })
            //调用登录接口
            app.fxLogin(that.init)
          }
        }
      })
    }
  },

  onGotUserInfo: function (e) {
    var that = this
    console.log('onGotUserInfo')
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.setData({
        authLogin: false
      })
      app.globalData.userInfo = e.detail
      app.fxLogin(that.init)
    }
  },

  bindPayTap: function (e) {
    var that = this
    app.showLoading()
    wx.request({
      url: app.globalData.baseURL + 'sportsFieldOrder/create',
      data: {
        token: app.globalData.loginInfo.token,
        fieldId: 1,
        matchTimeStart: (new Date()).getTime() + 24 * 3600 * 1000,
        matchTimeEnd: (new Date()).getTime() + 1000 + 24 * 3600 * 1000,
        realName: '隔壁老王',
        phone: 13300000000
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code != 0 || !res.data.data) {
          wx.showModal({
            title: '下单失败',
            content: '预订场地失败！。',
            showCancel: false
          })
          return
        }
        that.pay(res.data.data)
      },
      complete: function (res) {
        app.hideLoading()
      }
    })
  },

  pay: function (orderId) {
    app.showLoading()
    wx.request({
      url: app.globalData.baseURL + 'sportsFieldPay/payOrder',
      data: {
        token: app.globalData.loginInfo.token,
        orderId: orderId,
        useCoin: 'N',
        useGiftAmount: 'N',
        payChannel: 'WeChat'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code != 0) {
          wx.showModal({
            title: '支付失败',
            content: '请稍后重试或者联系客服。',
            showCancel: false
          })
          return
        }

        var payId = res.data.data.payId
        if (!payId) {
          wx.showModal({
            title: '支付成功',
            content: '我们将马上安排配送！',
            showCancel: false,
            success: function (res) {
              wx.reLaunch({
                url: '/pages/me/me'
              })
            }
          })
          return
        }

        wx.requestPayment({
          'appId': res.data.data.orderExtInfo.appId,
          'timeStamp': res.data.data.orderExtInfo.timeStamp,
          'nonceStr': res.data.data.orderExtInfo.nonceStr,
          'package': res.data.data.orderExtInfo.package,
          'signType': res.data.data.orderExtInfo.signType,
          'paySign': res.data.data.orderExtInfo.paySign,
          'success': function (res) {
            console.log(res)
            wx.showModal({
              title: '支付成功',
              content: '我们将马上安排配送！',
              showCancel: false
            })
          },
          'fail': function (res) {
            console.log(res)

            wx.request({
              url: app.globalData.baseURL + 'sportsFieldPay/resetOrder',
              data: {
                token: app.globalData.loginInfo.token,
                payId: payId
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res1) {
                console.log(res1)
                if (res1.data.code != 0) {
                  wx.showModal({
                    title: '支付失败，返还余额和代金券失败',
                    content: '请及时联系客服。',
                    showCancel: false
                  })
                  return
                }

                if (res && res.errMsg == 'requestPayment:fail cancel') {
                  // wx.showToast({
                  //   title: '支付已取消',
                  //   icon: 'none'
                  // })
                } else {
                  wx.showModal({
                    title: '支付失败',
                    content: '请稍后重试或者联系客服。',
                    showCancel: false
                  })
                }
              },
              fail: function (res1) {
                console.log(res1)
                wx.showModal({
                  title: '支付失败，返还余额和代金券失败',
                  content: '请及时联系客服。',
                  showCancel: false
                })
              }
            })
          }
        })
      },
      complete: function (res) {
        app.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh:' + this.route)
    if (!isLoading) {
      this.init()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!isLoading) {
      if (this.data.prds && (this.data.prds.length % 6) == 0) {
        this.init(this.data.prds[this.data.prds.length - 1].routeId)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return app.shareAppMessage(res)
  }
})