import {
  EventModel
} from '../../../models/event.js'

const eventModel = new EventModel()

//获取应用实例
const app = getApp()

Page({
  data: {
    sendList: [],
    event:null,

  },

  onLoad: function (options) {
    wx.showLoading()
    const bid = options.bid
    const detail = eventModel.getDetail(bid)

    console.log('获取到的赛事详情bid：')
    console.log(bid)

    detail.then(res => {
      console.log('获取赛事详情：')
      console.log(res)

        this.setData({
          event:res.data
      })
    })

  }


})