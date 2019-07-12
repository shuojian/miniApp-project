var app = getApp()

import { HTTP } from '../utils/http.js'

class MyModel extends HTTP {

  getMyOrder() {
    return this.request({
      url: 'sportsFieldOrder/getMyOrder',
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  // getDetail(bid) {
  //   return this.request({
  //     url: `gym/getById?gymId=${bid}`,
  //     data: {
  //       token: app.globalData.loginInfo.token,
  //     }
  //   })
  // }
}


export { MyModel }
