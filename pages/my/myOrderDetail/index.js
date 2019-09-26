import { ReqModel } from '../../../models/request.js'

const reqModel = new ReqModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const bid = options.bid
    const token = app.globalData.loginInfo.token 
    const detail = reqModel.getMyOrderDetail(bid, token)

    detail.then(res => {
      const v1 = res.data
      // const start = this.formatTo(v1.matchHourStart,time) 
      // const end = this.formatTo(v1.matchHourEnd,time) 
      v1.day = `${this.formatTo(v1.matchDay)}`
      v1.start = `${this.formatTo(v1.matchHourStart, "time")}`
      v1.end = `${this.formatTo(v1.matchHourEnd, "time")}`
      this.setData({
        orderDetail: v1,
      })
      console.log('我的订单详情：', v1)
    })
  },


  formatTo(time, format = 'date') {
    if (format == 'date') {
      const toT = time.toString()
      const year = toT.substr(0, 4)
      const month = toT.substr(4, 2)
      const date = toT.substr(6, 2)
      return `${year}.${month}.${date}`
    } else if (format == 'time') {
      const toT = time.toString()
      const hour = toT.substr(0, 2)
      const sconde = toT.substr(2, 2)
      return `${hour}:${sconde}`
    }
  },
  
})