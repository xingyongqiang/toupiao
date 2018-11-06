//app.js
var common = require("utils/common.js");
App({
  onLaunch: function () {
    // 登录--如果说存在openid-不进行登录取值
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var that = this
          //发起网络请求
          common.requestFun("home/wx/get_user_openid", { code: res.code }, "POST",function (result) {
            that.globalData.userOpenid = result.data
          })
        }
      }
    })
    // 获取用户信息--登录过后--直接获取
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userOpenid:""
  }
})