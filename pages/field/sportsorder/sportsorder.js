// pages/field/sportsorder/sportsorder.js
var util = require('../../../utils/util.js')

//获取应用实例
var app = getApp()
var isLoading = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    phone:"",
    matchTimeStart: "",
    matchTimeEnd: "",
    realName: "",
    fieldId: "",
    teamId: "",
    hidePost: true,
    lastRouteId: null,
    authLogin: true,
  },


  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    app.getUserInfo( (userInfo)=> {
      this.setData({
        userInfo: userInfo
      })
    })
  },


formSubmit: function (e)  {
    console.log('提交订单：', e.detail.value)
    app.showLoading()

    wx.request({
      url: app.globalData.baseURL + '/sportsFieldOrder/create',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        token: app.globalData.loginInfo.token,

        fieldId: that.data.phone,
        phone: that.data.phone,
        matchTimeStart: that.data.matchTimeStart,
        matchTimeEnd: that.data.matchTimeEnd,
        realName: that.data.realName,
        teamId: that.data.realName,
        sportsField: res.data.data.sportsField,
        fieldId: that.data.fieldId,
      },
      
      success: res=> {
        if (res.data.code == 0 && res.data.data) {
          that.setData({
            coinKen: res.data.data.user.coinKen || 0,
            giftAmount: res.data.data.user.giftAmount || 0,
            rebateAmount: res.data.data.user.rebateAmount || 0,
            points: res.data.data.user.points || 0,
            // signed: res.data.data.checkSign == 'signed',
            // isEmployee: res.data.data.user.isEmployee == 'Y',
            // isCertified: res.data.data.user.isCertified == 'Y',
            // allCount: res.data.data.allCount || 0,
            // newCount: res.data.data.newCount || 0,
            // dispatchedCount: res.data.data.dispatchedCount || 0,
            // finishedCount: res.data.data.finishedCount || 0
          })
        }
        
        if(res.data){
          var data=res.data;
          wx.requesPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            'success': res => {
              console.log('"支付成功！"')
            },
            'fail': res => {
              console.log(res)
            }
          })
        }
        wx.showToast({
          title: '订单提交成功！',
          icon: 'success',
          duration: 2000
        })
      },

      fail: error=> {
        console.log(error);
        wx.showToast({
          title: '订单提交出错',
          icon: 'none',
          duration: 2000
        })
      },
      complete: msg=> {
        app.hideLoading()
        console.log('msg:')
        console.log(msg)
      }
    })
  }
 
})

