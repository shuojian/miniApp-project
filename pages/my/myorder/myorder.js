import {
  MyModel
}from "../../../models/my.js"

const myModel = new MyModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myOrder:{},
    nodata: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const myOrder = myModel.getMyOrder()
    console.log('myOrder:')
    console.log(myOrder)
    myOrder.then(
      res=>{
        console.log('myOrder res:')
        console.log(res) 
        this.setData({
          myOrder:res.data
        })
      }
    )
  },

  toOrderDetail(){
    wx.navigateTo({
      url: 'detail/detail',
    })
  }
})