var app = getApp()

import {
  EventModel
} from '../../models/event.js'

const eventModel = new EventModel()

Page({
  data: {
    token:'',
    events:[],
    more: '',
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function(optins) {
    let that = this;
    app.getToken().then(function () {
      that.setData({
        token: wx.getStorageSync('yerlLocalToken')
      });
      console.log(that.data.token)
    });

    // var that = this;
    //调用API从本地缓存中获取数据
    // var loginInfo = wx.getStorageSync('loginInfo')
    // if (loginInfo) {
    //   console.log(loginInfo)
    //   if (loginInfo.lastLoginDate &&
    //     (Number(loginInfo.lastLoginDate) + 2 * 60 * 60 * 1000) > new Date().getTime()) {
    //     that.globalData.loginInfo = loginInfo
    //   } else {
    //     wx.removeStorageSync('loginInfo')
    //   }
    // }




    // const events = eventModel.getEventList()
    // events.then(
    //   res=>console.log(res)
    // )

  //  const books = bookModel.getHotList()
  //   books.then(
  //     res => {
  //       console.log(res)
  //       this.setData({
  //         books:res
  //       })
  //     }
  //   )
  },

  getEventList(){
    const events = eventModel.getEventList()
    events.then(
      res =>{
        console.log(res)
      }
    )
  },

  // 创建赛事弹框
  openDg() {
    wx.showModal({
      content: '进驻赛事，请联系QQ123456789',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh:' + this.route)
    if (!isLoading) {
      this.init()
    }
  },

  // 页面上拉触底事件的处理函数
 
  onReachBottom: function () {
    if (!isLoading) {
      if (this.data.prds && (this.data.prds.length % 6) == 0) {
        this.init(this.data.prds[this.data.prds.length - 1].routeId)
      }
    }
  },

})
