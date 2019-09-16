// pages/field/C_fieldInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gym:Object,
    field: Object,
    isGym:Boolean
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
