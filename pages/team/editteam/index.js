// pages/me/myteam/newteam/newteam.js
var util = require('../../../utils/util.js')

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    inited: true,
    lastRouteId: null,
    authLogin: true,
    //parentUserCode: null,

    teamId: null,
    teamType: null,
    attachs: null,
    teamDesc:null,
    teamName:null,
    attachsSrc: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    array: ['3人制', '5人制', '7人制', '8人制', '11人制'],
    index: 0,

    hyArray: ['政府', '企业', '校园', '球迷'],
    hyIndex: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const bid = options.bid
    const teamId = bid
    const attachs = options.attachs
    const teamName = options.teamName
    // const teamArea = options.teamArea
    const teamType = options.teamType
    // const teamBelong = options.teamBelong
    const teamDesc = options.teamDesc
    console.log('球队信息：', options)
    this.setData({
      teamId,
      attachs,
      teamName,
      // teamArea,
      teamType,
      // teamBelong,
      teamDesc,
    })

    if (attachs == "undefined"){
      this.setData({
        attachs: '/img/logo.png'
      })
    }else{
      this.setData({
        attachs: attachs,
      })
    }
  },

  choseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('图片提交：', res)
        this._uploadFile(res.tempFilePaths[0], 'teamAvata', this.data.teamId, 'team')
        this.setData({
          attachs: res.tempFilePaths[0]
          // attachs: res.data.url
        })
      }
    })
  },

  _uploadFile: function (filePath, file, refId, refType) {
    wx.showLoading()
    wx.uploadFile({
      url: app.globalData.baseURL + 'file/uploadToWxCos',
      filePath: filePath,
      name: 'file',
      method: "POST",
      formData: {
        token: app.globalData.loginInfo.token,
        appId: app.globalData.appId,
        // duration:
        file: file,
        // fileType:,
        refId: refId || '',
        refType: refType || '',
      },
      success: (res) => {
        console.log('文件上传信息：', res)
        // const pic = res.data
        // this.setData({
        //   attachsSrc: pic
        // })
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },

  regionChange(e) {
    console.log('所在地区：', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  pickerChange(e) {
    console.log('擅长赛制：', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  hyChange(e) {
    console.log('所属行业：', e.detail.value)
    this.setData({
      hyIndex: e.detail.value
    })
  },

  /*修改球队*/
  formSubmit(e) {
    app.showLoading()
    console.log('submit：', e.detail.value)
    var upData = e.detail.value

    var formData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
      attachs: this.data.attachsSrc,
      teamName: upData.teamName,
      teamArea: upData.teamArea,
      teamType: upData.teamType,
      teamBelong: upData.teamBelong,
      teamDesc: upData.teamDesc,
    }
   
      wx.request({
        url: app.globalData.baseURL + 'team/update',
        method: 'POST',
        data: formData,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          console.log("球队修改成功:", res)
          wx.lin.showToast({
            title: '球队修改成功！',
            icon: 'success',
            iconStyle: 'color:#7ec699; size: 60',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                }), 3000
              })
            }
          })
        },
        fail: (error) => {
          wx.showToast({
            title: '球队修改出错',
            icon: 'none',
            duration: 2000
          })
        },
        complete: (res) => {
          app.hideLoading()
        }
      })
    },
  
  /*删除球队*/
  disableTeam(e) {
    console.log('删除球队：', e)
    wx.showModal({
      title: '确定删除当前球队？',
      content: '',
      type: "confirm",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          wx.request({
            url: app.globalData.baseURL + 'team/disable',
            method: 'POST',
            data: {
              token: app.globalData.loginInfo.token,
              teamId: this.data.teamId,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: (res) => {
              console.log("请求成功:", res)
              if (res.data.code == "-1") {
                wx.lin.showToast({
                  title: '删除球队出现错误，稍后再试',
                  icon: 'error',
                  iconStyle: 'color:#ff0000; size: 60',
                  success: () => {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 1
                      }), 3000
                    })
                  }
                })
              } else {
                wx.lin.showToast({
                  title: '球队删除成功！',
                  icon: 'success',
                  iconStyle: 'color:#7ec699; size: 60',
                  success: () => {
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: 2
                      }), 3000
                    })
                  }
                })
              }
            },
            complete: (res) => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})

