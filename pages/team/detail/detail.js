import { ReqModel } from '../../../models/request.js'
// import { WxCacheModel } from '../../../models/wxcache.js'
const util = require('../../../utils/util.js')
const reqModel = new ReqModel()
// const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    userInfo:{},
    isShow: false,
    isCreator: false,
    isTeam: false,
    isMember: false,
    creatorUserCode: null,      //球队创建者 UserCode
    destUserCode: null,         //当前用户 UserCode

    team:null,
    members:null,
    tabTitle: ['射手榜', '助攻榜', '黄牌榜'],
    isLink: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('userInfo ->', app.globalData)
    if (app.globalData.loginInfo){
      this.setData({
        userInfo: app.globalData.loginInfo,
        destUserCode: app.globalData.loginInfo.userCode
      })
    }
    this._getData(options)
  },

  /*获得页面数据*/
  _getData(o) {
    const bid = o.bid
    const detail = reqModel.getTeamDetail(bid)
    const members = reqModel.getListMember(bid)
    Promise.all([detail, members])
      .then(res => {
        const team = res[0].data //球队详情
        const members = res[1].data //球队队员
        const creator = members.find((x) => { return x.userCode == team.leaderUserCode }) //球队创建者
        const creatorUserCode = creator.userCode //球队创建者userCode
        if (app.globalData.loginInfo !== null) {
          this.setData({
            isLink: true,
            isTeam: true,
            isMember: true,
          })
          if (this.data.destUserCode == creatorUserCode) {
            this.setData({
              isCreator: true,
            })
          }
        }

        this.setData({
          team,
          members,
          creatorUserCode,
        })
        wx.hideLoading()
      })
  },
  
  /*申请加入*/
  applyForJoin(){
    wx.navigateTo({
      url: `../applyDesc/index?teamId=${this.data.team.teamId}`,
    })
  },

  /*踢出球队*/
  async kickoutTeam(e) { 
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.team.teamId,
      destUserCode: this.data.destUserCode,
    }
    try{
      await util.showModal('确定将其踢出球队？','',true)
      const reskickoutTeam = await reqModel.kickoutTeam(postData)
      if (reskickoutTeam.data.code == "-1") {
        util.showToast_error('踢出球队出现错误，稍后再试',)
      } else {
        util.showToast_success('踢出球队成功！',)
      }
    }catch(err){
      util.showToast_error('err')
      console.log('踢出球队err ->', err)
    }  
  },

  /*恢复球队*/
  async enableTeam(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.team.teamId,
    }
    try{
      await reqModel.enableTeam(postData)
      util.showToast_success('申请已发送,等待确认~')
    }catch(err){
      util.showToast_error('err')
      console.log('恢复球队err ->', err)
    }
  },

  /*修改队长*/
  async changeTeamleader(e){
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.team.teamId,
      destUserCode: this.data.destUserCode
    }
    try{
      await reqModel.changeTeamleader(postData)
      util.showToast_success('申请已发送,等待确认~')
    }catch(err){
      util.showToast_error('err')
      console.log('修改队长err ->', err)
    } 
  },

  _clearCache() {
    this.setData({
      team: {},
      members: {}
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this._clearCache();
    this._getData(options)
    wx.stopPullDownRefresh()
  },
  
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: app.globalData.shareTitle,
      // path: app.globalData.startUrl
      imageUrl: app.globalData.shareImgUrl
    }
  },
})