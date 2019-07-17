import { HTTP } from '../utils/http.js'
import { api } from '../utils/config.js'
const app = getApp()

class ReqModel extends HTTP {
/* 赛事 */
  getEventList(page = 1, limit = 15) { //分页
    return this.request({
      url: `event/page?limit=${limit}&page=${page}`,
    })
  }
  getEventDetail(bid) {
    return this.request({
      url: `event/getById?eventId=${bid}`
    })
  }
  getEventListTeam(bid) {
    return this.request({
      url: `event/listTeam?eventId=${bid}`
    })
  }
  getEventListTeamGroup(bid) {
    return this.request({
      url: `event/listTeamByGroup?eventId=${bid}`
    })
  }
  getEventMatch(bid) {
    return this.request({
      url: `match/page?eventId=${bid}`
    })
  }
  getEventListMember(bid) {
    return this.request({
      url: `event/listMember?eventId=${bid}`
    })
  }

  
  /* 球队 */
  getTameList(page = 1, limit = 15) {  //分页
    return this.request({
      url: `team/page?limit=${limit}&page=${page}`,
    })
  }
  getTeamDetail(bid) {
    return this.request({
      url: `team/getById?teamId=${bid}`,
    })
  }

  getListMember(bid) {
    return this.request({
      url: `team/listMember?teamId=${bid}`,
    })
  }

/* 场地 */
  getListSwiperImgs() {
    return this.request({
      url: "gym/listSwiperImgs",
    })
  }
  getGymList(page = 1,limit = 15) {  //分页
    return this.request({
      url: `gym/page?limit=${limit}&page=${page}`,
    })
  }
  getGymDetail(bid) {
    return this.request({
      url: `gym/getById?gymId=${bid}`,
    })
  }

  getFieldList(page = 1,limit = 15) {  //分页
    return this.request({
      url: `field/page?limit=${limit}&page=${page}`,
    })
  }
  getGymFieldList(bid) {
    return this.request({
      url: `field/page?gymId=${bid}`,
    })
  }
  getFieldDetail(bid) {
    return this.request({
      url: `field/getById?fieldId=${bid}`,
    })
  }
  getFieldListOrder(bid,day) {
    return this.request({
      url: `field/listDayOrder?fieldId=${bid}&matchDay=${day}`,
    })
  }
  getListDayOrder(bid) {
    return this.request({
      url: `field/listDayOrder?fieldId=${bid}`,
    })
  }

/* 我的 */
  getMyTeam() {
    return this.request({
      url: api.myTeam_url
    })
  }
  getMyTeamMsgs(bid) {
    return this.request({
      url: `team/listMemberLog?teamId=${bid}`
    })
  }
  getMyTeamDetail(bid) {
    return this.request({
      url: `team/getById?teamId=${bid}`,
    })
  }
  getMyOrder() {
    return this.request({
      url: api.getMyOrder_url
      // url: "sportsFieldOrder/getMyOrder"
    })
  }
  queryMyOrder() {
    return this.request({
      url: api.myOrder_url
      // url: "sportsFieldOrder/queryMyOrder"
    })
  }
  getMyOrderDetail(bid){
    return this.request({
      url: `sportsFieldOrder/getMyOrder?orderId=${bid}`,
    })
  }
}

export { ReqModel }

