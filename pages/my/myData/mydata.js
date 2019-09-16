import { ReqModel } from '../../../models/request.js'
import { promisic } from '../../../utils/common.js'
const app = getApp()
const reqModel = new ReqModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: {},
    inited: false,
    myTeams: null,
    noData: true,
    myDataCount: [
      {
        id: 0,
        text: "出勤率",
        num: 0
      },
      {
        id: 1,
        text: "胜",
        num: 0
      },
      {
        id: 2,
        text: "平",
        num: 0
      },
      {
        id: 3,
        text: "负",
        num: 0
      },
      {
        id: 4,
        text: "进球",
        num: 0
      },
      {
        id: 5,
        text: "助攻",
        num: 0
      },
      {
        id: 6,
        text: "黄牌",
        num: 0
      },
      {
        id: 7,
        text: "红牌",
        num: 0
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // wx.showLoading()
    this.getMyTeams()
  },

  getMyTeams(){
    const myTeam = reqModel.getMyTeam()
    myTeam.then(
      res => {
        this.setData({
          nodata: false,
          myTeams: res.data,
        })
    })
  },

  toDetail(){
    wx.navigateTo({
      url: '',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
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

