import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
const util = require('../../../utils/util.js')

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    gym:{},
    tude:{},
    phone:null,
    orderid:null,
    fields:[],
    // field: {}
  },
  onLoad(options) {
    const bid = options.bid
    const detail = reqModel.getGymDetail(bid)
    const fields = reqModel.getGymFieldList(bid)

    //球场详情
    detail.then(res=>{
      // console.log('详情：',res.data)
      this.setData({
        gym: res.data,
        phone: res.data.gymContactPhone,
        orderid: bid,
      }) 
    })

    //场地列表
    fields.then(res => {
      this.setData({
        fields: res.data,
      })
    })
  },

  toGymInfo(e){
    wx.navigateTo({
      url: `../gymInfo/index?gymId=${this.data.gym.gymId}&name=${this.data.gym.gymName}&addr=${this.data.gym.gymAddr}&desc=${this.data.gym.gymDesc}&phone=${this.data.gym.gymContactPhone}&wechat=${this.data.gym.gymContactWechat}&service=${this.data.gym.gymService}&notice=${this.data.gym.gymOrderNotice}&service=${this.data.gym.gymService}&businessHours=${this.data.gym.gymBusinessHours}`,
    })
  },
  toFieidInfo(e) {
    wx.navigateTo({
      url: `../gymInfo/index?gymId=${this.data.gym.gymId}&name=${this.data.gym.gymName}&addr=${this.data.gym.gymAddr}&desc=${this.data.gym.gymDesc}&phone=${this.data.gym.gymContactPhone}&wechat=${this.data.gym.gymContactWechat}&service=${this.data.gym.gymService}&notice=${this.data.gym.gymOrderNotice}&service=${this.data.gym.gymService}&businessHours=${this.data.gym.gymBusinessHours}`,
    })
  },

  booking(e){
    let orderid = e.target.dataset.orderid
    wx.navigateTo({
      url: `../sportsorder/sportsorder?orderId=${orderid}&gym=${this.data.gym}`,
    })
  },

  toBooking(e){
    let orderid = e.target.dataset.orderid
    let amount = this.data.fields.amount
  },

  tel(){
    const phonenum = this.data.gym.gymContactPhone
    wx.makePhoneCall({
      phoneNumber: phonenum
    })
  },

  callFootball(){
    const phonenum = this.data.gym.gymContactPhone
    console.log('phoneNumber:' + phonenum)
    wx.showActionSheet({
      itemList: [phonenum,'拨打','复制'],
      success:(res) =>{
        if(res.tapIndex==1){
          wx.makePhoneCall({
            phoneNumber: phonenum,
          })
        } 
        if (res.tapIndex == 2){
          wx.setClipboardData({
            data: phonenum,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  console.log(res.data) 
                }
              })
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
      title: app.globalData.shareTitle,
      path: app.globalData.startUrl,
      imageUrl: app.globalData.shareImgUrl
    }
  },

})