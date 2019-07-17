Component({
  properties: {
    event:Object,
    // now:Number
  },
  data: {
    now:Date.parse(new Date())
  },
  methods: {
    onTap(event){
      const bid = this.properties.event.eventId
      wx.navigateTo({
        url: `/pages/index/detail/detail?bid=${bid}`
      })
    }
  }
})
