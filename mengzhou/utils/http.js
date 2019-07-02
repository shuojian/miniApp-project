import{config} from '../config.js'

const tips = {
  1005:'ppkey无效',
  3000:'用户不存在',
  1:'抱歉，出现一个错误'
}

class HTTP{

  //request
  request({url,data={},method='GET'}){
   return new Promise((resolve,reject)=>{
     this._request(url, resolve, reject, data, method)
    })
  }

  //request
  _request(url, resolve, reject, data = {}, method = 'GET' ){
    //url, data, method
    wx.request({
      url:config.api_base_url + url,
      method:method,
      data:data,
      header: { 
        'content-type': 'application/x-www-form-urlencoded',
        // 'token': 'app.globalData.loginInfo.token',
        // 'Authorization': 'app.globalData.loginInfo.token'
        // 'content-type': 'application/json',
        // 'appkey': config.appkey
         },
      success: res=> {
        const code = res.statusCode.toString()
          if(code.startsWith('2')){
            resolve(res.data)
          }
          else{
            reject()
            const error_code = res.data.error_code
            this._show_error(error_code)
          }
      },
      fail: err=> {
        reject()
        this._show_error(1)
      }
    })
  }

  //show_error
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title: tip?tip:tips[1],
      icon: "none",
      duration: 2000
    })
  }

}

export {HTTP}