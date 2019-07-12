import {
  EventModel
} from '../../models/event.js'

import {
  WxCacheModel
} from '../../models/wxcache.js'

const eventModel = new EventModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    events:{},
    more: '',
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad(optins) {
    wxCacheModel.get("events", eventModel.getEventList())
    this.getEvents()
  },

  // 创建赛事弹框
  openDg() {
    wx.showModal({
      content: '进驻赛事，请联系QQ123456789',
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.clearCache();
    this.getEvents()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (!isLoading) {
      if (this.data.prds && (this.data.prds.length % 6) == 0) {
        this.init(this.data.prds[this.data.prds.length - 1].routeId)
      }
    }
  },

  clearCache: function () {
    this.setData({
      events: {}
    });
  },

  getEvents: function () {
    const events = eventModel.getEventList()
    events.then(
      res => {
        this.setData({
          events: res.data
        })
        wxCacheModel.put("events", res.data, 1)
      }
    )
  },

})
