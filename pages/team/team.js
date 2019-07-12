import { 
  TeamModel 
} from '../../models/team.js'

import {
  WxCacheModel
} from '../../models/wxcache.js'

const teamModel = new TeamModel()
const wxCacheModel = new WxCacheModel()

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    teams:{},
    searching: false,
    more:'',
    
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wxCacheModel.get("teams", teamModel.getTameList())
    this.getTeams()
  },

 
  //下拉刷新
  onPullDownRefresh: function () {
    this.clearCache();
    this.getTeams()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (!isLoading) {
      if (this.data.prds && (this.data.prds.length % 6) == 0) {
        this.init(this.data.prds[this.data.prds.length - 1].routeId)
      }
    }
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  clearCache: function () {
    this.setData({
      teams: {}
    });
  },

  getTeams: function () {
    const teams = teamModel.getTameList()
    teams.then(
      res => {
        this.setData({
          teams: res.data
        })
        wxCacheModel.put("teams", res.data, 1)
      }
    )
  },

})