/*
* 参数说明
* url：域名后的数据请求接口
* data：提交的数据
* getPost：get请求还是post请求
* success：callback函数
**/
function requestFun(url, data, getPost, success) {
  let urlOld = "https://toupiao.xinsu360.net/";   // 域名链接
  let urlNew = '';       // 完整数据请求链接
  let header = '';       // 请求头

  urlNew = urlOld + url;

  if (getPost == 'POST') {
    header = 'application/x-www-form-urlencoded'
  } else {
    header = 'application/json'
  }

  wx.request({
    url: urlNew,
    data: data,
    header: {
      'content-type': header
    },
    method: getPost,
    success: function (res) {
      success(res.data)
    },
    fail: function (res) {
      console.log(res);
    },
    complete: function (res) { },
  })
}

module.exports = {
  requestFun: requestFun
}