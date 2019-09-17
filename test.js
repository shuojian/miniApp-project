var date = "2019-09-19 10:00:00"

var dateStr = Date.parse(date)
console.log('1:',dateStr)

var arr = date.split(/[- :]/);
let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
nndate=Date.parse(nndate)

console.log('nndate',nndate)

// let fmS = timeStarta.split(/[- :]/); //兼容苹果手机 转换开始时间
// let fmSt = new Date(fmS[0], fmS[1] - 1, fmS[2], fmS[3], fmS[4], fmS[5]);
// let matchTimeStart = Date.parse(fmSt)
// let fmE = timeEnda.split(/[- :]/); //结束时间
// let fmEd = new Date(fmE[0], fmE[1] - 1, fmE[2], fmE[3], fmE[4], fmE[5]);
// let matchTimeEnd = Date.parse(fmEd)

function tTime(time){
    let fm = time.split(/[- :]/); //兼容苹果手机 转换开始时间
      let fmS = new Date(fm[0], fm[1] - 1, fm[2], fm[3], fm[4], fm[5]);
      let tTime = Date.parse(fmS)
      return tTime
    // let fmE = timeEnd.split(/[- :]/); //结束时间
    // let fmEd = new Date(fmE[0], fmE[1] - 1, fmE[2], fmE[3], fmE[4], fmE[5]);
    // let matchTimeEnd = Date.parse(fmEd)
    // return tTime
}
var a = tTime("2019-09-19 10:00:00")
console.log(a)