// import { HTTP } from '../utils/http.js'
// import { api } from '../utils/config.js'
const app = getApp()

 class UploadFile{
   uploadFile(filePath, file, refId, refType) {
    wx.showLoading()
    wx.uploadFile({
      url: this.globalData.baseURL + 'file/uploadToWxCos',
      filePath: filePath,
      name: 'file',
      method: "POST",
      formData: {
        token: this.globalData.loginInfo.token,
        appId: this.globalData.appId,
        // duration:
        file: file,
        // fileType:,
        refId: refId || '',
        refType: refType || '',
      },
      success: (res) => {
        console.log('文件上传信息：', res, res.data)
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  }

  // uploadFile: function (filePath, file, refId, refType,  cb) {
  //   if (!filePath) {
  //     typeof cb == "function" && cb()
  //     return
  //   }
  //   wx.uploadFile({
  //     url: this.globalData.baseURL + 'file/uploadToWxCos',
  //     filePath: filePath,
  //     name: 'file',
  //     method:"POST",
  //     formData: {
  //       token: this.globalData.loginInfo.token,
  //       appId: this.globalData.appId,
  //       // duration:
  //       file:file,
  //       // fileType:,
  //       refId: refId || '',
  //       refType: refType || '',
  //       // sort: sort || 0
  //     },
  //     success: (res) =>{
  //       if (res.data) {
  //         var retData = JSON.parse(res.data)
  //         if (retData.code != 0) {
  //           typeof cb == "function" && cb()
  //           return
  //         }
  //         typeof cb == "function" && cb(retData.data.url)
  //       }
  //     },
  //     fail: (res)=> {
  //       typeof cb == "function" && cb()
  //     }
  //   })
  // },
 }
 
export{ UploadFile }