// pages/field/C_fieldInfo/index.js
const util = require('../../../utils/util.js');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

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
      qqmapsdk.search({
        keyword: this.properties.gym.gymAddr,
        success: (res) => {
          // console.log('success->', res.data)
          const tude = res.data[0]
          wx.openLocation({//使用微信内置地图查看位置。
            desc: tude.address,
            latitude: tude.location.lat,
            longitude: tude.location.lng,
            name: this.properties.gym.gymName
          })
        },
        fail: (err)=> {
          console.log('err->', err)
            util.showModal('地址位置未授权','你取消了地理位置授权，无法使用地图为你导航')
            .then(
              (res) => console.log('resolved:->', res),
              (err) => {
                console.log('rejected:->', err)
              }
            )
        },
      })
    },
    
    tel() {
      const phonenum = this.properties.gym.gymContactPhone
      wx.makePhoneCall({
        phoneNumber: phonenum
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
