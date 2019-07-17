import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()

var app = getApp()

Page({
  data: {
    team:null,
    members:null,
    tabTitle: ['射手榜', '助攻榜', '黄牌榜'],
    isShow:false,
    isCreator:false,
    isTeam:false,
    isMember:false,
    creatorUserCode: String,
    destUserCode: String,
    isLink: false,
    token:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    this._getData(options)
  },
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
  _getData(options) {
    const bid = options.bid
    console.log('team详情：', options)
    const detail = reqModel.getTeamDetail(bid)
    const members = reqModel.getListMember(bid)
    const varToken = app.globalData.loginInfo.token
    this.setData({
      token: varToken
    })
    Promise.all([detail, members])
      .then(res => {
        const team = res[0].data
        const members = res[1].data
        const creator = members.find(
          (x) => {
            return x.userCode == team.leaderUserCode
          })
        const creatorUserCode = creator.userCode
        if (app.globalData.loginInfo.userCode == creatorUserCode) {
          this.setData({
            isCreator: true,
            isTeam: true,
            isMember: true,
            isLink: true,
            destUserCode: app.globalData.loginInfo.userCode
          })
        }
        this.setData({
          team: team,
          members: members,
          creatorUserCode: creatorUserCode,
        })
        //console.log('创建者VS当前用户vs创建者Code:', creator.userCode, app.globalData.loginInfo.userCode, creatorUserCode)
        console.log('球隊詳情：', team)
        console.log('球员：', members)
        wx.hideLoading()
      })

    // wxCacheModel.get("team", reqModel.getTeamDetail())
    // wxCacheModel.get("members", reqModel.getListMember())
  },
  _clearCache: function () {
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