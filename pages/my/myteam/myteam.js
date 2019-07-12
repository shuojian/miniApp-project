import {
  TeamModel
} from "../../../models/team.js"

const teamModel = new TeamModel()

Page({

  data: {
    myteam: {},
    nodata: true
  },

  onLoad(options) {
    // const myTeam = teamModel.getMyTeam()
    // myTeam.then(
    //   res => {
    //     this.setData({
    //       myteam=res.data
    //     })
    //   })
  },

  opendg() {
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

  toCreatTeam() {
    wx.navigateTo({
      url: "newteam/newteam"
    })
  }
})
