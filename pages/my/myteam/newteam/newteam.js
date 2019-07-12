// pages/me/myteam/newteam/newteam.js
var util = require('../../../../utils/util.js')

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    inited: true,

    hidePost: true,
    lastRouteId: null,
    authLogin: true,
    //parentUserCode: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    array: ['3人制', '5人制', '7人制', '8人制', '11人制'],
    objectArray: [
      {
        id: 0,
        name: '3人制'
      },
      {
        id: 1,
        name: '5人制'
      },
      {
        id: 2,
        name: '7人制'
      },
      {
        id: 3,
        name: '8人制'
      },
      {
        id: 4,
        name: '11人制'
      }
    ],
    index: 0,

    hyArray: ['政府', '企业', '校园', '球迷'],
    objectHyArray: [
      {
        id: 0,
        name: '政府'
      },
      {
        id: 1,
        name: '企业'
      },
      {
        id: 2,
        name: '校园'
      },
      {
        id: 3,
        name: '球迷'
      }
    ],
    hyIndex: 0
  },

  init: function (lastRouteId) {
    var that = this

    //    if (this.data.inited && app.globalData.loginInfo.isCertified != 'Y') {
    //      wx.navigateTo({
    //        url: '/pages/verify/verify'
    //      })
    //    }
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


    app.showLoading()
    isLoading = true

    wx.request({
      url: app.globalData.baseURL + 'prd/listSet',
      data: {
        token: app.globalData.loginInfo ? app.globalData.loginInfo.token : '',
        lastRouteId: lastRouteId,
        rows: 6
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          if (res.data.data) {
            for (var i in res.data.data) {
              res.data.data[i].insertTime_fmt = util.formatTimeStamp(res.data.data[i].insertTime)
            }
            if (lastRouteId) {
              that.setData({
                prds: that.data.prds.concat(res.data.data || [])
              })
            } else {
              that.setData({
                prds: res.data.data || []
              })
            }
          }
        } else if (res.data.status == -1) {
          // token is invalid
          app.fxReLogin(that.init)
        } else {
          wx.showModal({
            title: '出错啦',
            content: '网络不给力啊',
            showCancel: false
          })
        }
      },
      complete: function (res) {
        app.hideLoading()
        isLoading = false
        wx.stopPullDownRefresh()
      }
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    //console.log(query)
    //if (query && query.scene) {
      //app.globalData.parentUserCode = decodeURIComponent(query.scene)
    //}

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

  //生命周期函数--监听页面显示
  
  onShow: function () {
    var that = this
    if (!that.data.inited) {
      if (app.globalData.userInfo) {
        app.fxLogin(that.init)
      } else {
        wx.getSetting({
          success: function (res) {
            console.log("wx.getSetting")
            console.log(res)
            if (res.authSetting && res.authSetting["scope.userInfo"]) {
              //调用登录接口
              app.fxLogin(that.init)
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    }
  },

 
  //事件处理函数
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindHyChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hyIndex: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //上传球队队徽
  choseImg(){
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          imgsrc:res.tempFilePaths,
        })
      }
    })
  },

  formSubmit: function () {
    //console.log('form submit：', e.detail.value)
    var that = this;
    app.showLoading()
    
    wx.request({
      url: app.globalData.baseURL  + 'team/create',
     // url:'http://47.107.33.58:8080/football/team/create',
      method: 'POST',
      data: {
        //发送给服务器的参数（参数名：参数值）
        //token: app.globalData.loginInfo ? app.globalData.loginInfo.token : '',
        token:app.globalData.loginInfo.token,

        teamName: that.data.teamName,
        teamType: that.data.teamType,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0 && res.data.data) {
          that.setData({
            coinKen: res.data.data.user.coinKen || 0,
            giftAmount: res.data.data.user.giftAmount || 0,
            rebateAmount: res.data.data.user.rebateAmount || 0,
            points: res.data.data.user.points || 0
            // signed: res.data.data.checkSign == 'signed',
            // isEmployee: res.data.data.user.isEmployee == 'Y',
            // isCertified: res.data.data.user.isCertified == 'Y',
            // allCount: res.data.data.allCount || 0,
            // newCount: res.data.data.newCount || 0,
            // dispatchedCount: res.data.data.dispatchedCount || 0,
            // finishedCount: res.data.data.finishedCount || 0
          })
        }

        wx.showToast({
          title: '球队创建成功！',
          icon: 'success',
          duration: 2000
        })
      },

      fail: function (error) {
        console.log(error);
        wx.showToast({
          title: '创建球队出错',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {
        app.hideLoading()
      }
    })
  }

})