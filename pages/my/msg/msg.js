import { ReqModel } from '../../../models/request.js'

const reqModel = new ReqModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myTeamMsgs:{},
    teamId:null,
    destUserCode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    // console.log('传递数据:', o, app.globalData.loginInfo)
    const bid = o.bid
    // const team = o.team
    this.setData({
      teamId: bid,
      destUserCode: app.globalData.loginInfo.userCode
    })
    this._getMyTeamMsgs(bid)

  },

  _getMyTeamMsgs(bid) {
    wx.showLoading()
    const myTeamMsgs = reqModel.getMyTeamMsgs(bid)
    myTeamMsgs.then(
      res => {
        // console.log('myTeamMsgs:', res)
        this.setData({
          myTeamMsgs: res.data,
        })
        wx.hideLoading()
      })
  },

  /*批准加入*/
  accept(e) {
    wx.showLoading(),
    wx.request({
      url: app.globalData.baseURL + '/team/join',
      method: 'POST',
      data: {
        token: app.globalData.loginInfo.token,
        teamId: this.data.teamId,
        destUserCode: this.data.destUserCode
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log("批准:", res)
        if (res.data.code == "-1") {
          wx.lin.showToast({
            title: '你已拒绝或已接受',
            icon: 'error',
            iconStyle: 'color:#FF0000; size: 60',
          })
        } else {
          wx.lin.showToast({
            title: '已批准对方加入球队',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 60',
          })
        }
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },
  /*拒绝加入*/
  reject(e) {
    wx.showLoading(),
    wx.request({
      url: app.globalData.baseURL + '/team/reject',
      method: 'POST',
      data: {
        token: app.globalData.loginInfo.token,
        teamId: this.data.teamId,
        destUserCode: this.data.destUserCode,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log("拒绝:", res)
        if (res.data.code == "-1") {
          wx.lin.showToast({
            title: '你已拒绝或已接受',
            icon: 'error',
            iconStyle: 'color:#FF0000; size: 60',
          })
        } else {
          wx.lin.showToast({
            title: '已批准对方加入球队',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 60',
          })
        }
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
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
})