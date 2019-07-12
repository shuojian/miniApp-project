import {
  FieldModel
} from '../../../models/field.js'

const fieldModel = new FieldModel()

Page({
  data: {
    gym:null,
    phone:null,
  },
  onLoad(options) {
    wx.showLoading()
    const bid = options.bid
    const detail = fieldModel.getDetail(bid)

    detail.then(res=>{
      console.log('球场详情：')
      console.log(res.data)
      this.setData({
        gym:res.data,
        phone: res.data.gymContactPhone
      })
    })
  },
 

  booking(){
    wx.navigateTo({
      url: '../sportsorder/sportsorder',
    })
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
  }

})