
// !--components_event 赛事
// common/component/pagecomponent/games/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    event:Object,
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
    onTap(event){
      const bid = this.properties.event.id
      wx.navigateTo({
        url:'/pages/event/detail/detail?bid=${bid}'
      })
    }
  }
})
