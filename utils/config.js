const api = {
  // base_url: "https://www.mzsport.top/football/",
  base_url: 'https://mzsport.top/football/',// test
  // base_url: 'http://47.107.33.58:8080/football/' // test
  // base_url: 'http://127.0.0.1:8080/football/' // dev

  login_url: 'acc/wxLogin',
  // event_url: 'event/page',
  match_url: 'match/page',
  
  fieldList_url: 'field/page',
  fieldOrder_url: 'field/listDayOrder',
  gym_url: 'gym/page',
  uploap_url:'file/upload',

  order_url: 'sportsFieldOrder/create',
  resetOrder_url: 'sportsFieldPay/resetOrder',
  pay_url: 'sportsFieldPay/payOrder',
  myOrder_url:'sportsFieldOrder/queryMyOrder',
  getMyOrder_url: 'sportsFieldOrder/getMyOrder',

  team_url: 'team/page',
  member_url: 'team/listMember',
  myTeam_url: 'team/myTeam',
  applyForJoinTeam_url:'team/applyForJoin',
  applyAcceptTeam_url:'team/join',
  applyRefuseTeam_url: 'team/reject',
  kickoutTeam_url: 'team/kickou',
  leaveTeam_url: 'team/leave',
  disableTeam_url: 'team/disable',
  enableTeam_url: 'team/enable',
  changeTeamleader_url: 'team/changeTeamleader',
}

module.exports = { api }