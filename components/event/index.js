Component({
  properties: {
    event:Object,
  },
  data: {

  },
  methods: {
    onTap(event){
      const bid = this.properties.event.eventId
      wx.navigateTo({
        url:`/pages/index/detail/detail?bid=${bid}`
      })
    }
  }
})
