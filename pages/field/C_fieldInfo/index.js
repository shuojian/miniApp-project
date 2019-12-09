// pages/field/C_fieldInfo/index.js
const util = require('../../../utils/util.js');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
import { promisic } from '../../../utils/common.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gym:Object,
    field: Object,
    isGym:Boolean,
    // tude:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    lat1:null,
    lng1:null,
    lat2:null, 
    lng2:null,
    juli:null
  },

  lifetimes:{
    attached:()=>{
      promisic(wx.getSetting)()
        .then((res) => {
          console.log('getSetting->', res)
          if (!res.authSetting['scope.userLocation']) {
            promisic(wx.authorize)({ scope: 'scope.userLocation' })
              .then((res) => {
                console.log('wx.authorize success->', res)
              })
              .catch((err)=>{
                console.log('wx.authorize err->', err)
              })
          } else {
            return
          }
        })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getLocation(){
      // 调用QQ地图接口
      const qqmapsdk = new QQMapWX({
        key: 'PWZBZ-EFD3F-CM5J6-NKEIL-NTTFO-MXF7S'
      })

      //目的地位置
      // qqmapsdk.geocoder({
      //   address: this.properties.gym.gymAddr,
      //   success: (res) => {
      //     console.log('目的地位置->', res.result)
      //     const lat2 = res.result.location.lat;
      //     const lng2 = res.result.location.lng;
      //     this.setData({lat2,lng2})
      //   }
      // })
      this._show_loading()
      qqmapsdk.search({
        keyword: this.properties.gym.gymAddr,
        success: (res) => {
          if (res.data.length > 0){
            console.log('目的地位置->', res.data[0])
            const lat2 = res.data[0].location.lat;
            const lng2 = res.data[0].location.lng;

            promisic(wx.getSetting)()
            .then(data => {
              console.log('授权列表->', data)
              if (data.authSetting['scope.userLocation']) {
                return promisic(wx.getLocation)({ type: 'wgs84' })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '需要获取位置授权权限，点击确认。前往设置或退出程序？',
                  showCancel: true,
                  success: (res) => {
                    if (res.cancel) {
                      console.log('取消-->', res)
                    } else {
                      promisic(wx.openSetting)()
                        .then((res) => {
                          console.log('wx.openSetting -->', res)
                        })
                    }
                  },
                })
              }
              return false
            })
            .then(data => {
              if (!data) return
              console.log('当前位置->', data)
              const lat1 = data.latitude;
              const lng1 = data.longitude;

              const juli = this.juli(lat1, lng1, lat2, lng2)//计算两点间的距离
              console.log('距离km-->', juli);
              this.setData({ lat1, lng1, juli })
              return promisic(wx.openLocation)({
                latitude: lat2,
                longitude: lng2,
                name: this.properties.gym.gymName
              })
            })
            .then((data) => {
              console.log('打开地图-->', data);
              this._hide_Loading()
            })
          }else{
            util.showModal('sorry', '此地址无法获得精确坐标，因此无法为你导航')
              .then(
                (res) => console.log('resolved:->', res),
                (err) => console.log('rejected:->', err)
              )
          }  
        },
        complete: err=>{
          
        }
      })
    },

    // 距离计算
    juli(lat1, lng1, lat2, lng2) {
      console.log(lat1, lng1, lat2, lng2)
      var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        return s
    },

    _show_loading() {
      wx.showToast({
        title: 'loading...',
        icon: 'loading',
        duration: 15000
      })
      wx.showNavigationBarLoading()
    },

  _hide_Loading() {
      wx.hideToast()
      wx.hideNavigationBarLoading()
    },
    
    tel() {
      const phonenum = this.properties.gym.gymContactPhone
      wx.showActionSheet({
        itemList: [phonenum, '拨打', '复制'],
        success: (res) => {
          if (res.tapIndex == 1) {
            wx.makePhoneCall({
              phoneNumber: phonenum,
            })
          }
          if (res.tapIndex == 2) {
            wx.setClipboardData({
              data: phonenum,
              success(res) {
                wx.getClipboardData({
                  success(res) {
                    console.log(res.data)
                  }
                })
              }
            })
          }
        }
      })
    },

    copy() {
      const content = this.properties.gym.gymContactWechat
      wx.setClipboardData({
        data: content,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data)
            }
          })
        }
      })
    }
  }
})