import { 
  TeamModel 
} from '../../../models/team.js'

import {
  WxCacheModel
} from '../../../models/wxcache.js'

const teamModel = new TeamModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    team:null,
    members:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const bid = options.bid

    console.log('team详情bid：')
    console.log(bid)

    wxCacheModel.get("team", teamModel.getDetail())
    wxCacheModel.get("members", teamModel.getListMember())

    const detail = teamModel.getDetail(bid)
    const members = teamModel.getListMember(bid)

    detail.then(res =>{

      console.log('team详情：')
      console.log(res.data)

      this.setData({
        team:res.data
      })
      wx.hideLoading()
      wxCacheModel.put("team", res.data, 0.2)
    })

    members.then(res =>{
      console.log('members详情：')
      console.log(res.data)
      this.setData({
        members: res.data
      })
      wx.hideLoading()
      wxCacheModel.put("members", res.data, 0.2)
    })
  },

  onTap() {
    wx.lin.showDialog({
      type: "confirm",
      title: "请输入4位邀请码",
      success: (res) => {
        if (res.confirm) {
          wx.lin.showToast({
            title: '申请已发送,等待确认~',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 60',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})