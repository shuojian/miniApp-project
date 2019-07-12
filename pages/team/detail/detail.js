// pages/team/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentTabSub: 5,

    tabTitle: ['球队详情', '球队队员', '球队统计']
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

  currentTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.current });
  },
  switchTab(e) {
    this.setData({ currentTabSub: e.currentTarget.dataset.idx });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})