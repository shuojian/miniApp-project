import { promisic } from '../../../utils/common.js'
import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    // authorized: false,
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
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    this._getData(options)
  },
  /*申请加入*/
  applyForJoin(){
    wx.navigateTo({
      url: `../applyDesc/index?teamId=${this.data.team.teamId}`,
    })
  },
  /*踢出球队*/
  kickoutTeam(e) { 
    wx.showModal({
      title: '确定将其踢出球队？',
      content: '',
      type: "confirm",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          wx.request({
            url: app.globalData.baseURL + '/team/kickout',
            method: 'POST',
            data: {
              token: app.globalData.loginInfo.token,
              teamId: this.data.team.teamId,
              destUserCode: this.data.destUserCode,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: (res) => {
              console.log("踢出球队请求成功:", res)
              if (res.data.code == "-1") {
                wx.lin.showToast({
                  title: '踢出球队出现错误，稍后再试',
                  icon: 'error',
                  iconStyle: 'color:#ff0000; size: 60'
                })
              } else {
                wx.lin.showToast({
                  title: '踢出球队成功！',
                  icon: 'success',
                  iconStyle: 'color:#7ec699; size: 60',
                  success: () => {
                    console.log("请求成功:", res)
                  }
                })
              }
            },
            complete: (res) => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /*恢复球队*/
  enableTeam(e) {
    wx.request({
      url: app.globalData.baseURL + '/team/enable',
      method: 'POST',
      data: {
        token: app.globalData.loginInfo.token,
        teamId: this.data.team.teamId,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log("申请加入球队:", res)
        wx.lin.showToast({
          title: '申请已发送,等待确认~',
          icon: 'success',
          iconStyle: 'color:#7ec699; size: 60',
        })
      }
    })
  },
  /*修改队长*/
  changeTeamleader(e){
    wx.request({
      url: app.globalData.baseURL + '/team/changeTeamleader',
      method: 'POST',
      data: {
        token: app.globalData.loginInfo.token,
        teamId: this.data.team.teamId,
        destUserCode: this.data.destUserCode
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log("申请加入球队:", res)
        wx.lin.showToast({
          title: '申请已发送,等待确认~',
          icon: 'success',
          iconStyle: 'color:#7ec699; size: 60',
        })
      }
    })
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
        if (app.globalData.loginInfo !== null){
          const destUserCode = app.globalData.loginInfo.userCode //当前用户userCode
          if (destUserCode == creatorUserCode) {
            this.setData({
              isCreator: true,
              isTeam: true,
              isMember: true,
              isLink: true,
              destUserCode,
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
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
    }
  }
})