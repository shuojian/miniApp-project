import { ReqModel } from '../../../models/request.js'
const util = require('../../../utils/util.js')
const reqModel = new ReqModel()
import { promisic } from '../../../utils/common.js'
const app = getApp()

Page({
  data: {
    gymName: null,
    bid: null,
    field: {},
    fieldSize: "",
    fieldType:null,

    buy: "请选择订场时间",
    isNext:false,

    orders: [],//源数组添加selected,渲染到列表
    carts: [],//购物车
    count: 0,
    num: 0,
    price: 0,
    date: null,
    aWeek:null,
    start: null, //格式：18：00
    end: null,
    matchTimeStart: null,  //格式：时间戳
    matchTimeEnd: null,
  },

  // 生命周期函数--监听页面加载
    onLoad: function (query) {
      wx.showLoading()
      const receiveData = JSON.parse(query.data) //接收到的传值数据
      // console.log('页面接收', receiveData)
      const bid = receiveData.fieldId
      const fieldSize = receiveData.fieldSize  //11人制 or 5人制（11人制须分A、B场）

      //循环日期
      let arr = []
      for (let i = 0; i < 7; i++) {
        arr.push(util.dealTime(i))
      }
      arr[0].date = '今天'     // 格式化当前日期为 '今天'
      arr[0].day = ''
      
      this.setData({
        bid, fieldSize, //11人制 or 5人制（11人制须分A、B场）
        field: receiveData,
        gymName: query.gymName,
        fieldType: receiveData.fieldType,
        aWeek: arr,
        date: arr[0].eDate//默认日期 请求数据的传值格式为：20190901
      })
      // 11人制 or 5人制价格（11人制分A、B场，价格显示减半）
      if (fieldSize == "5人制"){
        this.setData({price: receiveData.amount,})
      } else if (fieldSize == "11人制"){
        this.setData({price: receiveData.amount/2,})
      }

      this._getFields(bid, arr[0].eDate)//请求数据的传值格式为：20190901
    },

  // tab 日期选择,获取当日场地时间表
    sDate(e){
      this.setData({
        date: e.detail.activeKey,
        carts:[],
        num:0
      })
      this._getFields(this.data.bid, e.detail.activeKey)
    },

  // 场地选择
    orderSelect(e){this._orderChange(e, 'selectedA', true)},
    orderAccept(e){this._orderChange(e, 'selectedB', false)},
    orderChange(e){this._orderChange(e, 'selected', false)},
    
  // 提交订单跳转
    orderConfirm:function(){
      let data = JSON.stringify(this.data) //传object
      wx.navigateTo({url: `../orderConfirm/index?data=${data}`})
    },

  // 获取场地列表 order 
    _getFields(bid, date) {
      const reqData = reqModel.getFieldListOrder(bid, date)
      reqData.then(res => {
        var orderList = res.data
        var orders = []
        orderList.map(((item, index) => {
          if (typeof item.hostOrderId != 'undefined' && typeof item.guestOrderId != 'undefined') {
            orders.push(Object.assign({},item,{
                  bookedA: true,
                  bookedB: true,
                  id: index,
                  price: this.data.price,
                  // bookedB: hasOwnProperty('hostOrderId')
              })
            )
          } else if (typeof item.hostOrderId != 'undefined' && typeof item.guestOrderId == 'undefined'){
            orders.push(Object.assign({},item,{
                  bookedA: true,
                  bookedB: false,
                  id: index,
                  price: this.data.price
              })
            )} else{orders.push(
              Object.assign({},item,{
                  selectedA: false,
                  selectedB: false,
                  id: index,
                  price: this.data.price
              })
            )}
        }))
        this.setData({
          orders,
        })
      })
    },

  // 订单选择
    _orderChange(e, selectVar, host){
      // console.log('当前选择：', e.currentTarget)
      let index = e.currentTarget.dataset.index;
      let cartId = e.currentTarget.dataset.id;
      let orders = this.data.orders;
      let carts = this.data.carts;
      let num = this.data.num; // var num = 0
      
      if (orders[index][selectVar]) { //变量，选中状态
        //carts 减 --
          --num; //数量减1
          if (num <= 0) { // 数量小于0，提交按钮不可用
            this.setData({
              buy: "请选择订场时间",
              isNext: false,
            })
          }
          orders[index][selectVar] = false//变量，取消选择
          const selectEl = carts.find((x) => {return x.id == e.currentTarget.dataset.id})
          const inx = carts.findIndex((fruit) => fruit.id == selectEl.id)
          carts.splice(inx, 1);
          if (carts.length > 0) {
            this._getCartTime(carts, orders) //更新订单
          }else {
            this.setData({carts, orders, num: carts.length,})
          } 
      } else {
        //carts 加++
          ++num; //数量加1
          if (carts.length >= 1) {
            if (cartId - carts[carts.length - 1].id > 1 || cartId - carts[0].id < -1) {
              util.showToast_error('选择不连续的时间段，须分多次提交订单')
            } else {
              orders[index][selectVar] = true//变量
              if(host){
                var order = {
                  time: e.currentTarget.dataset.time,
                  id: e.currentTarget.dataset.id,
                  booked: "N",
                  selectedA: true,//变量
                }
              } else {
                var order = {
                  time: e.currentTarget.dataset.time,
                  id: e.currentTarget.dataset.id,
                  booked: "Y",
                  hostorderid: e.currentTarget.dataset.hostorderid
                }  
              }
              carts.push(order)
            }
          } else {
            orders[index][selectVar] = true//变量
            if(host){
              var order = {
                time: e.currentTarget.dataset.time,
                id: e.currentTarget.dataset.id,
                booked: "N",
                selectedA: true,//变量
              }    
            }else{
              var order = {
                time: e.currentTarget.dataset.time,
                id: e.currentTarget.dataset.id,
                booked: "Y",
                hostorderid: e.currentTarget.dataset.hostorderid
              } 
            }
            carts.push(order)
          }
          this._getCartTime(carts,orders) // 更新订单
          this.setData({buy: "提交订单",isNext: true,}) // 数量大于0，提交按钮更新为可用
      }
    },

  // 订单时间
    _getCartTime(carts,orders) {
      carts.sort(util.compare("id"));//排序
      //格式和时间转换
      const seperator = "-";
      const str = carts[0].time.indexOf('-')
      const Y = `${this.data.date}`.slice(0, 4)//截取年
      const M = `${this.data.date}`.slice(4, 6)//截取月
      const D = `${this.data.date}`.slice(6)//截取日
      let date = `${Y}${seperator}${M}${seperator}${D}`

      //  截取开始、结束时间 格式：18：00
      const start = carts[0].time.slice(0, str)
      const end = carts[carts.length - 1].time.slice(str + 1)
      // 苹果格式有坑（日期 + 订单时间 + :00）：-> 2019-09-18 10:00:00
      let timeStart = `${date} ${start}:00`
      let timeEnd = `${date} ${end}:00` 
      // 转换成时间戳
      const matchTimeStart = util.formatTimeStampIphon(timeStart)
      const matchTimeEnd = util.formatTimeStampIphon(timeEnd)
      this.setData({
        orders, carts,
        num: carts.length,
        start, end,
        matchTimeStart, matchTimeEnd,
      })
    },

  // 分享  
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '梦舟体育',
        path: '/pages/index/index'
      }
    }
})

