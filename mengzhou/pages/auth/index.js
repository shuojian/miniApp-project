// pages/login/auth/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

  },

  
//其中利用backtype来确认授权登录后跳转回那个页面
  bindGetUserInfo: function (e) {
    let backtype = this.data.backType;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      if (backtype == 'index') {
        wx.switchTab({
          url: '../../index/index'
        })
      } else if (backtype == 'my') {
        wx.switchTab({
          url: '../../my/my'
        })
      } else {
        wx.redirectTo({
          // url: '../detail/detail?blogId=' + backtype
          url: '../../my/my'
        })
      }
    } else {
      this.showZanTopTips('很遗憾，您拒绝了微信授权');
    }
  },

  navigateBack:function(){
    wx.switchTab({
      url: '../../event/event'
    })
  }

})