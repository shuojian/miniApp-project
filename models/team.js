var app = getApp()

import { HTTP } from '../utils/http.js'

class TeamModel extends HTTP {
  
  getTameList() {
    return this.request({
      url: 'team/page',
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  getDetail(bid) {
    return this.request({
      url: `team/getById?teamId=${bid}`,
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  getListMember(bid) {
    return this.request({
      url: `team/listMember?teamId=${bid}`,
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  getMyTeam(bid){
    return this.request({
      url: `team/myTeam?teamId=${bid}`,
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }
}



export { TeamModel }
