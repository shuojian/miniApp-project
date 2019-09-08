import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const time = require('../../../utils/util.js')
const app = getApp()

Page({
  data:{
    event:{},
    listTeam:{},
    listTeamGroup:{},
    matchs:{},
    listMember:{},
    stTime:null,
    edTime:null,
    sstTime:null,
    sedTime:null,
    tabTitle: ['射手榜', '助攻榜', '黄牌榜'], 
  },

  onLoad: function (options) {
    wx.showLoading()
    const bid = options.bid
    wxCacheModel.get("event", reqModel.getEventDetail(bid))
    wxCacheModel.get("listTeam", reqModel.getEventListTeam(bid))
    wxCacheModel.get("listTeamGroup", reqModel.getEventListTeamGroup(bid))
    wxCacheModel.get("matchs", reqModel.getEventMatch(bid))
    wxCacheModel.get("listMember",  reqModel.getEventListMember(bid))
    this._getPageData(bid)
  },

  _getPageData(eventId){
    const detail = reqModel.getEventDetail(eventId)
    const eventListTeam = reqModel.getEventListTeam(eventId)
    const eventListTeamGroup = reqModel.getEventListTeamGroup(eventId)
    const eventMatch = reqModel.getEventMatch(eventId)
    const eventListMember = reqModel.getEventListMember(eventId)
    Promise.all([detail, eventListTeam, eventListTeamGroup, eventMatch, eventListMember])
    .then(res => {
      // console.log('赛事详情：', res[0].data)
      // console.log('参赛球队：', res[1].data)
      // console.log('赛事积分：', res[2].data)
      // console.log('赛程赛果：', res[3].data)
      // console.log('赛事榜单：', res[4].data)
        let stTimes = res[0].data.eventStartTime//获得时间
        let edTimes = res[0].data.eventEndTime
        let sstTimes = res[0].data.signupStartTime
        let sedTimes = res[0].data.signupEndTime
        let stTimea = time.toTime2(stTimes)//时间戳转时间
        let edTimea = time.toTime2(edTimes)
        let sstTimea = time.toTime2(sstTimes)
        let sedTimea = time.toTime2(sedTimes)
      let stTime = stTimea.slice(0, 10)//截取时间
      let edTime = edTimea.slice(0, 10)
      let sstTime = sstTimea.slice(0, 10)
      let sedTime = sedTimea.slice(0, 10)

      this.setData({
        event: res[0].data,
        listTeam: res[1].data,
        listTeamGroup: res[2].data,
        matchs: res[3].data,
        listMember: res[4].data,
        stTime:stTime,
        edTime:edTime,
        sstTime:sstTime,
        sedTime:sedTime,
      })
      wx.hideLoading()
    })
  },
  _clearCache(){
    this.setData({
      event: {},
      listTeam:{},
      listTeamGroup:{},
      matchs:{},
      listMember:{}
    });
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl,
    }
  },
  //下拉刷新
  onPullDownRefresh(){
      this._clearCache()
      this._getPageData()
      wx.stopPullDownRefresh()
  }
})