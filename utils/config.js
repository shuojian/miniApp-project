const api = {
  // base_url: "https://www.mzsport.top/football/",
  base_url: 'https://mzsport.top/football/',// test
  // base_url: 'http://47.107.33.58:8080/football/' // test
  // base_url: 'http://127.0.0.1:8080/football/' // dev
  login_url: 'acc/wxLogin',
  // start_url: '/pages/index/index',
  start_url: '/page/field/index',
  // event_url: 'event/page',

  // 赛事
  event_url: 'event/page',
  eventDetail_url: 'event/getById',
  eventListTeam_url: 'event/listTeam',
  eventListTeamByGroup_url: 'event/listTeamByGroup',
  eventMatch_url: 'match/page',
  eventListMember_url: 'event/listMember',

  // 场地
  gymImgs_url: 'gym/listSwiperImgs',
  gymList_url: 'gym/page',
  gymDetail_url: 'gym/getById',
  fieldList_url: 'field/page',
  fieldDetail_url: 'field/getById',
  fieldOrder_url: 'field/listDayOrder',
  // order_url: 'sportsFieldOrder/create',
  // resetOrder_url: 'sportsFieldPay/resetOrder',
  // pay_url: 'sportsFieldPay/payOrder',

  // 球队
  team_url: 'team/page',
  teamDetail_url: 'team/getById',
  teamMember_url: 'team/listMember',
  creatTeam_url: 'team/create',
  updateTeam_url: 'team/update',

  applyForJoinTeam_url: 'team/applyForJoin',
  applyAcceptTeam_url: 'team/join',
  applyRefuseTeam_url: 'team/reject',
  kickoutTeam_url: 'team/kickout',
  leaveTeam_url: 'team/leave',
  disableTeam_url: 'team/disable',
  enableTeam_url: 'team/enable',
  changeTeamleader_url: 'team/changeTeamleader',

  // 我的
  myTeam_url: 'team/myTeam',
  myTeamMsgs_url: 'team/listMemberLog',
  myOrder_url: 'sportsFieldOrder/queryMyOrder',
  myOrderDetail_url: 'sportsFieldOrder/getById',
  // getMyOrder_url: 'sportsFieldOrder/getMyOrder',

  //post
  createOrder_url: 'sportsFieldOrder/create',
  engageOrder_url: 'sportsFieldOrder/engage',
  payOrder_url: 'sportsFieldPay/payOrder',
  resetOrder_url: 'sportsFieldPay/resetOrder',
  
  uploap_url: 'file/upload',
  uploapToWxCos_url: 'file/uploadToWxCos',
  pageLimit:12
}

module.exports = { api }