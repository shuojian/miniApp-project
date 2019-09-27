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

  onLoad(options) {
    this.getPageData()
  },

  //获取页面数据
  async getPageData () {
    const [gyms, swipers] = await Promise.all([reqModel.getGymList(), reqModel.getListSwiperImgs()]);
    wx.stopPullDownRefresh()
    this.setData({
      gyms: gyms.data,
      swipers: swipers.data
    })
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
    this.getPageData()
    wx.stopPullDownRefresh()
  },
  // 上拉触底
  onReachBottom() {
    let page = this.data.page + 1; //获取当前页数并+1
    this.setData({
      page, //更新当前页数
    })
    this.getPageData();//重新调用请求获取下一页数据
    wx.stopReachBottom()
  },

  _clearCache: function () {
    this.setData({
      gyms: {},
      swipers: []
    });
  }
})