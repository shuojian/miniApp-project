// pages/index/detail/result/result.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    array: ['分组赛', '淘汰赛1', '淘汰赛2', '淘汰赛3'],
    objectArray: [
      {
        id: 0,
        name: '分组赛'
      },
      {
        id: 1,
        name: '淘汰赛1'
      },
      {
        id: 2,
        name: '淘汰赛2'
      },
      {
        id: 3,
        name: '淘汰赛3'
      }
    ],
    index: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    },
  }
})
