// pages/field/C_fieldInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gym:Object,
    field: Object,
    isGym:Boolean,
    tude:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLocation(){
      wx.openLocation({//使用微信内置地图查看位置。
        latitude: this.properties.tude.location.lat,
        longitude: this.properties.tude.location.lng,
        name: this.properties.gym.gymName,
        desc: this.properties.tude.address
      })
    },
    
    tel() {
      const phonenum = this.properties.gym.gymContactPhone
      wx.makePhoneCall({
        phoneNumber: phonenum
      })
    },
    copy() {
      const content = this.properties.gym.gymContactWechat
      wx.setClipboardData({
        data: content,
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
