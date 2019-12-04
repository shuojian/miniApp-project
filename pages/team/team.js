import { ReqModel } from '../../models/request.js'
import { WxCacheModel } from '../../models/wxcache.js'
import { promisic } from '../../utils/common.js'
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()
const app = getApp()

Page({
  data: {
    noData: true,
    teams:null,

    page: 1,        //请求页数
    pageLimit: 0,   //页面数据条数,全局配置
    pageCount: 0,   //总页数
    count:0,        //数据总数
    loading: false,
    loaded: false,
    // inputShowed: false,
    // inputVal: "",
  },

  onLoad() {
    wx.getSetting({
      success:(res)=> {
        console.log('getSetting->', res)
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            success:(res)=> {
              console.log('位置是否授权->',res)
              this.getAddress(res.latitude, res.longitude)
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: (res) => {
              wx.getLocation({
                success: (res) => {
                  console.log('位置是否授权->', res)
                  this.getAddress(res.latitude, res.longitude)
                }
              })
            },
          })
        }
      },
      fail(err){
        console.log('失败list->', err)
      }
    })

    let pageLimit = app.globalData.pageLimit
    this.setData({ pageLimit })

    this.getTeams()
    // this.userAuthorized()
    
  },
  //获取球队
  async getTeams() {
    const teams = await reqModel.getTameList()
    console.log('teams ->', teams)
    if (teams.data.length > 0){
      let sTeams = teams.data
      let nTeams = sTeams.sort(
        (a, b)=>{
          if (a.district < b.district) { return -1 }
          else if (a.district > b.district) { return 1 }
          else { return 0 }
        }
      ) //按所在区域排序
      this.setData({
        noData:false,
        teams: nTeams,
        count: teams.count,
        pageCount: Math.ceil(teams.count / this.data.pageLimit),
      })
    }
  },
  //翻页
  async getMoreTeams() {
    let page = this.data.page
    let newTeams = await reqModel.getTameList(page)
    let teams = this.data.teams.concat(newTeams.data) //新旧数据合并
    this.setData({
      teams
    })
  },

  //获取授权信息
  userAuthorized() {
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userLocation']) {
          return promisic(wx.getLocation)()
        }
        return promisic(wx.openSetting)()
      })
      .then(data => {
        console.log(data )
        this.getAddress(res.latitude, res.longitude)
      })
  },

  getAddress(latitude, longitude) {
    let qqmapsdk = new QQMapWX({
      key: 'PWZBZ-EFD3F-CM5J6-NKEIL-NTTFO-MXF7S'
    })

    qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      success(res) {
        console.log('success', res)
      }
    })
  },

  //位置授权
  // onAuthLocation() {
  //   wx.authorize({
  //     scope: 'scope.userLocation',
  //     success: (res) => {
  //       console.log('成功：', res)
  //       this._onGetLocation();//获取位置
  //     },
  //   })
  // },

  //获取位置
  _onGetLocation() {
    // getLocation(){
    //   wx.openLocation({//使用微信内置地图查看位置。
    //     latitude: this.properties.tude.location.lat,
    //     longitude: this.properties.tude.location.lng,
    //     name: this.properties.gym.gymName,
    //     desc: this.properties.tude.address
    //   })
    // },

    wx.getLocation({
      success: (res) => {
        console.log('成功：', res)
      },
      fail: (res) => {
        console.log('失败：', res)
      },
    })
  },


  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: app.globalData.startUrl
    }
  },

  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      loaded:false
    })
    this._clearCache();
    this.getTeams()
    wx.stopPullDownRefresh()
  },

  // 上拉触底
  onReachBottom() {
    if(this.data.page < this.data.pageCount){
      this.setData({
        loading: true,  //把"上拉加载"的变量设为false，显示 
        page: this.data.page + 1
      })
      this.getMoreTeams()// 上拉获取更多数据
    }else{
      this.setData({
        loading:false,
        loaded:true
      })
    }  
  },

  _clearCache() {
    this.setData({
      teams: null
    });
  },
  
})