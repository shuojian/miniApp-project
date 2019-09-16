import { HTTP } from '../utils/http.js'
import { api } from '../utils/config.js'
const app = getApp()

class ReqModel extends HTTP {
/* 赛事 */
  getEventList(page = 1) { //分页
    return this.request({
      url: `event/page`,
      data: {
        page: page,
        limit: app.globalData.pageLimit
      }
    })
  }
  getEventDetail(bid) {
    return this.request({
      url: `event/getById`,
      data: { eventId:bid }
    })
  }
  getEventListTeam(bid) {
    return this.request({
      url: `event/listTeam`,
      data: { eventId: bid }
    })
  }
  getEventListTeamGroup(bid) {
    return this.request({
      url: `event/listTeamByGroup`,
      data: { eventId: bid }
    })
  }
  getEventMatch(bid) {
    return this.request({
      url: `match/page`,
      data: { eventId: bid }
    })
  }
  getEventListMember(bid) {
    return this.request({
      url: `event/listMember`,
      data: { eventId: bid }
    })
  }
  
  /* 球队 */
  getTameList(page = 1) {  //分页
    return this.request({
      url: api.team_url,
      data:{
        page:page,
        limit: app.globalData.pageLimit
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
      url: app.globalData.baseURL + api.creatTeam_url,
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
        limit: app.globalData.pageLimit
      }
    })
  }
  getGymList(page = 1) {  //分页
    return this.request({
      url: api.gymList_url,
      data: {
        page: page,
        limit: app.globalData.pageLimit
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
  getMyTeam() {
    return this.request({
      url: api.myTeam_url,
      data:{token: app.globalData.loginInfo.token}
    })
  }
  getMyTeamMsgs(bid) {
    return this.request({
      url: api.myTeamMsgs_url,
      data: { teamId: bid,token: app.globalData.loginInfo.token}
    })
  }
  getMyTeamDetail(bid) {
    return this.request({
      url: api.myTeamDetail_url,
      data: { teamId: bid,token: app.globalData.loginInfo.token}
    })
  }
  // getMyOrder() {
  //   return this.request({
  //     url: api.getMyOrder_url,
  //     data: {token: app.globalData.loginInfo.token}
  //   })
  // }
  queryMyOrder() {
    return this.request({
      url: api.myOrder_url,
      data: {token: app.globalData.loginInfo.token}
    })
  }
  getMyOrderDetail(bid){
    return this.request({
      url: api.myOrderDetail_url,
      data: { orderId: bid,token: app.globalData.loginInfo.token }
    })
  }
}

export { ReqModel }

