// common/component/pagecomponent/games/index.js
Component({
  properties: {
    gym:Object,
  },
  data: {

  },
  methods: {
    onTap(event){
      const bid = this.properties.gym.gymId
      console.log('球场bid:')
      console.log(bid)
      wx.navigateTo({
        url: `/pages/field/detail/detail?bid=${bid}`,
      })
    }
  }
})
