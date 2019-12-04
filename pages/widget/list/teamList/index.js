// components/list-csteam/teamList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    team: Object,
    // hasNewMember:{
    //   type: String,
    //   value: "N",
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toTeam(event) {
      const bid = this.properties.team.teamId
      wx.navigateTo({
        url: `/pages/team/detail/detail?bid=${bid}`
      })
    },
    toMsg(event){
      const bid = this.properties.team.teamId
      // const leaderUserCode = this.properties.team.leaderUserCode
      let team = JSON.stringify(this.properties.team) //传object
      wx.navigateTo({
        url: `/pages/my/msg/msg?bid=${bid}&team=${team}`
      })
    }
  }
})
