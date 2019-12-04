import { ReqModel } from '../../../models/request.js'
import { WxCacheModel } from '../../../models/wxcache.js'

const reqModel = new ReqModel()
const wxCacheModel = new WxCacheModel()

Page({
  data: {
    noData: true,
    fields: [],
    fields5:[],
    fields11: [],
    more: '',
    key:"one",

    page: 1,        //请求页数
    pageLimit: 0,   //页面数据条数,全局配置
    pageCount: 0,   //总页数
    count:0,        //数据总数
    loading: false,
    loaded: false,
  },

  onLoad: function (options) {
    // console.log('options', options)
    this.setData({ 
      key:options.key 
    })
    wxCacheModel.get("fields", reqModel.getFieldList())
    this._getFields()
  },

  _clearCache: function () {
    this.setData({
      fields: []
    });
  },

  async _getFields() {
    const res = await reqModel.getFieldList()
    console.log('fields -> ',res.data)
    if (res.data.length > 0) {
      let fields = res.data 
      let fields5 = fields.filter((p) => {
        return p.fieldSize == '5人制'
      })
      let fields11 = fields.filter((p) => {
        return p.fieldSize == '11人制'
      })
      this.setData({
        noData: false,
        fields,
        fields5,
        fields11,
        count: res.count,
        pageCount: Math.ceil(res.count / this.data.pageLimit),
      })
      }
    // wxCacheModel.put("fields", res.data, 1)
  },

  async getMoreFields() {
    let page = this.data.page
    let newFields = await reqModel.getFieldList(page)
    let fields = this.data.fields.concat(newFields.data) //新旧数据合并
    let fields5 = fields.filter((p) => {
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
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: app.globalData.shareTitle,
      path: app.globalData.startUrl,
      imageUrl: app.globalData.shareImgUrl
    }
  },
  //下拉刷新
  onPullDownRefresh () {
    this._clearCache()
    this._getGyms()
    wx.stopPullDownRefresh()
  },
  // 上拉触底
  onReachBottom() {
    if(this.data.page < this.data.pageCount){
      this.setData({
        loading: true,  //把"上拉加载"的变量设为false，显示 
        page: this.data.page + 1
      })
      this.getMoreFields()// 上拉获取更多数据
    }else{
      this.setData({
        loading:false,
        loaded:true
      })
    } 
  }
})