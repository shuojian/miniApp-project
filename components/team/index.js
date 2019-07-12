
Component({
  properties: {
    team:Object,
  },
  data: {

  },
  methods: {
    onTap(event){
      const bid = this.properties.team.teamId
      wx.navigateTo({
        url: `/pages/team/detail/detail?bid=${bid}`
      })
    }
  }
})
