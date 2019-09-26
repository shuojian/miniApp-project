// components/list-myorder/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    field: Object,
    gymName:String,
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
    toBook(event) {
      const gymName = this.properties.gymName
      let data = JSON.stringify(this.properties.field) //传object
      wx.navigateTo({
        url: `/pages/field/fieldOrder/index?data=${data}&gymName=${gymName}`
      })
    },
    toInfo(event) {
      const bid = this.properties.field.fieldId
      wx.navigateTo({
        url: `/pages/field/fieldInfo/index?bid=${bid}`
      })
    }
  }
})
