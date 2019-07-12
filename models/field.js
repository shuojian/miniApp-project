var app = getApp()

import { HTTP } from '../utils/http.js'

class FieldModel extends HTTP {

  getGymList() {
    return this.request({
      url: 'gym/page',
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  getDetail(bid){
    return this.request({
      url: `gym/getById?gymId=${bid}`,
      data:{
        token:app.globalData.loginInfo.token,
      }
    })
  }

}

export { FieldModel }