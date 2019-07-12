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

}

export { TeamModel }
