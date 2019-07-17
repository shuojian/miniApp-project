import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    gyms:{},
    more: '',

    mode: "scaleToFill",
    arr: [],
    swipers:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 300,
    page:1
  },

  onLoad: function (options) {
    var array = this.data.arr
    for (let i = 1; i < 4; i++) {
      array.push(`../../img/${i}.jpg`)
    }
    this.setData({ arr: array })
    wxCacheModel.get("gyms", reqModel.getGymList())
    this._getGyms()
  },

  _clearCache: function () {
    this.setData({
      gyms: {}
    });
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
      // path: '/page/user?id=123'
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this._clearCache()
    this._getGyms()
    wx.stopPullDownRefresh()
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let page = this.data.page + 1; //获取当前页数并+1
    this.setData({
      page, //更新当前页数
    })
    this.getGyms();//重新调用请求获取下一页数据
    wx.stopReachBottom()
  }
})