// import { HTTP } from '../utils/http.js'
import { api } from '../utils/config.js'
const app = getApp()
const tips = {
  204: '暂无数据',
  401: '没有授权',
  403: '登录错误',
  1: '抱歉，出现一个错误'
}

 class UploadFile{
   //request
   uploadFile(path, file, refId, refType) {
     return new Promise((resolve, reject) => {
       this._uploadFile(path, resolve, reject, file, refId, refType)
     })
   }

   _uploadFile(path, resolve, reject,  file, refId, refType) {
    this._show_loading()
    wx.uploadFile({
      url: api.base_url + 'file/uploadToWxCos',
      filePath: path,
      name: 'file',
      method: "POST",
      formData: {
        token: app.globalData.loginInfo.token,
        appId: app.globalData.appId,
        file: file,
        refId: refId || '',
        refType: refType || '',
      },
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        }
        else {
          reject(res.data.error_code)
          const error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      fail: err => {
        reject(err)
        this._show_error(1)
      },
      complete: res => {
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
       title: tip ? tip : tips[1],
       icon: "none",
       duration: 2000
     })
   }

   _show_loading() {
     wx.showToast({
       title: 'loading...',
       icon: 'loading',
       duration: 15000
     })
     wx.showNavigationBarLoading()
   }

   _hide_Loading() {
     wx.hideToast()
     wx.hideNavigationBarLoading()
   }

 }
 
export{ UploadFile }