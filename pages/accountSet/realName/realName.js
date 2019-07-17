// pages/logs/realName/realName.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tip: '',
    realName: '',
    idCard: '',
    // canSubmit:true,

    idCardRules:[{
      required: true
    },
      {
        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
        message: '身份证号码有误'
      }
    ] 
  },

  onLoad: function (options) {
    // if (this.data.realName.length > 1 && this.data.idCard.length > 14 ){
    //   this.setData({
    //     canSubmit:false
    //   })
    // }
  },

  onChangeRealName(event) {
    var realName = event.detail.detail.value
    this.setData({
      realName: realName
    })
    // this.data.realName = realName
  },
  onChangeIdcard(event) {
    var idCardNum = event.detail.detail.value
    this.setData({
      idCard: idCardNum
    })
    // this.data.idCard = idCardNum
  },

  formSubmit: function (e) {
    var realName = e.detail.value.realName
    var idCard = e.detail.value.idCard
    console.log('form提交：', e.detail.value)
    if (realName == "" || idCard==""){
      wx.lin.showToast({
        title: '姓名和身份证号不能为空',
        icon:'error',
        iconStyle: 'color:#7ec699; size: 60',
      })
    }else(
      // this.setData({
      //   canSubmit: false
      // }),
      app.showLoading(),
      wx.request({
        url: app.globalData.baseURL + '/',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          token: app.globalData.loginInfo.token,
          idCard: e.detail.value.idCard,
          realName: e.detail.value.realName,
          idImage: e.detail.value.idImage
        },
        success: res => {
          if (res.data) {
            wx.lin.showToast({
              title: '成功提交,等待审核~',
              icon: 'success',
              iconStyle: 'color:#7ec699; size: 60',
              success() {
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/my/my',
                  }), 5000
                })
              }
            })
          }
        },
        fail: error => {
          console.log(error);
          wx.lin.showToast({
            title: '网络出问题，稍后重试~',
            icon: 'error',
            iconStyle: 'color:#7ec699; size: 60',
          })
        },
        complete: msg => {
          app.hideLoading()
          console.log('msg:')
          console.log(msg)
        }
      })
    ) 
  },

  uploadPhoto: function () {
    var that = this
    let param = util.json2Form({
      tel: '18600346580',
      orderSn: that.data.orderSn,
      parkingPhoto: that.data.image_photo,
    });
    wx.uploadFile({
      url: '1',
      filePath: that.data.image_photo[0],
      name: 'parkingPhoto',
      formData: {
        'tel': '***********',
        'orderSn': that.data.orderSn,
      },
      success: function (res) {
        var obj = JSON.parse(res.data);;
        console.log(obj.result)
        console.log(obj.msg)
        var resule = obj.result;
        var msg = obj.msg;
        if (resule == 'false') {
          wx.showToast({
            title: msg,
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.navigateBack({
            delta: 1,
            success: function (res) {
              wx.showToast({
                title: msg,
                icon: 'success',
                duration: 2000
              })
            },

          })
        }
      }
    })
  },

  
})