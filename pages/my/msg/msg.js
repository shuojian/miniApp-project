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
    const team = JSON.parse(o.team) //接收到的传值数据
    console.log('传递数据-->', team)
    const bid = team.teamId
    this.setData({
      teamId: bid,
      destUserCode: team.leaderUserCode
    })
    this._getMyTeamMsgs(bid)
  },

  _getMyTeamMsgs(bid) {
    if (app.globalData.loginInfo) {
      const token = app.globalData.loginInfo.token
      const myTeamMsgs = reqModel.getMyTeamMsgs(bid, token)
      myTeamMsgs.then(
        res => {
          console.log('myTeamMsgs-->', res)
          if(res.data){
            if (res.data.length > 0) {
              const v1 = res.data
              const msgs = v1.map((obj) => {
                let rObj = obj;
                rObj.applyTime = util.toTime(obj.insertTime)
                return rObj
              })
              this.setData({
                myTeamMsgs: msgs,
              })
            }
          }
        }
      )
    }
  },

  /*批准加入*/
  async accept(e) {
    console.log('批准-->', e.currentTarget.dataset)
    const applyInfo = e.currentTarget.dataset.applyinfo
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: applyInfo.teamId, //*球队ID
      destUserCode: applyInfo.userCode//*申请人ID
    }
    const res = await reqModel.applyAcceptTeam(postData)
    // console.log('接受res->', res)
    if (res.code == "-1") {
      util.showToast_error('你已拒绝或已接受')
    } else {
      util.showToast_success('已批准对方加入球队')
    }
  },
  /*拒绝加入*/
  async reject(e) {
    console.log('拒绝-->', e.currentTarget.dataset)
    const applyInfo = e.currentTarget.dataset.applyinfo
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: applyInfo.teamId, //*球队ID
      destUserCode: applyInfo.userCode//*申请人ID
    }
    const res = await reqModel.applyRefuseTeam(postData)
    if (res.code == "-1") {
      util.showToast_error('你已拒绝或已接受')
    } else {
      util.showToast_success('已批准对方加入球队')
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      myTeamMsgs: {}
    })
    this._getMyTeamMsgs(this.data.teamId)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})