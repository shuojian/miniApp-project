
var util = require('../../../utils/util.js')
import { ReqModel } from '../../../models/request.js'
const reqModel = new ReqModel()

//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    inited: true,
    lastRouteId: null,
    authLogin: true,
    //parentUserCode: null,
    // teamAvatarSrc: '/img/logo.png',
    // attachsSrc: null,

    region: ['云南省', '昆明市', '五华区'],
    customItem: '全部',
    array: ['3人制', '5人制', '7人制', '8人制', '11人制'],
    index: 0,
    hyArray: ['政府', '企业', '校园', '球迷'],
    hyIndex: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    if (app.globalData.userInfo) {
      app.fxLogin(this.init)
    } else {
      wx.getSetting({
        success:  (res) => {
          console.log("onLoad:",res)
          if (res.authSetting && res.authSetting["scope.userInfo"]) {
            this.setData({
              authLogin: false
            })
            //调用登录接口
            app.fxLogin(this.init)
          }
        }
      })
    }
  },
  //生命周期函数--监听页面显示
  onShow () {
    if (!this.data.inited) {
      if (app.globalData.userInfo) {
        app.fxLogin(this.init)
      } else {
        wx.getSetting({
          success: (res) => {
            console.log("onShow:", res)
            if (res.authSetting && res.authSetting["scope.userInfo"]) {
              //调用登录接口
              app.fxLogin(this.init)
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    }
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
  
  
  formSubmit(e) {
    app.showLoading()
    console.log('submit：', e.detail.value)
    var upData = e.detail.value

    var formData = {
      token: app.globalData.loginInfo.token,
      // attachs: this.data.teamAvatarSrc,
      teamDesc: upData.teamDesc,
      teamName: upData.teamName,
      teamType: upData.teamType,
      teamArea: upData.teamArea,
      teamBelong: upData.teamBelong, 
    }
      if (upData.teamName = ''){
      wx.showToast({
        icon: 'none',
        title: '球队队名未填写',
      }) 
    } else {
        const creatTeam = reqModel.creatTeam(formData)
        creatTeam.then( res => {
          // console.log("球队创建成功:", res)
          wx.lin.showToast({
            title: '创建球队成功！',
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
        })


      // wx.request({
      //   url: app.globalData.baseURL + 'team/create',
      //   method: 'POST',
      //   data: formData,
      //   header: {'content-type': 'application/x-www-form-urlencoded'},
      //   success: (res) => {
      //     console.log("球队创建成功:", res)
      //     wx.lin.showToast({
      //       title: '创建球队成功！',
      //       icon: 'success',
      //       iconStyle: 'color:#7ec699; size: 60',
      //       success() {
      //         setTimeout(() => {
      //           wx.navigateBack({
      //             delta: 1
      //           }), 3000
      //         })
      //       }
      //     })
      //   },
      //   fail: (error) => {
      //     wx.showToast({
      //       title: '创建球队出错',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   },
      //   complete: (res) => {
      //     app.hideLoading()
      //   }
      // })
    } 
  },
})  


