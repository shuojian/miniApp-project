import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    teams:[],
    page: 1,//请求页数
    pageLimit: 0,//页面数据条数
    pageCount: 0,//总页数
    count:0,//数据总数
    loading: false,
    loaded: false,
    // inputShowed: false,
    // inputVal: "",
  },

  onLoad() {
    wxCacheModel.get("teams", reqModel.getTameList())
    let pageLimit = app.globalData.pageLimit
    this.setData({ pageLimit })
    this._getTeams()
  },

  _getTeams() {
    const teams = reqModel.getTameList()
    teams.then(
      res=>{
        wx.stopPullDownRefresh()
        this.setData({
          teams: res.data,
          count: res.count,
          pageCount: Math.ceil(res.count / this.data.pageLimit),
        })
        wxCacheModel.put("teams", res.data, 1)
      }
    )
  },
  _getMoreTeams() {
    let page = this.data.page
    console.log('数据加载情况',this.data.teams.length)
    const teams = reqModel.getTameList(page)
    teams.then(
      (res) => {
        wx.stopPullDownRefresh()
        const teams = this.data.teams.concat(res.data) //新旧数据合并
        this.setData({
          teams
        })
        wxCacheModel.put("teams", res.data, 1)
      })
  },

  _clearCache() {
    this.setData({
      teams: []
    });
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
    this._getTeams()
  },

  // 上拉触底
  onReachBottom() {
    if(this.data.page < this.data.pageCount){
      this.setData({
        loading: true,  //把"上拉加载"的变量设为false，显示 
        page: this.data.page + 1
      })
      this._getMoreTeams()// 上拉获取更多数据
    }else{
      this.setData({
        loading:false,
        loaded:true
      })
    }  
  }
})