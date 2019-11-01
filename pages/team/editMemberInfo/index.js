// pages/me/myteam/newteam/newteam.js
var util = require('../../../utils/util.js')

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    authLogin: true,
    destUserCode:null,
    stmPosition: null,
    stmShirtNum: null,
    stmType: null,
    teamId:null,
    realName:null,
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const memberInfo = JSON.parse(options.memberInfo)
    console.log('球员信息->：', memberInfo)
    this.setData({
      destUserCode: memberInfo.stmId,
      stmPosition: memberInfo.stmPosition,
      stmShirtNum: memberInfo.stmShirtNum,
      stmType: memberInfo.stmType,
      teamId: memberInfo.teamId, 
      realName:memberInfo.realName
    })
  },

  onChangeTapWZ(e){
    console.log("位置：",e.detail.value)
    this.setData({
      stmPosition: e.detail.value
    })
  },
  onChangeTapSF(e) {
    console.log("身份:",e.detail.value)
    this.setData({
      stmType: e.detail.value
    })
  },

  /*修改信息*/
  formSubmit(e) {
    app.showLoading()
    console.log('submit：', e.detail.value)
    var upDate = e.detail.value
    var formData = {
      token: app.globalData.loginInfo.token,
      destUserCode: this.data.destUserCode,
      teamId: this.data.teamId,
      realName: upDate.realName,
      stmShirtNum: upDate.stmShirtNum,
      stmPosition: this.data.stmPosition,
      stmType: this.data.stmType,
    }

    wx.request({
        url: app.globalData.baseURL + 'team/updateSportsTeamMember',
        method: 'POST',
        data: formData,
        header: {'content-type': 'application/x-www-form-urlencoded'},
        success: (res) => {
          console.log("修改成功:", res)
          util.showToast_success('修改成功！')
          util.backTo(1500, 1)
        },
        fail: (error) => {
          util.showToast_error('传输出现错误，稍后再试')
        },
        complete: (res) => {
          app.hideLoading()
        }
    })
  },
  /*退出球队*/
  leaveTeam(e) {
    wx.showModal({
      title: '确定退出当前球队？',
      content: '',
      type: "confirm",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          wx.request({
            url: app.globalData.baseURL + 'team/leave',
            method: 'POST',
            data: {
              token: app.globalData.loginInfo.token,
              teamId: this.data.teamId,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: (res) => {
              util.showToast_success('退出球队成功')
            },
            complete:() =>{
              wx.hideLoading()
            }
          })
        } 
      }
    })
  }, 

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },
})