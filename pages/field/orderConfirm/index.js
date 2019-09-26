// orderConfirm,
import { ReqModel } from '../../../models/request.js'
import { promisic } from '../../../utils/common.js'
const util = require('../../../utils/util.js')
const reqModel = new ReqModel()
const app = getApp()

Page({
  data: {
    receiveData:null,
    fieldType: "半场",
    type: 'half',
    isGuest:false,
    authorized: false,
    loginInfo:null,

    phoneRule: {
      required: true,
      pattern: '/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/',
      message: '非手机号码'
    },
    payId:0,
  },

  // 生命周期函数--监听页面加载
  onLoad(query) {
    if (app.globalData.userInfo) {
      app.fxLogin()
      this.setData({
        authorized: true,
        loginInfo: app.globalData.loginInfo,
      })
    } else {
      this._userAuthorized()
    }
    const receiveData = JSON.parse(query.data) //接收到的传值数据
    const carts = receiveData.carts

     // 判断是挑战者host 还是应战者 Gues
    if (carts[0].booked == "Y" && typeof carts[0].hostorderid != 'undefined'){
      const orderId = carts[0].hostorderid
      this.setData({
        isGuest:true,
        orderId
      })
    }

    this.setData({receiveData}) // 更新上一页传过来的数据
    this._type(carts,receiveData) //判断 半场 / 全场
  },

  // 表单提交
  formSubmit(e) {
    const dataSubmit = {
      token: this.data.loginInfo.token,
      phone: e.detail.value.phone,
      teamName: e.detail.value.teamName,
      teamColor: e.detail.value.teamColor,
      note: e.detail.value.note,
      // realName: this.data.loginInfo.nickName,
      realName: this.data.loginInfo.nickname,
      fieldId: this.data.receiveData.field.fieldId,
      matchTimeStart: this.data.receiveData.matchTimeStart,
      matchTimeEnd: this.data.receiveData.matchTimeEnd,
      type: this.data.type
      // teamId:teamId,
      // phoneCode: phoneCode,
    }
    this.createOrder(e, reqModel.createOrder(dataSubmit))
  },
  // 应战
  formSubmitGuest(e) {
    const dataSubmit = {
      token: app.globalData.loginInfo.token,
      phone: e.detail.value.phone,
      teamColor: e.detail.value.teamColor,
      teamName: e.detail.value.teamName,
      note: e.detail.value.note,
      realName: app.globalData.loginInfo.nickname,
      fieldId: this.data.receiveData.field.fieldId,
      orderId: this.data.receiveData.orderId,
      // phoneCode: phoneCode,
    }
    this.createOrder(e, reqModel.engageOrder(dataSubmit))
  },

  //表单提交调用
  async createOrder(e, fun) {
    const teamName = e.detail.value.teamName
    const teamColor = e.detail.value.teamColor
    const phone = e.detail.value.phone
    //验证空值
    if (!phone || !teamName) { 
      util.showToast_error('必填信息未填写完整~')
    } 

    //验证手机号码
    else if (!(/^1[34578]\d{9}$/.test(phone))) { 
      util.showToast_error('手机号码有误')
    }

    //提交订单
    else {
      try{
        const orderId = await this._createReq(fun)
        const payInfo = await this._payReq(orderId)
        this._pay(payInfo)
      }catch(err){
        if (err == true){
          util.showModal("所选时间不可用", "时间段已被他人捷足先登，继续选择其它时间段，或稍后再试", "false", "重新选择")
          util.backTo(0,1)
        }
        util.showModal(`${err.code}`,`${err.msg}`, false)
      }
    } 
  },

  // 提交订单信息
  async _createReq(fun){
    const resData = await fun
    return new Promise((resolve, reject) => {
      const orderId = resData.data
      const reg = RegExp(/预订时间段异常/);
      if(reg.test(orderId)){
        reject(reg.test(orderId))
      }
      else if (resData.code != 0  || !orderId) {  
        reject(resData)
      }
      else{
        resolve(orderId)
      }
    })
  },

  //获取支付凭证
  async _payReq(orderId){
    const token = app.globalData.loginInfo.token
    const payInfo = await reqModel.payOrder(token, orderId)
    return new Promise((resolve, reject) => {
      const payId = payInfo.data.payId
      if (payInfo.code != 0) {
        reject(payInfo)
      }
      if (!payId) { 
        util.showToast_success("支付成功","场地预订成功")
        util.backTo(0,1)
      }
      resolve(payInfo)  //payInfo
    })
  },

  // 唤起支付
  _pay(payInfo){
    const orderExt = payInfo.data.orderExtInfo
    const payId = payInfo.data.payId
    wx.requestPayment({
      'appId': orderExt.appId,
      'timeStamp': orderExt.timeStamp,
      'nonceStr': orderExt.nonceStr,
      'package': orderExt.package,
      'signType': orderExt.signType,
      'paySign': orderExt.paySign,
      "success": ()=> {
        util.showToast_success('预订成功！')
        util.backTo(1000,1)  
      },
      "fail":()=> {
        this._resetOrder(payId)
      }
    })
  },

  //取消服务器订单
  async _resetOrder(payId,) {
    const token = app.globalData.loginInfo.token
    const resData = await reqModel.resetOrder(token, payId)
    if (resData && resData.errMsg == 'requestPayment:fail cancel') {
      util.showToast_success('订单已取消')
    } else {
      util.showToast_error ('订单取消失败')
    }
  },

  onGetUserInfo(event) {
    if (event.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = event.detail.userInfo
      app.fxLogin()
      this.setData({
        authorized: true,
        loginInfo: app.globalData.loginInfo,
      })
    }
  },
    
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
    }
  },
  // 是否授权
  async _userAuthorized() {
    const data = await promisic(wx.getSetting)()
    if (data.authSetting['scope.userInfo']) {
      //调用登录接口
      app.fxLogin()
      this.setData({
        authorized: true,
        loginInfo: app.globalData.loginInfo,
      })
    }
  },

  _type(carts, receiveData){
    if (receiveData.field.fieldSize == "5人制") {
      this.setData({ type: 'full' })
    } else if (receiveData.field.fieldSize == "11人制") {
      //双数判断是否是全场
      if (carts.length == 2) {
        if (carts[0].time == carts[1].time) {
          this.setData({ type: 'full' })
        } 
      } else if (carts.length == 4) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time) {
          this.setData({ type: 'full' })
        } 
      } else if (carts.length == 6) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time) {
          this.setData({ type: 'full' })
        } 
      } else if (carts.length == 8) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time) {
          this.setData({ type: 'full' })
        } 
      } else if (carts.length == 10) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time && carts[8].time == carts[9].time) {
          this.setData({ type: 'full' })
        } 
      } else if (carts.length == 12) {
        if (carts[0].time == carts[1].time && carts[2].time == carts[3].time && carts[4].time == carts[5].time && carts[6].time == carts[7].time && carts[8].time == carts[9].time && carts[10].time == carts[11].time) {
          this.setData({ type: 'full' })
        } 
      } 
      else {
        this.setData({ type: 'half' })
      }
    } 
  },

  _init() {
    if (app.globalData.loginInfo && app.globalData.loginInfo.inReview == 'N') {
      this.setData({
        inited: true 
      })
    }
  },

  // _userAuthorized() {
    //   promisic(wx.getSetting)()
    //     .then(data => {
    //       wx.hideLoading()
    //       if (data.authSetting['scope.userInfo']) {
    //         return promisic(wx.getUserInfo)()
    //       }
    //       return false
    //     })
    //     .then(data => {
    //       if (!data) return
    //       this.setData({
    //         authorized: true,
    //         userInfo: data.userInfo  //页面用户信息
    //       })
    //     })
    // },

})

