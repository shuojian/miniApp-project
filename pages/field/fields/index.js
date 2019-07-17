import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    // gyms:{},
    fields: [],
    fields5:[],
    fields11: [],
    more: '',
    key:"one",

    pagenum:1
  },

  onLoad: function (options) {
    // console.log('options', options)
    this.setData({ 
      key:options.key 
    })
    wxCacheModel.get("fields", reqModel.getFieldList())
    // this._getGyms()
    this._getFields()
  },

  _clearCache: function () {
    this.setData({
      fields: []
    });
  },
  _getGyms: function () {
    const gyms = reqModel.getGymList()
    gyms.then(
      res => {
        this.setData({
          gyms: res.data,
        })
        console.log('场馆列表：', res.data)
        wxCacheModel.put("gyms", res.data, 1)
    })

  },
  _getFields: function () {
    const fields = reqModel.getFieldList()
    fields.then(
      res => {
        let fields = res.data
        let fields5 = fields.filter((p)=>{
          return p.fieldSize == '5人制'
        })
        let fields11 = fields.filter((p) => {
          return p.fieldSize == '11人制'
        })
        this.setData({
          fields,
          fields5,
          fields11,
        })
        console.log('fields：', res.data)
        wxCacheModel.put("fields", res.data, 1)
      })

  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '梦舟体育',
      path: '/pages/index/index'
      // path: '/page/user?id=123'
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this._clearCache()
    this._getGyms()
    wx.stopPullDownRefresh()
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let pagenum = this.data.pagenum + 1; //获取当前页数并+1
    this.setData({
      pagenum: pagenum, //更新当前页数
    })
    this.getGyms();//重新调用请求获取下一页数据
  }
})