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
    creatorUserCode:String,
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

    // url: `/pages/team/editMemberInfo/index?bid=${bid}&realName=${name}&stmPosition=${stmPosition}&stmShirtNum=${stmShirtNum}&stmType=${stmType}&teamId=${teamId}`,
    memberInfo(event) {
      const memberInfo = JSON.stringify(this.properties.member)
      const creatorUserCode = this.properties.creatorUserCode
      wx.navigateTo({
        url: `/pages/team/editMemberInfo/index?memberInfo=${memberInfo}&creatorUserCode=${creatorUserCode}`,
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
