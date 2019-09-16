import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()
Page({
  data: {
    gyms:{},
    swipers:[],
    page:1
  },

  onLoad: function (options) {
    // wxCacheModel.get("gyms", reqModel.getGymList())
    // wxCacheModel.get("swipers", reqModel.getListSwiperImgs())
    this._getGyms()
  },

  _getGyms: function () {
    const gyms = reqModel.getGymList()
    const swipers = reqModel.getListSwiperImgs()
    gyms.then(
      res => {
        wx.stopPullDownRefresh()
        this.setData({
          gyms: res.data,
        })
        // console.log('场馆列表：', res.data)
        wxCacheModel.put("gyms", res.data, 1)
    })
    swipers.then(
      res => {
        this.setData({
          swipers: res.data
        })
      }
    )
  },

  _clearCache: function () {
    this.setData({
      gyms: {},
      swipers:[]
    });
  },

  toFields(){
    wx.navigateTo({
      url: 'fields/index'
    })
  },
  toFields11() {
    wx.navigateTo({
      url: `fields/index?key=two`
    })
  },

  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this._clearCache()
    this._getGyms()
    wx.stopPullDownRefresh()
  },
  // 上拉触底
  onReachBottom() {
    let page = this.data.page + 1; //获取当前页数并+1
    this.setData({
      page, //更新当前页数
    })
    this.getGyms();//重新调用请求获取下一页数据
    wx.stopReachBottom()
  }
})