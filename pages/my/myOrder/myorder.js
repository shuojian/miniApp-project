import { promisic } from '../../../utils/common.js'
import { ReqModel } from '../../../models/request.js'
const reqModel = new ReqModel()
const app = getApp()
Page({
  data: {
    myOrders:null,
    nodata: true,
    pagenum:1,
  },
  onLoad(options) {
    // wx.showLoading()
    // this.userAuthorized()
    this.getMyOrders()
  },

  getMyOrders(){
    if (app.globalData.loginInfo){
      const token = app.globalData.loginInfo.token
      const myOrder = reqModel.queryMyOrder(token)
      myOrder.then(
        res => {
          const v1 = res.data
          const dataTotal = v1.length
          const getList = v1.map((obj, index) => {
            let rObj = obj;
            rObj.matchDay = this.formatTo(obj.matchDay);
            rObj.matchHourStart = this.formatTo(obj.matchHourStart, 'time');
            rObj.matchHourEnd = this.formatTo(obj.matchHourEnd, 'time');
            return rObj
          })
          this.setData({
            myOrders: getList,
            nodata:false,
          })
          wx.hideLoading()
          // console.log('我的订单:', res.data)
        }
      )
    }
  },

  toDetail(){
    wx.navigateTo({
      url: 'detail/detail',
    })
  },
  
  clearCache: function () {
    this.setData({
      myOrders: {}
    });
  },

  formatTo(time, format = 'date') {
    if (format == 'date') {
      const toT = time.toString()
      const year = toT.substr(0, 4)
      const month = toT.substr(4, 2)
      const date = toT.substr(6, 2)
      return `${year}.${month}.${date}`
    } else if (format == 'time') {
      const toT = time.toString()
      const hour = toT.substr(0, 2)
      const sconde = toT.substr(2, 2)
      return `${hour}:${sconde}`
    }
  },

  // _parserDate:(date)=> {
  //   var t = Date.parse(date);
  //   if (!isNaN(t)) {
  //     return new Date(Date.parse(date.replace(/-/g, "/")));
  //   } else {
  //     return new Date();
  //   }
  // },

    //下拉刷新
  onPullDownRefresh: function () {
    this.clearCache();
    this.getMyOrders()
    this.setData({
      pagenum: 1, // 每次触发下拉事件pageIndex=0
    })
    wx.stopPullDownRefresh()
  },
  
  // 上拉触底
  // onReachBottom: function () {
  //   let pagenum = this.data.pagenum + 1; //获取当前页数并+1
  //   this.setData({
  //     pagenum: pagenum, //更新当前页数
  //   })
  //   this.getMyOrders();//重新调用请求获取下一页数据
  // },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
    }
  }
})