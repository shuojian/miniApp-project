//app.js
App({
  globalData: {
    appId: ' wx5e388f9d4a1954c1',
    loginInfo: null,
    userInfo: null,
    parentUserCode: null,
    // baseURL: 'https://www.mzsport.top/football/' // prd
    baseURL: 'http://47.107.33.58:8080/football/' // test
    // baseURL: 'http://127.0.0.1:8080/football/' // dev
  },

  globalApi: {
    checkUser: 'http://47.107.33.58:8080/football/acc/wxLogin'
  },


  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    // var loginInfo = wx.getStorageSync('loginInfo')
    // if (loginInfo) {
    //   if (loginInfo.lastLoginDate &&
    //     (Number(loginInfo.lastLoginDate) + 2 * 60 * 60 * 1000) > new Date().getTime()) {
    //     that.globalData.loginInfo = loginInfo
    //   } else {
    //     wx.removeStorageSync('loginInfo')
    //   }
    // } else {
    //   that.fxLogin((res) => {
    //     console.log('页面加载loginfo:')
    //     console.log(res)
    //   })
    // }

    // 本地存储
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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

  /**
   * 加载提示
   */
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


  getToken() {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发送res.code 到后台
            wx.request({
              url: this.globalApi.checkUser,
              method: 'POST',
              data: {
                code: res.code
              },
              success(res) {
                //成功返回数据后，将token值存储到localStorage中
                console.log('token返回：')
                console.log(res)
                wx.setStorage({
                  key: 'yerlLocalToken',
                  data: res.data.token
                });
                var resArg = res.data.token;
                resolve()
              },
              fail() {
                reject();
              }
            })
          }
        }
      })
    })
  },

  /**
  * 清除缓存，重新登录
  */
  fxReLogin: function (cb) {
    wx.removeStorageSync('loginInfo')
    this.globalData.loginInfo = null
    this.fxLogin(cb)
  },

  /**
   * === 登录 ===
   */
  fxLogin: function (cb) {
    var that = this
    if (that.globalData.loginInfo) {
      typeof cb == "function" && cb()
      return
    }
    //调用登录接口
    wx.login({
      //登录成功
      success: res => {
        console.log('1.fxLogin登录成功wx')
        console.log(res)
        if (that.globalData.userInfo && that.globalData.userInfo.rawData && that.globalData.userInfo.encryptedData && that.globalData.userInfo.iv && that.globalData.userInfo.signature) {
          that.fxWxLogin(res.code, cb)
        } else {
          that.showLoading()

          wx.getUserInfo({
            withCredentials: true,
            success: function (userInfo) {
              console.log('2.wx.getUserInfo:')
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
      //登录失败
      fail: res => {
        console.log('wx.login:失败')
        wx.showModal({
          title: '登录失败，小程序授权才能有更好的体验',
          content: 'wx.login:登录失败，小程序授权才能有更好的体验',
          showCancel: false
        })
      }

    })
  },

  //向登录api接口发送code
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
        //换取openid和session_key
        console.log('3. fxWxLogin:')
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





  //授权
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
            console.log("wx.openSetting授权:")
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

  //请求token
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
        console.log('getUserInfo,请求token:')
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

  //请求
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

  /**
   * === - ===
   */

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

  shareAppMessage: function (res) {
    var that = this
    console.log(res)
    return {
      title: '梦舟足球',
      path: '/pages/index/index'
    }
  }
})