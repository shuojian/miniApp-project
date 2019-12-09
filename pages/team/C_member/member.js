// pages/team/detail/member/member.js
Component({
  properties: {
    member: Object,
    isCreator:Boolean,
    isMember:Boolean,
    destUserCode: String,
    creatorUserCode:String,
    isLink: Boolean,
  },

  data: {
    notag:false
  },

  methods: {
    toEditInfo(){
      wx.navigateTo({
        url: '/pages/team/detail/editMemberInfo/editMemberInfo'
      })
    },

    toMemberInfo(){
      const memberInfo = JSON.stringify(this.properties.member)
      wx.navigateTo({
        url: `/pages/my/myData/mydata?memberInfo=${memberInfo}`
      })
    },
  }
    /*踢出球队*/
  // kickoutTeam(e) {
  //   this.triggerEvent('dtap', {e}, {})
  //   },
  // },  

})
