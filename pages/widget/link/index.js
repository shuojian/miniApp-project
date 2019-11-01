// components/link/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member: Object,
    team: Object,
    
    linkText:String,
    isMember: Boolean,
    isTeam: Boolean,
    isCreator: Boolean,
    isLink: Boolean
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
    // memberInfo(event){
    //   const bid = this.properties.member.userCode
    //   const name = this.properties.member.realName
    //   const stmPosition = this.properties.member.stmPosition
    //   const stmShirtNum = this.properties.member.stmShirtNum
    //   const stmType = this.properties.member.stmType
    //   const teamId = this.properties.member.teamId

    //   console.log('球员info:', bid, name, stmPosition, stmShirtNum, stmType, teamId)
    //   wx.navigateTo({
    //     url: `/pages/team/editMemberInfo/index?bid=${bid}&realName=${name}&stmPosition=${stmPosition}&stmShirtNum=${stmShirtNum}&stmType=${stmType}&teamId=${teamId}`,
    //   })
    // },

    memberInfo(event) {
      const memberInfo = JSON.stringify(this.properties.member)
      wx.navigateTo({
        url: `/pages/team/editMemberInfo/index?memberInfo=${memberInfo}`,
      })
    },

    teamInfo(event) {
      const teamInfo = JSON.stringify(this.properties.team) //传object
      wx.navigateTo({
        url: `/pages/team/editteam/index?teamInfo=${teamInfo}`,
      })
    }

  }
})
