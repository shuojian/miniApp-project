// import { WxCacheModel } from '../../../models/wxcache.js'
// const wxCacheModel = new WxCacheModel()
import { promisic } from '../../../utils/common.js'
import { ReqModel } from '../../../models/request.js'
const reqModel = new ReqModel()
const app = getApp()

Page({
  data: {
    authorized: false,
    myTeams: {},
    nodata: true,
    isCreat:true,
    pagenum:1
  },

  onLoad(options) {
    this.getMyTeams()
  },

  async getMyTeams(){
    if (app.globalData.loginInfo){
      const token = { token: app.globalData.loginInfo.token }
      const resData = await reqModel.getMyTeam(token)
      console.log('myTeams -> ', resData)
      if (resData.data.length >= 3) {
        this.setData({
          isCreat: false
        })
      }
      this.setData({
        myTeams: resData.data,
        nodata: false
      })

      // myTeam.then(
      //   res => {
      //     if (res.data.length >= 3) {
      //       this.setData({
      //         isCreat: false
      //       })
      //     }
      //     this.setData({
      //       myTeams: res.data,
      //       nodata: false
      //     })
      //     wx.hideLoading()
      //   })
    }
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
