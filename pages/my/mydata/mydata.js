// pages/my/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isTeam: false,

    myDataCount: [
      {
        id: 0,
        text: "出勤率",
        num: 0
      },
      {
        id: 1,
        text: "胜",
        num: 0
      },
      {
        id: 2,
        text: "平",
        num: 0
      },
      {
        id: 3,
        text: "负",
        num: 0
      },
      {
        id: 4,
        text: "进球",
        num: 0
      },
      {
        id: 5,
        text: "助攻",
        num: 0
      },
      {
        id: 6,
        text: "黄牌",
        num: 0
      },
      {
        id: 7,
        text: "红牌",
        num: 0
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})

