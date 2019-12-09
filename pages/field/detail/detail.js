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

  // toGymInfo(e){
  //   const gym = JSON.stringify(this.data.gym) 
  //   wx.navigateTo({
  //     url: `../gymInfo/index?gymId=${this.data.gym.gymId}&gym=${gym}`
  //   })
  // },
 
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