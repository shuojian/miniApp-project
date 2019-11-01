import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()
Page({
  data: {
    noData: true,
    gyms:{},
    swipers:[],
    page: 1,        //请求页数
    pageLimit: 0,   //页面数据条数,全局配置
    pageCount: 0,   //总页数
    count:0,        //数据总数
    loading: false,
    loaded: false,
  },

  onLoad(options) {
    let pageLimit = app.globalData.pageLimit
    this.setData({ pageLimit })
    this.getPageData()
  },

  //获取页面数据
  async getPageData () {
    const [gyms, swipers] = await Promise.all([reqModel.getGymList(), reqModel.getListSwiperImgs()]);
    this.setData({ swipers: swipers.data})
    console.log('gyms -> ', gyms)
    if(gyms.data.length > 0){
      this.setData({
        noData: false,
        gyms: gyms.data,
        count: gyms.count,
        pageCount: Math.ceil(gyms.count / this.data.pageLimit),
      })
    }
  },

  async getMoreGyms() {
    let page = this.data.page
    let newGyms = await reqModel.getGymList(page)
    let gyms = this.data.gyms.concat(newGyms.data) //新旧数据合并
    this.setData({
      gyms
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
    if(this.data.page < this.data.pageCount){
      this.setData({
        loading: true,  //把"上拉加载"的变量设为false，显示 
        page: this.data.page + 1
      })
      this.getMoreGyms()// 上拉获取更多数据
    }else{
      this.setData({
        loading:false,
        loaded:true
      })
    } 
  },

  _clearCache: function () {
    this.setData({
      gyms: {},
      swipers: []
    });
  }
})