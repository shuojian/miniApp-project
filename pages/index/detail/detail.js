import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const time = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({
  data:{
    event:{},
    stTime:null,
    edTime:null,
    sstTime:null,
    sedTime:null,

    listTeam:{},
    listTeamGroup:{},
    matchs:{},
    tabTitle: ['射手榜', '助攻榜', '黄牌榜'],
    listMember:{},
  },

  onLoad: function (options) {
    wx.showLoading()
    const bid = options.bid
    console.log('赛事Id：',bid)
    const detail = reqModel.getEventDetail(bid)
    const eventListTeam = reqModel.getEventListTeam(bid)
    const eventListTeamGroup = reqModel.getEventListTeamGroup(bid)
    const eventMatch = reqModel.getEventMatch(bid)
    const eventListMember = reqModel.getEventListMember(bid)

    Promise.all([detail, eventListTeam, eventListTeamGroup, eventMatch, eventListMember])
      .then(res => {
        // console.log('赛事详情：', res[0].data)
        // console.log('参赛球队：', res[1].data)
        // console.log('赛事积分：', res[2].data)
        // console.log('赛程赛果：', res[3].data)
        // console.log('赛事榜单：', res[4].data)

            var stTimes = res[0].data.eventStartTime//获得时间
            var edTimes = res[0].data.eventEndTime
            var sstTimes = res[0].data.signupStartTime
            var sedTimes = res[0].data.signupEndTime
            var stTimea = time.toTime2(stTimes)//时间戳转时间
            var edTimea = time.toTime2(edTimes)
            var sstTimea = time.toTime2(sstTimes)
            var sedTimea = time.toTime2(sedTimes)
        var stTime = stTimea.slice(0, 10)//截取时间
        var edTime = edTimea.slice(0, 10)
        var sstTime = sstTimea.slice(0, 10)
        var sedTime = sedTimea.slice(0, 10)

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