// pages/logs/logs.js

const util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    motto: '你好，欢迎登陆梦舟',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    array: ['S码', 'M码', 'L码', 'XL码', '2XL','3XL'],
    objectArray: [
      {
        id: 0,
        name: 'S码'
      },
      {
        id: 1,
        name: 'M码'
      },
      {
        id: 2,
        name: 'L码'
      },
      {
        id: 3,
        name: 'XL码'
      },
      {
        id: 4,
        name: '2XL'
      },
      {
        id: 5,
        name: '3XL'
      }
    ],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      this.setData({
        logs: (wx.getStorageSync('logs') || []).map(log => {
          return util.formatTime(new Date(log))
        })
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 衣服尺寸
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  choseImgMethod() {
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
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
  takePhoto(){
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality:'high',
      success:(res)=>{
        this.setData({
          src:res.tempImagePath
        })
      }
    })
  },
  error(e){
    console.log(e.detail)
  },

  openAlter() {
    wx.showModal({
      content: '请输入昵称',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

