import {
  FieldModel
} from '../../models/field.js'

import {
  WxCacheModel
} from '../../models/wxcache.js'

const fieldModel = new FieldModel()
const wxCacheModel = new WxCacheModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gyms:{},
    more: '',

    mode: "scaleToFill",
    arr: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var array = this.data.arr
    for (let i = 1; i < 4; i++) {
      array.push("../../img/" + i + ".jpg")
    }
    this.setData({ arr: array })

    wxCacheModel.get("gyms", fieldModel.getGymList())
    this.getGyms()
  },

   //下拉刷新
  onPullDownRefresh: function () {
    this.clearCache()
    this.getGyms()
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
      gyms: {}
    });
  },


  getGyms: function () {
    const gyms = fieldModel.getGymList()
    gyms.then(
      res => {
        this.setData({
          gyms: res.data
        })
        wxCacheModel.put("gyms", res.data, 1)
      })
  },

})