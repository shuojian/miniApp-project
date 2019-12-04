var phonePatten = /^\d{3}-\d{8}$/;
var mobilePatten = /^1\d{10}$/;
var app = getApp()

const formatTime = (date) => {//坑爹的，报错
  // var date = new Date()//一定要记得写这个，不然会报date.getFullYear is not a function
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeStamp = timestamp => {
  if (!timestamp) {
    return ''
  }

  var date = new Date(Number(timestamp))
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  console.log(timestamp + ' formatTimeStamp:' + date)
  return [year, month, day].map(formatNumber).join('/')
}

const formatTimeStampIphon = (time) =>{
  let fm = time.split(/[- :]/); 
  let fmS = new Date(fm[0], fm[1] - 1, fm[2], fm[3], fm[4], fm[5]);
  return Date.parse(fmS)
}

const dealTime = (num) =>  {     // num：未来天数
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
}

const getNowPickerDate = function getNowPickerDate() {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
}

const getNowPickerTime = function getNowPickerTime() {
  var date = new Date()
  var hour = date.getHours()
  var min = date.getMinutes() + 20
  if (min > 60) {
    hour += 1;
    min -= 60;
  }
  return hour + ':' + (min > 9 ? min : '0' + min);
}

const formatPickerDate = date => {
  if (!date || date.toString().length < 8) {
    return null
  }
  date = date.toString()
  return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6);
}

const  formatPickerTime = time => {
  if (!time) {
    return '00:00'
  }
  time = '0000' + time;
  time = time.substr(time.length - 4)
  return time.substr(0, 2) + ':' + time.substr(2);
}

const toTime = (time = +new Date()) =>{
  var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
  return date.toJSON().substr(0, 19).replace('T', ' ');
}//1与2 格式区别 "2018-08-09 18:25:54"

const toTime2 = (time = +new Date()) => {
  var date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}// "2018.08.09 18:25:54"

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatPhone = phone => {
  if (!phone || phone.length < 11) {
    return null;
  }
  if (phonePatten.test(phone)) {
    return phone;
  }
  if (phone.length > 11) {
    phone = phone.substr(phone.length - 11)
  }
  if (!mobilePatten.test(phone)) {
    return null;
  }
  return phone;
}

// 升序
const compare = (property) => {
  return (obj1, obj2) => {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value1 - value2;     // 升序
  }
}

const timeout = (ms)=> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const backTo = async (ms, step) => {
  await timeout(ms);
  wx.navigateBack({
    delta: step
  })
}

const showToast_error = (title) => {
  return new Promise((resolve) => {
    wx.lin.showToast({
      title: title,
      icon: 'error',
      iconStyle: `color:#ff0000; size: 40`,
      success: resolve()
    })
  })
}

const showToast_success = (title) => {
  return new Promise((resolve) => {
    wx.lin.showToast({
      title: title,
      icon: 'success',
      iconStyle: `color:#7ec699; size: 40`,
      success:resolve()
    })
  })
}

const showModal = (title, content = "", showCancel = true, confirmText = "确定") => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      confirmText: confirmText,
      success: (res) => {
        if (res.confirm) {
          resolve()
        } else if (res.cancel) {
          reject(res.cancel)
          console.log('用户点击取消')
        }
      } 
    })
  })
}

const awaitWrap = (promise) =>{
  return promise 
  .then(data => [null, data])
  .catch(err => [err, null])
}

module.exports = {
  formatTime, //转换日期格式，（坑爹的，报错）
  formatTimeStamp, //转时间戳
  formatTimeStampIphon, // 兼容苹果的时间戳转换,time 格式2019-09-18 10:00:00
  dealTime,//处理未来七天的函数
  formatPickerDate,
  formatPickerTime,
  getNowPickerDate,
  getNowPickerTime,
  toTime,  //1与2 格式区别 "2018-08-09 18:25:54"
  toTime2,  // "2018.08.09 18:25:54"

  formatPhone,
  formatNumber, //数据加0转换
  compare, //升序
  timeout,
  backTo,
  showToast_error,
  showToast_success,
  showModal, 
  awaitWrap
}
