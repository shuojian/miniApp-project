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
  onTap() {
    wx.lin.showDialog({
      type: "alert",
      title: "进驻赛事",
      content: "请联系QQ123456789"
    })
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