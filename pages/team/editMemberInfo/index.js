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

    // attachsSrc: '/img/logo.png',
    // attachsSrc: null,
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const realName = options.realName
    const destUserCode = options.bid
    const stmPosition = options.stmPosition

    const stmShirtNum = options.stmShirtNum
    const stmType = options.stmType
    const teamId = options.teamId
    console.log('球员信息：', options, options.teamId, destUserCode,)

    this.setData({
      destUserCode: destUserCode,
      stmPosition: stmPosition,
      stmShirtNum: stmShirtNum,
      stmType: stmType,
      teamId: teamId, 
      realName:realName
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
  choseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('图片提交：', res)
        this.setData({
          attachsSrc: res.tempFilePaths[0]
        })
        app.uploadFile(this.data.attachsSrc, 'teamAvata', this.data.teamId, 'team')
        // this.setData({
        //   attachsSrc:
        // })
      }
    })
  },

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
          wx.lin.showToast({
            title: '修改成功！',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 60',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta:1
                }), 3000
              })
            }
          })  
        },
        fail: (error) => {
          wx.showToast({
            title: '传输出现错误，稍后再试',
            icon: 'none',
            duration: 2000
          })
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
            url: app.globalData.baseURL + '/team/leave',
            method: 'POST',
            data: {
              token: app.globalData.loginInfo.token,
              teamId: this.data.teamId,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: (res) => {
              console.log("退出球队:", res)
              wx.lin.showToast({
                title: '退出球队成功！~',
                icon: 'success',
                iconStyle: 'color:#7ec699; size: 60',
              })
            },
            complete:() =>{
              wx.hideLoading()
            }
          })
        } 
      }
    })
  }, 
})