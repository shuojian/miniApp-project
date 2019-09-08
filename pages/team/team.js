import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    teams:[],
    searching: false,
    more:'',
    
    inputShowed: false,
    inputVal: "",

    page: 1,
    pageLimit: 15,
    hasMoreData: false,
  },

  onLoad(o) {
    wxCacheModel.get("teams", reqModel.getTameList())
    this._getTeams()
  },

  _getTeams() {
    let page = this.data.page
    let pageLimit = this.data.pageLimit
    const teams = reqModel.getTameList(page, pageLimit)
    teams.then(
      res => {
        let teamList = this.data.teams
        if (this.data.page == 1) {
          teamList = []
        }
        const teams = res.data
        if (teams.length < this.data.pageLimit){
          this.setData({
            teams: teamList.concat(teams),
            hasMoreData:false
          })
        }else{
          this.setData({
            teams: teamList.concat(teams),
            hasMoreData: true,
            page:this.data.page + 1
          })
        } 
        wxCacheModel.put("teams", res.data, 1)
        console.log("球队：", res.data)
      }
    )
  },

  _clearCache() {
    this.setData({
      teams: []
    });
  },

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
    this.data.page = 1
    this._clearCache();
    this._getTeams()
    wx.stopPullDownRefresh()
  },

  // 上拉触底
  onReachBottom() {
    let page = this.data.page + 1; //获取当前页数并+1
    if(this.data.hasMoreData) {
      this.getTeams(page)
      this.setData({
        page
      })
    }else{
      this.setData({
        hasMoreData:false
      })
      // wx.showToast({
      //   title: '已经到底了',
      // })
      wx.lin.showMessage({
        content: '数据已全部加载完成~'
      })
    } 
  }
})