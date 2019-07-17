var phonePatten = /^\d{3}-\d{8}$/;
var mobilePatten = /^1\d{10}$/;

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

const toTime = (time = +new Date()) =>{
  var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
  return date.toJSON().substr(0, 19).replace('T', ' ');
}//1与2 格式区别 "2018-08-09 18:25:54"

const toTime2 = (time = +new Date()) => {
  var date = new Date(time + 8 * 3600 * 1000);
  return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
}// "2018.08.09 18:25:54"

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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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

module.exports = {
  formatTime: formatTime,
  formatTimeStamp: formatTimeStamp,
  formatPickerDate: formatPickerDate,
  formatPickerTime: formatPickerTime,
  getNowPickerDate: getNowPickerDate,
  getNowPickerTime: getNowPickerTime,
  formatPhone: formatPhone,
  toTime:toTime,
  toTime2: toTime2,
}
