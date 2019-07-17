// pages/team/detail/applyDesc/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('接收参数：', options)
    const teamId = options.teamId
    this.setData({
      teamId: teamId
    })
  },

  /* 申请加入球队*/
  formSubmit(e){
    console.log('加入理由：', e.detail.value)
    if (e.detail.value.applyDesc == "") {
      wx.lin.showToast({
        title: '加入理由为空',
        icon: 'error',
        iconStyle: 'color:#ff0000; size: 80',
      })
    } else {
      wx.request({
        url: app.globalData.baseURL + '/team/applyForJoin',
        method: 'POST',
        data: {
          token: app.globalData.loginInfo.token,
          teamId: this.data.teamId,
          applyDesc: e.detail.value
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          console.log("申请加入球队:", res)
          wx.lin.showToast({
            title: '申请已发送,等待确认~',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 80',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                }), 3000
              })
            }
          })
        }
      })
    }
  }

})