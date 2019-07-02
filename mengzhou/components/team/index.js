// common/component/pagecomponent/games/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    team:Object,
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
      const bid = this.properties.book.id
      wx.navigateTo({
        url:'/pages/team/detail/detail?bid=${bid}'
      })
    }
  }
})
