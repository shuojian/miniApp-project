// pages/team/editMemberInfo/indexjs
import { ReqModel } from '../../../models/request.js'
var util = require('../../../utils/util.js')

const reqModel = new ReqModel()
//获取应用实例
var app = getApp()
var isLoading = false;
Page({
  data: {
    authLogin: true,
    currentUserCode:null,
    destUserCode:null,
    stmPosition: null,
    stmShirtNum: null,
    stmType: null,
    teamId:null,
    realName:null,
    isCurrent:false,
    isCreator:false,
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const memberInfo = JSON.parse(options.memberInfo) //上一页传值：球员信息
    const creatorUserCode = options.creatorUserCode //上一页传值：球队创建者ID
    const currentUserCode = app.globalData.loginInfo.userCode //当前用户ID
    const destUserCode = memberInfo.userCode //当前球员ID
    this.setData({
      currentUserCode, //当前用户code
      destUserCode, //队员ID
      teamId: memberInfo.teamId,  //球队ID

      realName:memberInfo.realName, //真实姓名
      stmShirtNum: memberInfo.stmShirtNum, //球衣号
      stmPosition: memberInfo.stmPosition, //场上位置
      stmType: memberInfo.stmType, //球队中的身份
      
    })
    if(currentUserCode == destUserCode){
      this.setData({isCurrent:true})
    }
    if(currentUserCode == creatorUserCode){
      this.setData({isCreator:true})
    }
  },

  onChangeTapWZ(e){  //修改场上位置
    this.setData({
      stmPosition: e.detail.value
    })
  },
  onChangeTapSF(e) {  //修改球队中的身份
    this.setData({
      stmType: e.detail.value
    })
  },

  /*修改信息*/
  async formSubmit(e) {
    let upDate = e.detail.value
    const postData = {
      token: app.globalData.loginInfo.token,
      destUserCode: this.data.destUserCode,//*必填 队员ID
      teamId: this.data.teamId,//*必填 球队ID
      realName: upDate.realName, //真实姓名
      stmShirtNum: upDate.stmShirtNum, //球衣编号
      stmPosition: this.data.stmPosition, //队员场上位置
      stmType: this.data.stmType,  //队员身份
    }
    try {
      const resUpdateTeamMember = await reqModel.updateTeamMember(postData)
      console.log('修改->',resUpdateTeamMember)
      if (resUpdateTeamMember.code == "0") {
        util.showToast_success('修改成功！')
        util.backTo(1500, 1) 
      } else {
        util.showModal('修改出错', resUpdateTeamMember.msg)
      }
    } catch (err) {
      util.showToast_error('传输出现错误，稍后再试')
    }
  },
  /*退出球队*/
  async  leaveTeam(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
    }
    try {
      await util.showModal('确定退出当前球队？', '', true)
      const resLeaveTeam = await reqModel.leaveTeam(postData)
      if (resLeaveTeam.code == "-1") {
        util.showToast_error('退出球队出现错误，稍后再试')
      } else {
        util.showToast_success('退出球队成功！')
      }
    } catch (err) {
      // util.showToast_error('err')
      console.log('点击取消 ->', err)
    }
  },

  /*踢出球队*/
  async kickoutTeam(e) {
    const postData = {
      token: app.globalData.loginInfo.token,
      teamId: this.data.teamId,
      destUserCode: this.data.destUserCode,
    }
    try {
      await util.showModal('确定将其踢出球队？', '', true)
      const reskickoutTeam = await reqModel.kickoutTeam(postData)
      if (reskickoutTeam.code == "-1") {
        util.showToast_error('踢出球队出现错误，稍后再试')
      } else {
        util.showToast_success('踢出球队成功！')
      }
    } catch (err) {
      console.log('点击取消 ->', err)
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.startUrl,
      imageUrl: app.globalData.shareImgUrl
    }
  },
})