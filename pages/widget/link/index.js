// components/link/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    linkText:String,
    member: Object,
    team: Object,
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
    memberInfo(event){
      const bid = this.properties.member.userCode
      const name = this.properties.member.realName
      const stmPosition = this.properties.member.stmPosition
      const stmShirtNum = this.properties.member.stmShirtNum
      const stmType = this.properties.member.stmType
      const teamId = this.properties.member.teamId

      console.log('球员info:', bid, name, stmPosition, stmShirtNum, stmType, teamId)
      wx.navigateTo({
        url: `/pages/team/editMemberInfo/index?bid=${bid}&realName=${name}&stmPosition=${stmPosition}&stmShirtNum=${stmShirtNum}&stmType=${stmType}&teamId=${teamId}`,
      })
    },
    teamInfo(event) {
      const bid = this.properties.team.teamId
      const attachs = this.properties.team.attachs
      const teamName = this.properties.team.teamName
      // const teamArea = this.properties.team.teamArea
      const teamType = this.properties.team.teamType
      // const teamBelong = this.properties.team.teamBelong
      const teamDesc = this.properties.team.teamDesc
      console.log('球队bid:', bid)
      wx.navigateTo({
        url: `/pages/team/editteam/index?bid=${bid}&attachs=${attachs}&teamName=${teamName}&teamType=${teamType}&teamDesc=${teamDesc}`,
      })
    }
  }
})
