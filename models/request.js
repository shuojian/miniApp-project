import { HTTP } from '../utils/http.js'
import { api } from '../utils/config.js'
// const app = getApp()

class ReqModel extends HTTP {
/* 赛事 */
  getEventList(page = 1) { //分页
    return this.request({
      url: api.event_url,
      data: {
        page: page,
        limit: api.pageLimit
      }
    })
  }
  getEventDetail(bid) {
    return this.request({
      url: api.eventDetail_url,
      data: { eventId:bid }
    })
  }
  getEventListTeam(bid) {
    return this.request({
      url: api.eventListTeam_url,
      data: { eventId: bid }
    })
  }
  getEventListTeamGroup(bid) {
    return this.request({
      url: api.eventListTeamByGroup_url,
      data: { eventId: bid }
    })
  }
  getEventMatch(bid) {
    return this.request({
      url: api.eventMatch_url,
      data: { eventId: bid }
    })
  }
  getEventListMember(bid) {
    return this.request({
      url: api.eventListMember_url,
      data: { eventId: bid }
    })
  }
  
  /* 球队 */
  getTameList(page = 1) {  //分页
    return this.request({
      url: api.team_url,
      data:{
        page:page,
        limit: api.pageLimit
      }
    })
  }

  getTeamDetail(bid) {
    return this.request({
      url: api.teamDetail_url,
      data: { teamId: bid }
    })
  }

  getListMember(bid) {
    return this.request({
      url: api.teamMember_url,
      data: { teamId: bid }
    })
  }

  // 创建球队
  creatTeam(data){
    return this.request({
      url: api.creatTeam_url,
      method:"POST",
      data: data
    })
  }
  // 删除球队
  disableTeam(data){
    return this.request({
      url: api.disableTeam_url,
      method:"POST",
      data: data
    })
  }
  // 更改球队
  updateTeam(data){
    return this.request({
      url: api.updateTeam_url,
      method:"POST",
      data: data
    })
  }

  // 踢出球队
  kickoutTeam(data){
    return this.request({
      url: api.kickoutTeam_url,
      method:"POST",
      data: data
    })
  }

  // 恢复球队
  enableTeam(data){
    return this.request({
      url: api.enableTeam_url,
      method:"POST",
      data: data
    })
  }

  // 修改队长
  changeTeamleader(data){
    return this.request({
      url: api.changeTeamleader_url,
      method:"POST",
      data: data
    })
  }

/* 场地 */
  getListSwiperImgs() {
    return this.request({
      url: api.gymImgs_url,
    })
  }
  getFieldList(page = 1) {  //分页
    return this.request({
      url: api.fieldList_url,
      data: {
        page: page,
        limit: api.pageLimit
      }
    })
  }
  getGymList(page = 1) {  //分页
    return this.request({
      url: api.gymList_url,
      data: {
        page: page,
        limit: api.pageLimit
      }
    })
  }
  getGymDetail(bid) {
    return this.request({
      url: api.gymDetail_url,
      data: { gymId:bid }
    })
  }
  getGymDetail(bid) {
    return this.request({
      url: api.gymDetail_url,
      data: { gymId:bid }
    })
  }
  getGymFieldList(bid) {
    return this.request({
      url: api.fieldList_url,
      data: { gymId:bid }
    })
  }
  getFieldListOrder(bid,day) {
    return this.request({
      url: api.fieldOrder_url,
      data: { 
        fieldId: bid, 
        matchDay: day
      }
    })
  }

/* 我的 */
  getMyTeam(data) {
    return this.request({
      url: api.myTeam_url,
      data: data
      // {token: app.globalData.loginInfo.token}
    })
  }
  getMyTeamMsgs(bid, token) {
    return this.request({
      url: api.myTeamMsgs_url,
      data: { 
        teamId: bid, 
        token: token
      }
    })
  }
  // getMyTeamDetail(bid, token) {
  //   return this.request({
  //     url: api.myTeamDetail_url,
  //     data: { 
  //       teamId: bid, 
  //       token: token 
  //     }
  //   })
  // }
  // getMyOrder() {
  //   return this.request({
  //     url: api.getMyOrder_url,
  //     data: {token: app.globalData.loginInfo.token}
  //   })
  // }
  queryMyOrder(token) {
    return this.request({
      url: api.myOrder_url,
      data: {token: token}
    })
  }
  getMyOrderDetail(bid, token){
    return this.request({
      url: api.myOrderDetail_url,
      data: { orderId: bid, token:token}
    })
  }

  // 下单
  createOrder(dataSubmit) {
    return this.request({
      url: api.createOrder_url,
      method: 'POST',
      data: dataSubmit
    })
  }
  engageOrder(dataSubmit) {
    return this.request({
      url: api.engageOrder_url,
      method: 'POST',
      data: dataSubmit
    })
  }
  payOrder(token, orderId) {
    return this.request({
      url: api.payOrder_url,
      method: 'POST',
      data: {
        token: token,
        orderId: orderId,
        useCoin: 'N',
        useGiftAmount: 'N',
        payChannel: 'WeChat'
      }
    })
  }
  resetOrder(token, payId) {
    return this.request({
      url: api.resetOrder_url,
      method: 'POST',
      data: {
        token: token,
        payId: payId
      }
    })
  }
  login(data) {
    return this.request({
      url: api.login_url,
      method: "POST",
      data: data
    })
  }
}

export { ReqModel }

