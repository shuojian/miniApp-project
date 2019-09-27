import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    teams:null,

    page: 1,        //请求页数
    pageLimit: 0,   //页面数据条数,全局配置
    pageCount: 0,   //总页数
    count:0,        //数据总数
    loading: false,
    loaded: false,
    // inputShowed: false,
    // inputVal: "",
  },

  onLoad() {
    let pageLimit = app.globalData.pageLimit
    this.setData({ pageLimit })

    this.getTeams()
  },

  async getTeams() {
    const teams = await reqModel.getTameList()
    wx.stopPullDownRefresh()
    this.setData({
      teams: teams.data,
      count: teams.count,
      pageCount: Math.ceil(teams.count / this.data.pageLimit),
    })
  },

  async getMoreTeams() {
    let page = this.data.page
    let newTeams = await reqModel.getTameList(page)
    wx.stopPullDownRefresh()
    let teams = this.data.teams.concat(newTeams.data) //新旧数据合并
    this.setData({
      teams
    })
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },

  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      loaded:false
    })
    this._clearCache();
    this.getTeams()
  },

  // 上拉触底
  onReachBottom() {
    if(this.data.page < this.data.pageCount){
      this.setData({
        loading: true,  //把"上拉加载"的变量设为false，显示 
        page: this.data.page + 1
      })
      this.getMoreTeams()// 上拉获取更多数据
    }else{
      this.setData({
        loading:false,
        loaded:true
      })
    }  
  },

  _clearCache() {
    this.setData({
      teams: null
    });
  },
})