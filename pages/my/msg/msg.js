import { ReqModel } from '../../../models/request.js'

const reqModel = new ReqModel()
const util = require('../../../utils/util.js')
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
    // console.log('传递数据:', o)
    const bid = o.bid
    // const team = o.team
    this.setData({
      teamId: bid,
      destUserCode: app.globalData.loginInfo.userCode
    })
    this._getMyTeamMsgs(bid)

  },

  _getMyTeamMsgs(bid) {
    const token = app.globalData.loginInfo.token
    const myTeamMsgs = reqModel.getMyTeamMsgs(bid, token)
    myTeamMsgs.then(
      res => {
        console.log('myTeamMsgs:', res)
        this.setData({
          myTeamMsgs: res.data,
        })
      })
  },

  /*批准加入*/
  async accept(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
      destUserCode: this.data.destUserCode
    }
    const res = await reqModel.applyAcceptTeam(postData)
    if (res.data.code == "-1") {
      util.showToast_error('你已拒绝或已接受')
    } else {
      util.showToast_success('已批准对方加入球队')
    }
  },
  /*拒绝加入*/
  async reject(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
      destUserCode: this.data.destUserCode,
    }
    const res = await reqModel.applyRefuseTeam(postData)
    if (res.data.code == "-1") {
      util.showToast_error('你已拒绝或已接受')
    } else {
      util.showToast_success('已批准对方加入球队')
    }
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