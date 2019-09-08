import {ReqModel} from '../../models/request.js'
import {WxCacheModel} from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const time = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    events:{},
    more: '',
    pagenumL:1
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad(options) {
    wxCacheModel.get("events", reqModel.getEventList())
    this._getEvents()
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this._clearCache();
    this._getEvents()
    wx.stopPullDownRefresh()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let pagenum = this.data.pagenum + 1; //获取当前页数并+1
    this.setData({
      pagenum: pagenum, //更新当前页数
    })
    this._getEvents();//重新调用请求获取下一页数据
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },

  // 创建赛事弹框
  onclick() {
    // wx.lin.showDialog({
    //   type: "alert",
    //   title: "进驻赛事",
    //   content: "请联系QQ123456789",
    //   success: (res) => {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })

    wx.showModal({
      title: '进驻赛事',
      content: '请联系QQ123456789',
    })
  },

  _clearCache: function () {
    this.setData({
      events: {}
    });
  },

  _getEvents: function () {
    const events = reqModel.getEventList()
    events.then(
      res => {
        const arr= res.data
        const events = arr.map((obj) => {
          let rObj = obj;
          rObj.insertTimea = time.toTime2(obj.insertTime);
          rObj.eventStartTimea = time.toTime2(obj.eventStartTime).slice(0, 10);
          rObj.eventEndTimea = time.toTime2(obj.stTimes).slice(0, 10);
          rObj.signupStartTimea = time.toTime2(obj.stTimes).slice(0, 13);
          rObj.signupEndTimea = time.toTime2(obj.stTimes).slice(0, 13);
          return rObj
        })
        this.setData({
          events: events,
        })
        wxCacheModel.put("events", res.data, 1)
        console.log('赛事列表:', events)
      },
    )
  }
})
