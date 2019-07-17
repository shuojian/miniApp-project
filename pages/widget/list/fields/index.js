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
      const bid = this.properties.field.fieldId
      const name = this.properties.field.fieldName
      const desc = this.properties.field.fieldDesc
      const contact = this.properties.field.fieldContactPhone
      const amount = this.properties.field.amount
      const gymName = this.properties.gymName
      const fieldType = this.properties.field.fieldType
      const fieldSize = this.properties.field.fieldSize
      wx.navigateTo({
        url: `/pages/field/fieldOrder/index?bid=${bid}&fieldSize=${fieldSize}&name=${name}&desc=${desc}&contact=${contact}&amount=${amount}&gymName=${gymName}&fieldType=${fieldType}`
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
