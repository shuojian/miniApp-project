// pages/logs/realName/realName.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realNameRules: [{
      required: true
    },
    {
      min: 2,
      max: 5,
      message: '长度需要在2-3个字符之间'
    }
    ],
    idCardRules:[{
      required: true
    },
      {
        min: 14,
        max: 18,
        message: '长度需要在14-18位之间'
      }
    ]

  },

  onLoad: function (options) {

  },


  formSubmit: function (e) {
    console.log('form提交：', e.detail.value)
    app.showLoading()

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
            success(){
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/my/my',
                }), 3000})
            }
          })
        } 
      },
      fail: error => {
        console.log(error);
        wx.lin.showToast({
          title: '提交出错，稍后重试~',
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