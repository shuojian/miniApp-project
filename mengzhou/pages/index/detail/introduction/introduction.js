// pages/index/detail/introduction/introduction.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) { 
      console.log(e) 
      let tab = e.currentTarget.id 
      if (tab === 'tableft') {
         this.setData({ currentTab: 0 }) 
         } else if (tab === 'tabright') { 
           this.setData({ currentTab: 1 }) 
      } 
    }
  }
})
