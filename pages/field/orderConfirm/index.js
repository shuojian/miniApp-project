import { ReqModel } from '../../../models/request.js'
const util = require('../../../utils/util.js')
const reqModel = new ReqModel()
import { promisic } from '../../../utils/common.js'
const app = getApp()

Page({
  data: {
    bid: null,
    fieldId: null,
    fieldName: null,
    fieldType: "半场",
    type:'half',
    gymName: null,
    
    carts: [],//购物车
    num: 0,
    price: 0,
    date: null,
    timeStart: null,
    timeEnd: null,
    matchTimeStart: null,
    matchTimeEnd: null,

    inited: false,
    parentUserCode: null,
    isGuest:false,
    userInfo: {},
    lastRouteId: null,
    authLogin: true,
    realName: "",
    phoneRule: {
      required: true,
      pattern: '/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/',
      message: '非手机号码'
    },
  },

  // 生命周期函数--监听页面加载
  onLoad: function (query) {
    wx.showLoading()
    this._userAuthorized()
    const num = query.num
    const fieldSize = query.fieldSize
    const carts = JSON.parse(query.carts)
    console.log('页面接收:', query)
    if (carts[0].booked == "Y" && carts[0].hostOrderId !== 0){
      const orderId = carts[0].hostOrderId
      this.setData({
        isGuest:true,
        orderId
      })
    }
    this.setData({
      date: query.date,
      timeStart: query.timeStart,
      timeEnd: query.timeEnd,
      matchTimeStart: query.matchTimeStart,
      matchTimeEnd: query.matchTimeEnd,
      fieldName: query.fieldName,
      fieldId: query.fieldId,
      fieldSize: query.fieldSize,
      fieldType: query.fieldType,
      gymName: query.gymName,
      price: query.price,
      num
    })
    if (fieldSize == "5人制") {
      this.setData({type: 'full'})
    }else if (fieldSize == "11人制"){
      if (carts.length == 2 ){
        if (carts[0].time == carts[1].time){
          this.setData({type: 'full'})
        }else{
          this.setData({type: 'half'})
        }  
      } else if (carts.length == 4 ){
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time) {
          this.setData({type: 'full'})
        } else {
          this.setData({type: 'half'})
        } 
      } else if (carts.length == 6) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time) {
          this.setData({type: 'full' })
        } else {
          this.setData({type: 'half'})
        } 
      } else if (carts.length == 8) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time) {
          this.setData({type: 'full'})
        } else{
          this.setData({ type: 'half'})
        }
      } else if (carts.length == 10) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time && carts[8].time == carts[9].time) {
          this.setData({ type: 'full' })
        } else {
          this.setData({ type: 'half' })
        }
      } else if (carts.length == 12) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time && carts[8].time == carts[9].time && carts[10].time == carts[11].time) {
          this.setData({ type: 'full' })
        } else {
          this.setData({ type: 'half' })
        }
      } else if (carts.length == 14) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time && carts[8].time == carts[9].time && carts[10].time == carts[11].time && carts[12].time == carts[13].time) {
          this.setData({ type: 'full' })
        } else {
          this.setData({ type: 'half' })
        }
      }else{
        this.setData({type: 'half'})
      }
    } 
  },

  // 表单提交
    formSubmit(e) {
      var paymentPo = {
        token: app.globalData.loginInfo.token,
        fieldId: this.data.fieldId,
        matchTimeStart: this.data.matchTimeStart,
        matchTimeEnd: this.data.matchTimeEnd,
        phone: e.detail.value.phone,
        realName: this.data.userInfo.nickName,
        teamName: e.detail.value.teamColor,
        teamColor: e.detail.value.teamName,
        note: e.detail.value.note,
        type: this.data.type
        // teamId:teamId,
        // phoneCode: phoneCode,
      }
      // console.log("表单提交数据:", paymentPo )
      this._formSub('/sportsFieldOrder/create',paymentPo,e)
    },
  // 应战
    formSubmitGuest(e) {
      var paymentPo = {
        token: app.globalData.loginInfo.token,
        fieldId: this.data.fieldId,
        orderId:this.data.orderId,
        phone: e.detail.value.phone,
        realName: this.data.userInfo.nickName,
        teamColor: e.detail.value.teamColor,
        teamName: e.detail.value.teamName,
        note: e.detail.value.note,
        // phoneCode: phoneCode,
      }
      // console.log("表单提交数据:", paymentPo)
      this._formSub('/sportsFieldOrder/engage',paymentPo,e)
    },
  //表单提交
    _formSub(url,paymentPo,e){
      const teamName = e.detail.value.teamName
      const teamColor = e.detail.value.teamColor
      const phone = e.detail.value.phone

      if (phone == "" || teamName == "") {
        wx.lin.showToast({
          title: '必填信息未填写完整~',
          icon: 'error',
          iconStyle: 'color:#7ec699; size: 40',
        })
      } else if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
        wx.lin.showToast({
          title: '手机号码有误',
          icon: 'error',
          iconStyle: 'color:#7ec699; size: 40',
        })
      }
      else {
        app.showLoading()
        var orderdetail = e.detail.value
        // 下单
        wx.request({
          url: app.globalData.baseURL + url,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: paymentPo,
          success: (res) => {
            console.log("表单提交success:", res)
            const resD = res.data.data
            const reg = RegExp(/预订时间段异常/);
            console.log("表单提交success:", resD)
            if (reg.test(resD)) {
              wx.lin.showDialog({
                type: "confirm",
                title: "所选时间不可用",
                content: "时间段已被他人捷足先登，继续选择其它时间段，或稍后再试",
                confirmText: '重新选择',
                success: (res) => {
                  if (res.confirm) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else if (res.data.code != 0 || !res.data.data) {
              wx.showModal({
                title: '订单提交失败',
                content: `res-1信息:${resD} / 出现错误，稍后再试。`,
                showCancel: false
              })
            } else {
              this._pay(res.data.data)
            }
          },
          fail: (error) => {
            console.log(error);
            wx.lin.showToast({
              title: '订单提交出错',
              icon: 'error',
              iconStyle: 'color:#7ec699; size: 40',
            })
          },
          complete: (msg) => {
            app.hideLoading()
          }
        })
      }
    },
  //支付
    _pay(orderId) {
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
        success: (res) => {
          console.log('pay.request成功', res)
          if (res.data.code != 0) {
            wx.showModal({
              title: '支付失败',
              content: `${res.data.code} / 失败信息:${res.data.data} `,
              showCancel: false
            })
            // 【请稍后重试或者联系客服。】
            return
          }

          var payId = res.data.data.payId
          if (!payId) {
            wx.showModal({
              title: '支付成功',
              content: '场地预订成功',
              showCancel: false,
              success: (res) => {
                wx.reLaunch({
                  url: '/pages/my/my'
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
            'success': (res) => {
              console.log('pay.requestPayment成功', res)
              wx.showModal({
                title: '支付成功',
                content: '场地预订成功！',
                showCancel: false
              })
            },
            'fail': (res) => {
              console.log('pay.requestPayment失败', res)
              wx.request({
                url: app.globalData.baseURL + 'sportsFieldPay/resetOrder',
                data: {
                  token: app.globalData.loginInfo.token,
                  payId: payId
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: (res1) => {
                  console.log('pay.resetOrder成功', res)
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
                fail: (res1) => {
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
        complete: (res) => {
          app.hideLoading()
        }
      })
    },
  // 初始化
    _init(lastRouteId) {
      if (app.globalData.loginInfo && app.globalData.loginInfo.inReview && app.globalData.loginInfo.inReview == 'N') {
        this.setData({
          inited: true
        })
      } else {
        this.setData({
          inited: true
        })
      }
    },
  // 获取用户信息
    _userAuthorized() {
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
            userInfo: data.userInfo
          })
          // console.log('userInfo:', data.userInfo)
          wx.hideLoading()
        })
    },

    _compare(property) {
      return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;     // 升序
      }
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

