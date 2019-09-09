// components/list-myorder/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order:Object
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
    onTap(event) {
      const bid = this.properties.order.orderId
      wx.navigateTo({
        url: `/pages/my/myOrderDetail/index?bid=${bid}`
      })
    }
  }
})
