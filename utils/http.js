import{ api } from 'config.js'

const app = getApp()

const tips = {
  1005:'ppkey无效',
  3000:'用户不存在',
  1:'抱歉，出现一个错误'
}

class HTTP{

  //request
  request({ url, data = {}, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  //request
  _request(url, resolve, reject, method = 'GET' ){
    //url, data, method
    this._show_loading()
    wx.request({
      url:api.base_url + url,
      method:method,
      data:{
        token: app.globalData.loginInfo.token
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
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
      },
      complete: res=> {
        this._hide_Loading()
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

  _show_loading(){
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 15000
    })
    wx.showNavigationBarLoading()
  }

  _hide_Loading(){
    wx.hideToast()
    wx.hideNavigationBarLoading()
  }

}

export {HTTP}