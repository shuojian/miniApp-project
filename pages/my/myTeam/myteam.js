import { ReqModel } from '../../../models/request.js'
// import { WxCacheModel } from '../../../models/wxcache.js'
const reqModel = new ReqModel()
// const wxCacheModel = new WxCacheModel()

Page({
  data: {
    myTeams: {},
    nodata: true,
    isCreat:true,
    pagenum:1
  },

  onLoad(options) {
    this.getMyTeams()
  },

  getMyTeams(){
    wx.showLoading()
    const myTeam = reqModel.getMyTeam()
    myTeam.then(
      res => {
        console.log('myteam:', res.data)
        if (res.data.length >= 3) {
          this.setData({
            isCreat: false
          })
        }
        this.setData({
          myTeams: res.data,
          nodata: false
        })
        wx.hideLoading()
      })
  },
  clearCache: function () {
    this.setData({
      myTeams: {}
    });
  },
  creatTeam() {
    wx.navigateTo({
      url: "../newTeam/newteam"
    })
  },

    //下拉刷新
  onPullDownRefresh: function () {
    this.clearCache();
    this.getMyTeams()
    wx.stopPullDownRefresh()
  },
  
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let pagenum = this.data.pagenum + 1; //获取当前页数并+1
    this.setData({
      pagenum: pagenum, //更新当前页数
    })
    this.getMyTeams();//重新调用请求获取下一页数据
  }

})
