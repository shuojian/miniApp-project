var app = getApp()

import { HTTP } from '../utils/http.js'

class EventModel extends HTTP {

  getEventList() {
    return this.request({
      url:'event/page',
      data:{
        token: app.globalData.loginInfo.token
      }
    })
  }

  getDetail(bid){
    return this.request({
      url: `event/getById?eventId=${bid}`,
      data:{
        token:app.globalData.loginInfo.taken
      }
    })
  }

}

export { EventModel }

