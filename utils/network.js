var wxapi = require("promiseWxApi.js").wxapi;
var api = require("config.js").api;


const method = {
  post: "POST",
  get: "GET"
}

function fetch({ url, data = '', method = 'POST' }) {
  return new Promise((resole, reject) => {
    wxapi("getNetworkType")
      .then(res => {
        if (res.networkType == "none") {
          wx.showToast({
            title: '网络好像不太好哦，请稍候再试',
            icon: "none"
          })
        } else {
          wxapi("request", {
            url: api.base_url + url,
            header: {
              'Authorization': 'Bearer ' + wx.getStorageSync('token'),
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: data,
            method: method,
          })
            .then(res => {
              if (res.data.code == 1001) {
                //认证失败，重新登录
                wx.showToast({
                  title: '验证失败,自动重试',
                  icon: "none"

                })
                wxapi("removeStorage", { key: "token" })
                  .then(() => wxapi("login"))
                  .then(res => fetch({
                    url: api.login,
                    data: {
                      code: res.code
                    },
                  })
                  )
                  .then(res => {
                    if (res.code == 1) {
                      //登录成功，重新请求一次
                      wx.setStorageSync('token', res.data.token)
                      wxapi("request", {
                        url: api.base_url + url,
                        header: {
                          'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        data: data,
                        method: 'POST',
                      })
                        .then(res => {
                          if (res.data.code == 1) {
                            resole(res.data)
                          } else {
                            reject(res.data)
                          }
                        })
                    }
                  })
              } else if (res.data.code == 1) {
                //成功
                resole(res.data)
              } else {
                //失败
                reject(res.data)
              }
            }).catch(res => {
              reject(res.data)
            })
        }
      })

  })
}

module.exports = { fetch, method }