import { ReqModel } from '../../../models/request.js'
const util = require('../../../utils/util.js')
const reqModel = new ReqModel()
import { promisic } from '../../../utils/common.js'
const app = getApp()

Page({
  data: {
    fieldId: null,
    realName: "",
    fieldSize:"",
    gymName: null,
    field: {},
    bid: null,
    fieldType:null,

    buy: "请选择订场时间",
    opacity: 0.2,
    isNext:false,

    orders: [],//源数组添加selected,渲染到列表
    carts: [],//购物车
    count: 0,
    num: 0,
    price: 0,
    date: null,
    aWeek:null,
    timeStart: null,
    timeEnd: null,
    matchTimeStart: null,
    matchTimeEnd: null,
    isfull:null,

    inited: false,
    parentUserCode: null,
    lastRouteId: null,
    authLogin: true,
  },

  // 生命周期函数--监听页面加载
    onLoad: function (query) {
      wx.showLoading()
      const bid = query.bid
      const fieldSize = query.fieldSize
      console.log('页面接收:', query)

      //循环日期
      let arr = []
      for (let i = 0; i < 7; i++) {
        arr.push(this._dealTime(i))
      }
      arr[0].date = '今天'     // 格式化当前日期为 '今天'
      arr[0].day = ''
      this.setData({
        aWeek: arr 
      }) // console.log('日期:', arr)
      
      this.setData({
        bid,
        fieldSize,
        field: query,
        gymName: query.gymName,
        fieldType: query.fieldType,
        date: arr[0].eDate//默认日期 
      })
      if (fieldSize == "5人制"){
        this.setData({
          price: query.amount,
        })
      } else if (fieldSize == "11人制"){
        this.setData({
          price: query.amount/2,
        })
      }

      this._getFields(bid, arr[0].eDate)//格式20190901
    },

  // 日期选择
    sDate(e){
      // const dateStr = e.detail.value.replace(/\-/g, "")
      // console.log('选择日期tab', e.detail.activeKey)
      this.setData({
        date: e.detail.activeKey,
        carts:[],
        num:0
      })
      // this._getFields(this.data.bid, dateStr)
      this._getFields(this.data.bid, e.detail.activeKey)
    },

  // 场地选择
    orderSelect(e) {
      console.log('当前选择：', e.currentTarget)
      let index = e.currentTarget.dataset.index;
      let cartId = e.currentTarget.dataset.id;
      let arr = this.data.orders;
      // var num = 0
      let num = this.data.num;
      let carts = this.data.carts;

      if (arr[index].selectedA == true) {
        //carts --
          --num;
          if (num <= 0) {
            this.setData({
              opacity: 0.2,
              buy: "请选择订场时间",
              isNext: false,
            })
          }
          arr[index].selectedA = false
          const selectEl = carts.find(
            (x) => {
              return x.id == e.currentTarget.dataset.id
            })
          var inx = carts.findIndex((fruit) => fruit.id == selectEl.id)
          carts.splice(inx, 1);
          if (carts.length > 0) {
            carts.sort(this._compare("id"));//排序
            //获取时间
            const str = carts[0].time.indexOf('-')
            const timeStart = carts[0].time.slice(0, str)//截取时间
            const timeEnd = carts[carts.length - 1].time.slice(str + 1)
            let timeStarta = `${this.data.date} ${timeStart}`
            let timeEnda = `${this.data.date} ${timeEnd}`
            let matchTimeStart = (new Date(timeStarta)).getTime()
            let matchTimeEnd = (new Date(timeEnda)).getTime()
            this.setData({
              orders: arr,
              carts,
              num: carts.length,
              timeStart,
              timeEnd,
              matchTimeStart,
              matchTimeEnd
            })
            // console.log("-订单：", carts)
            // console.log("-timeStart：", timeStart, matchTimeStart,"timeEnd：", timeEnd, matchTimeEnd)
          }
          else {
            this.setData({
              orders: arr,
              carts,
              num: carts.length,
            })
          } 
        console.log("+列表：", arr)
        console.log("+订单：", carts)
      } else {
        //carts ++
          ++num;
          if (carts.length >= 1) {
            if (cartId - carts[carts.length - 1].id > 1 || cartId - carts[0].id < -1) {
              this.showToast()
            } else {
              arr[index].selectedA = true
              var order = {
                time: e.currentTarget.dataset.time,
                id: e.currentTarget.dataset.id,
                booked: "N",
                selectedA: true,
              }
              carts.push(order)
            }
          } else {
            arr[index].selectedA = true
            var order = {
              time: e.currentTarget.dataset.time,
              id: e.currentTarget.dataset.id,
              booked: "N",
              selectedA: true,
            }
            carts.push(order)
          }
          carts.sort(this._compare("id"));//排序
          //获取时间
            const seperator = "-";
            const str = carts[0].time.indexOf('-')
            const timeStart = carts[0].time.slice(0, str)//截取开始时间
            const timeEnd = carts[carts.length - 1].time.slice(str + 1)//截取结束时间
            const Y = `${this.data.date}`.slice(0, 4)//截取年
            const M = `${this.data.date}`.slice(4, 6)//截取月
            const D = `${this.data.date}`.slice(6)//截取日
            let date = `${Y}${seperator}${M}${seperator}${D}`
            let timeStarta = `${date} ${timeStart}`
            let timeEnda = `${date} ${timeEnd}`
            let matchTimeStart = (new Date(timeStarta)).getTime()
            let matchTimeEnd = (new Date(timeEnda)).getTime()

          //更新数据
            this.setData({
              opacity: 1,
              buy: "提交订单",
              orders: arr,
              isNext: true,
              carts,
              num: carts.length,
              timeStart: timeStart,
              timeEnd: timeEnd,
              matchTimeStart: matchTimeStart,
              matchTimeEnd: matchTimeEnd,
            })
        console.log("+列表：", arr)
        console.log("+订单：", carts)
        // console.log("+timeStart：", timeStarta, matchTimeStart, "timeEnd：", timeEnda, matchTimeEnd)
      }

      // this._orderChange(e)
    },
    orderAccept(e) {
      console.log('当前选择：', e.currentTarget)
      let index = e.currentTarget.dataset.index;
      let cartId = e.currentTarget.dataset.id;
      let arr = this.data.orders;
      // var num = 0
      let num = this.data.num;
      let carts = this.data.carts;
      if (arr[index].selectedB == true) {
        // let num = this.data.num;
        // let carts = this.data.carts;
        //carts--
        --num;
        if (num <= 0) {
          this.setData({
            opacity: 0.2,
            buy: "请选择订场时间",
            isNext: false,
          })
        }
        arr[index].selectedB = false
        const selectEl = carts.find(
          (x) => {
            return x.id == e.currentTarget.dataset.id
          })
        var inx = carts.findIndex((fruit) => fruit.id == selectEl.id)
        carts.splice(inx, 1);

        if (carts.length > 0) {
          carts.sort(this._compare("id"));//排序

          //获取时间
          const str = carts[0].time.indexOf('-')
          const timeStart = carts[0].time.slice(0, str)//截取时间
          const timeEnd = carts[carts.length - 1].time.slice(str + 1)
          let timeStarta = `${this.data.date} ${timeStart}`
          let timeEnda = `${this.data.date} ${timeEnd}`
          let matchTimeStart = (new Date(timeStarta)).getTime()
          let matchTimeEnd = (new Date(timeEnda)).getTime()

          //更新订单
          this.setData({
            orders: arr,
            carts,
            num: carts.length,
            timeStart,
            timeEnd,
            matchTimeStart,
            matchTimeEnd
          })
          console.log("-订单：", carts)
          console.log("+列表：", arr)
          // console.log("-timeStart：", timeStart, matchTimeStart,"timeEnd：", timeEnd, matchTimeEnd)
        }
        else {
          //更新订单
          this.setData({
            orders: arr,
            carts,
            num: carts.length,
          })
        }
      } else {
        // let num = this.data.num;
        // let carts = this.data.carts;
        //carts++
        ++num;
        if (carts.length >= 1) {
          if (cartId - carts[carts.length - 1].id > 1 || cartId - carts[0].id < -1) {
            this.showToast()
          } else {
            arr[index].selectedB = true
            var order = {
              time: e.currentTarget.dataset.time,
              id: e.currentTarget.dataset.id,
              booked: "N",
              selectedB: true
            }
            carts.push(order)
          }
        } else {
          arr[index].selectedB = true
          var order = {
            time: e.currentTarget.dataset.time,
            id: e.currentTarget.dataset.id,
            booked: "N",
            selectedB: true
          }
          carts.push(order)
        }
        carts.sort(this._compare("id"));//排序
        //获取时间
        const seperator = "-";
        const str = carts[0].time.indexOf('-')
        const timeStart = carts[0].time.slice(0, str)//截取开始时间
        const timeEnd = carts[carts.length - 1].time.slice(str + 1)//截取结束时间
        const Y = `${this.data.date}`.slice(0, 4)//截取年
        const M = `${this.data.date}`.slice(4, 6)//截取月
        const D = `${this.data.date}`.slice(6)//截取日
        let date = `${Y}${seperator}${M}${seperator}${D}`
        let timeStarta = `${date} ${timeStart}`
        let timeEnda = `${date} ${timeEnd}`
        let matchTimeStart = (new Date(timeStarta)).getTime()
        let matchTimeEnd = (new Date(timeEnda)).getTime()

        //更新订单
        this.setData({
          opacity: 1,
          buy: "提交订单",
          orders: arr,
          isNext: true,
          carts,
          num: carts.length,
          timeStart: timeStart,
          timeEnd: timeEnd,
          matchTimeStart: matchTimeStart,
          matchTimeEnd: matchTimeEnd,
        })
        console.log("+列表：", arr)
        console.log("+订单：", carts)
        // console.log("+timeStart：", timeStarta, matchTimeStart, "timeEnd：", timeEnda, matchTimeEnd)
      }

      // this._orderChange(e)
    },
    orderChange(e) {
      console.log('当前选择：', e.currentTarget)
      let index = e.currentTarget.dataset.index;
      let cartId = e.currentTarget.dataset.id;
      let arr = this.data.orders;
      // var num = 0
      let num = this.data.num;
      let carts = this.data.carts;

      if (arr[index].selected == true) {
        //carts --
          --num;
          if (num <= 0) {
            this.setData({
              opacity: 0.2,
              buy: "请选择订场时间",
              isNext: false,
            })
          }
          arr[index].selected = false
          const selectEl = carts.find(
            (x) => {
              return x.id == e.currentTarget.dataset.id
            })
          var inx = carts.findIndex((fruit) => fruit.id == selectEl.id)
          carts.splice(inx, 1);
          if (carts.length > 0) {
            carts.sort(this._compare("id"));//排序
            //获取时间
              const str = carts[0].time.indexOf('-')
              const timeStart = carts[0].time.slice(0, str)//截取时间
              const timeEnd = carts[carts.length - 1].time.slice(str + 1)
              let timeStarta = `${this.data.date} ${timeStart}`
              let timeEnda = `${this.data.date} ${timeEnd}`
              let matchTimeStart = (new Date(timeStarta)).getTime()
              let matchTimeEnd = (new Date(timeEnda)).getTime()
            //更新数据
              this.setData({
                orders: arr,
                carts,
                num: carts.length,
                timeStart,
                timeEnd,
                matchTimeStart,
                matchTimeEnd
              })
          // console.log("-订单：", carts)
        }else {
          this.setData({
            orders: arr,
            carts,
            num: carts.length,
          })
        }
        console.log("+列表：", arr)
        console.log("+订单：", carts)
      } else {
        //carts ++
          ++num;
          if (carts.length >= 1) {
            if (cartId - carts[carts.length - 1].id > 1 || cartId - carts[0].id < -1) {
              this.showToast()
            } else {
              arr[index].selected = true
              var order = {
                time: e.currentTarget.dataset.time,
                id: e.currentTarget.dataset.id,
                booked: "N",
                selected: true,
              }
              carts.push(order)
            }
          } else {
            arr[index].selected = true
            var order = {
              time: e.currentTarget.dataset.time,
              id: e.currentTarget.dataset.id,
              booked: "N",
              selected: true,
            }
            carts.push(order)
          }
        carts.sort(this._compare("id"));//排序
        //获取时间
          const seperator = "-";
          const str = carts[0].time.indexOf('-')
          const timeStart = carts[0].time.slice(0, str)//截取开始时间
          const timeEnd = carts[carts.length - 1].time.slice(str + 1)//截取结束时间
          const Y = `${this.data.date}`.slice(0, 4)//截取年
          const M = `${this.data.date}`.slice(4, 6)//截取月
          const D = `${this.data.date}`.slice(6)//截取日
          let date = `${Y}${seperator}${M}${seperator}${D}`
          let timeStarta = `${date} ${timeStart}`
          let timeEnda = `${date} ${timeEnd}`
          let matchTimeStart = (new Date(timeStarta)).getTime()
          let matchTimeEnd = (new Date(timeEnda)).getTime()

        //更新数据
          this.setData({
            opacity: 1,
            buy: "提交订单",
            orders: arr,
            isNext: true,
            carts,
            num: carts.length,
            timeStart: timeStart,
            timeEnd: timeEnd,
            matchTimeStart: matchTimeStart,
            matchTimeEnd: matchTimeEnd,
          })
        console.log("+列表：", arr)
        console.log("+订单：", carts)
      }
    },
    
  // 选择提交
    orderConfirm:function(){
      let carts = JSON.stringify(this.data.carts)
      wx.navigateTo({
        url: `../orderConfirm/index?date=${this.data.date}&num=${this.data.num}&matchTimeStart=${this.data.matchTimeStart}&matchTimeEnd=${this.data.matchTimeEnd}&timeStart=${this.data.timeStart}&timeEnd=${this.data.timeEnd}&gymName=${this.data.gymName}&fieldId=${this.data.fieldId}&fieldName=${this.data.field.name}&fieldSize=${this.data.fieldSize}&fieldType=${this.data.fieldType}&price=${this.data.price}&carts=${carts}`
      })
    },

  // 获取场地列表 order 
    _getFields(bid, date) {
      const reqData = reqModel.getFieldListOrder(bid, date)
      reqData.then(res => {
        var orderList = res.data
        var orders = []
        orderList.map(((item, index) => {
          orders.push(
            Object.assign(
              {},
              item,
              { 
                selectedA: false, 
                selectedB:false, 
                id: index, 
                price: this.data.price,
              }
            )
          )
        }))
        this.setData({
          orders,
          fieldId: bid
        })
        console.log('获取场地列表orders：', orders)
      })
    },

  // 处理未来七天的函数
    _dealTime(num) {     // num：未来天数
      let time = new Date()     // 获取当前时间日期
      let date = new Date(time.setDate(time.getDate() + num)).getDate()  //先获取日期，在按需求设置日期，最后获取需要的
      let month = time.getMonth() + 1   // 获取月份
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (date >= 0 && date <= 9) {
        date = "0" + date;
      }
      const eDate = `${time.getFullYear()}${month}${date}`;
      let day = time.getDay()   //  获取星期
      switch (day) {             //  格式化
        case 0: day = "(周日)"
          break
        case 1: day = "(周一)"
          break
        case 2: day = "(周二)"
          break
        case 3: day = "(周三)"
          break
        case 4: day = "(周四)"
          break
        case 5: day = "(周五)"
          break
        case 6: day = "(周六)"
          break
      }
      var obj = {
        date,
        day,
        month,
        eDate,
      }
      return obj      // 返回对象
    },

  // 初始化
    _init(lastRouteId) {
      if (app.globalData.loginInfo && app.globalData.loginInfo.inReview && app.globalData.loginInfo.inReview == 'N') {
        this.setData({
          inited: true
        })
      } else {
        this.setData({
          inited: true
        })
      }
    },

  // 升序
    _compare(property){
      return function (obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;     
      }
    },
  // showToast
    showToast(title = '选择不连续的时间段，须分多次提交订单', icon = 'error', color = '#ff0000', size = 40) {
      wx.lin.showToast({
        title: title,
        icon: icon,
        iconStyle: `color:${color}; size: ${size}`,
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

    // let date = new Date();
      // let today = `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`
})

