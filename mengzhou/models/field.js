import { HTTP } from '../utils/http.js'

class FieldModel extends HTTP {

  getFieldList() {
    return this.request({
      url: 'field/page',
      data: {
        token: app.globalData.loginInfo.token
      }
    })
  }

  // getDetail(bid){
  //   return this.request({
  //     url:'field/${bid}/detauk',
  //     data:{
  //       token:app.globalData.loginInfo.token
  //     }
  //   })
  // }

}

export { FieldModel }