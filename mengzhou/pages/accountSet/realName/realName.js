// pages/logs/realName/realName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  choice: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths
        that.setData({
          textHidden: true,
          image_photo: tempFilePaths,
          photoHidden: false
        })
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
      url: 'https://testapi.****.com/v4.0.0/uploadParkingPhoto', //仅为示例  
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  pic: function (options) {
    wx.chooseImage({ 
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
      var tempFilePaths = res.tempFilePaths 
      } 
      }) 
      }, 
      fail: function (res) { 
        console.log(res.errMsg) 
      },

  choseImgMethod() {
    var that = this; 
    wx.showActionSheet({ 
      itemList: ['从相册中选择', '拍照'], 
      itemColor: "#3b5999", 
      success: function (res) { 
        if (!res.cancel) { 
          if (res.tapIndex == 0) { 
            that.chooseWxImage('album') 
          } else if (res.tapIndex == 1) { 
            that.chooseWxImage('camera') 
            } 
          } 
        } 
      })
  },
  chooseWxImage: function (type) { 
    var that = this; 
    wx.chooseImage({ 
      sizeType: ['original', 'compressed'], 
      sourceType: [type], 
      success: function (res) { 
        console.log(res); 
        that.setData({ 
          tempFilePaths: res.tempFilePaths[0],
        }) 
      } 
    }) 
  },
  chooseWxPhoto: function (type) {
    var that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },




  choseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  }
})