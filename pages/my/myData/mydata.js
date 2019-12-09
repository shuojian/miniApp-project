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
      }],

      isMember:false,
      memberInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.memberInfo){
      const memberInfo = JSON.parse(options.memberInfo)
      console.log('接收->',memberInfo)
      this.setData({
        isMember:true,
        memberInfo
      })
    }else{
      this.getMyTeams()
    } 
  },

  async getMyTeams(){
    const token = { token: app.globalData.loginInfo.token }
    const resData = await reqModel.getMyTeam(token)
    console.log('我的球队 ->', resData)
    if (resData.data){
      this.setData({
        noData: false,
        myTeams: resData.data,
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.startUrl,
      imageUrl: app.globalData.shareImgUrl
    }
  },


})

