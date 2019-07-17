// pages/logs/logs.js

const util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    size:"请选择尺寸",
    array: ['选择尺码','S码', 'M码', 'L码', 'XL码', '2XL','3XL'],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            // authorized: true,
          })
        }
      })
    }
  },

  toRealName(){
    wx.navigateTo({
      url: 'realName/realName',
    })
  },
  changeImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  changeNickName() {
    wx.lin.showDialog({
      type: "confirm",
      title: "输入昵称",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            src: res.tempImagePath
          })
        } 
      }
    })
  },
  pickerChange: function (e) {
    console.log("size:",e.detail)
    this.setData({
      index: e.detail.value
    })
  },


})

