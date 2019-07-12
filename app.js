//app.js
App({
  globalData: {
    appId: 'wx5e388f9d4a1954c1',
    loginInfo: null,
    userInfo: null,
    parentUserCode: null,

    // baseURL: 'https://www.mzsport.top/football/' // prd
    baseURL: 'http://47.107.33.58:8080/football/' // test
    // baseURL: 'http://127.0.0.1:8080/football/' // dev
  },

  onLaunch: function () {
    // 打开调试
    // wx.setEnableDebug({
    //   enableDebug: true
    // })

    var that = this;
    //获取分享数据--无效
    //wx.getShareInfo()

    //调用API从本地缓存中获取数据
    var loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo) {
      if (loginInfo.lastLoginDate &&
        (Number(loginInfo.lastLoginDate) + 2 * 60 * 60 * 1000) > new Date().getTime()) {
        that.globalData.loginInfo = loginInfo
      } else {
        wx.removeStorageSync('loginInfo')
      }
    }
  },

  onShow: function () {
    var that = this
    //    wx.getLocation({
    //      success: function(res) {
    //        console.log(res)
    //        if (res.latitude && res.longitude) {
    //          that.saveUserTrail(Number(res.longitude), Number(res.latitude))
    //        }
    //      }
    //    })

    //当小程序启动，或从后台进入前台显示，会触发 onShow
    // wx.checkSession({
    //   success: function() {
    //     //session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function() {
    //     // session_key 已经失效，需要重新执行登录流程
    //   }
    // })
  },

  onHide: function () {
    //当小程序从前台进入后台，会触发 onHide

  },
  onError: function () {
    //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息

  },

  showLoading: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 15000
    })
    wx.showNavigationBarLoading()
  },

  hideLoading: function () {
    wx.hideToast()
    wx.hideNavigationBarLoading()
  },

  fxLogin: function (cb) {
    var that = this
    if (that.globalData.loginInfo) {
      typeof cb == "function" && cb()
      return
    }

    //调用登录接口
    wx.login({
      success: function (res) {
        console.log('wx.login:')
        console.log(res)
        if (that.globalData.userInfo && that.globalData.userInfo.rawData && that.globalData.userInfo.encryptedData && that.globalData.userInfo.iv && that.globalData.userInfo.signature) {
          that.fxWxLogin(res.code, cb)
        } else {
          that.showLoading()
          wx.getUserInfo({
            withCredentials: true,
            success: function (userInfo) {
              console.log('wx.getUserInfo:')
              console.log(userInfo)
              that.globalData.userInfo = userInfo
              that.fxWxLogin(res.code, cb)
            },
            fail: function (res) {
              console.log('wx.getUserInfo:失败')
              wx.showModal({
                title: '出错啦',
                content: 'wx.getUserInfo:失败',
                showCancel: false
              })
              // typeof cb == "function" && cb()
            },
            complete: function (res) {
              that.hideLoading()
            }
          })
        }
      },
      fail: function (res) {
        console.log('wx.login:失败')
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
    var that = this
    that.showLoading()
    wx.request({
      // url: that.globalData.baseURL + 'acc/wxLoginTest',
      url: that.globalData.baseURL + 'acc/wxLogin',
      method: 'POST',
      data: {
        appId: that.globalData.appId,
        code: code,
        userInfo: that.globalData.userInfo.rawData,
        encryptedData: that.globalData.userInfo.encryptedData,
        iv: that.globalData.userInfo.iv,
        signature: that.globalData.userInfo.signature,
        parentUserCode: that.globalData.parentUserCode
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('fxWxLogin:')
        console.log(res)
        if (res.data.code == 0 && res.data.data && res.data.data.token) {
          that.globalData.loginInfo = res.data.data
          that.globalData.loginInfo.lastLoginDate = new Date().getTime()
          wx.setStorageSync('loginInfo', that.globalData.loginInfo)
          typeof cb == "function" && cb()
        }
      },
      fail: function (res) {
        // that.changeSetting(cb)
        console.log('fxWxLogin:失败')
        wx.showModal({
          title: '出错啦',
          content: '登录失败',
          showCancel: false
        })
      },
      complete: function (res) {
        that.hideLoading()
      }
    })
  },

  changeSetting: function (cb) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '请您授权',
      showCancel: false,
      success: function (res) {
        console.log(res)
        wx.openSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting && res.authSetting["scope.userLocation"]) {
              //that.getLoginInfo(cb)
            } else {
              that.changeSetting(cb)
            }
          },
          fail: function (res) {
            that.changeSetting(cb)
          }
        })
      }
    })
  },

  getUserInfo: function (otherUserCode, cb) {
    var that = this
    that.showLoading()
    wx.request({
      url: that.globalData.baseURL + 'u/view',
      data: {
        token: that.globalData.loginInfo.token,
        otherUserCode: otherUserCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0 && res.data.data) {
          typeof cb == "function" && cb(res.data.data)
        }
      },
      complete: function (res) {
        that.hideLoading()
      }
    })
  },

  uploadFile: function (filePath, refType, refId, sort, cb) {
    var that = this
    if (!filePath) {
      typeof cb == "function" && cb()
      return
    }
    wx.uploadFile({
      url: that.globalData.baseURL + 'file/upload',
      filePath: filePath,
      name: 'file',
      formData: {
        token: that.globalData.loginInfo.token,
        'refType': refType || '',
        'refId': refId || '',
        'sort': sort || 0
      },
      success: function (res) {
        if (res.data) {
          var retData = JSON.parse(res.data)
          if (retData.code != 0) {
            typeof cb == "function" && cb()
            return
          }
          typeof cb == "function" && cb(retData.data.url)
        }
      },
      fail: function (res) {
        typeof cb == "function" && cb()
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  saveUserTrail: function (longitude, latitude) {
    var that = this
    if (latitude && longitude && that.globalData.loginInfo && that.globalData.loginInfo.token) {
      wx.request({
        url: that.globalData.baseURL + 'u/saveUserTrail',
        data: {
          token: that.globalData.loginInfo.token,
          longitude: longitude,
          latitude: latitude
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        complete: function (res) {
          console.log(res)
        }
      })
    }
  },

  shareAppMessage: function (res) {
    var that = this
    console.log(res)
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
    }
  }
})