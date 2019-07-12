Page({

  /**
   * 页面的初始数据
   */
  data: {
    myevent:{},
    nodata: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  // 创建赛事弹框
  openDg() {
    wx.showModal({
      content: '进驻赛事，请联系QQ123456789',
    })
  }


})