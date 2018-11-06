// pages/show/show.js
var common = require("../../utils/common.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this
    common.requestFun("home/wx/get_content", { eid: options.eid}, "GET", function (result) {
      that.setData({
        content: result.data
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //投票按钮绑定事件
  tiVoteBind: function (res) {
    console.log(res);
    var eid = res.currentTarget.dataset.eid;
    var openid = app.globalData.userOpenid;
    console.log(eid);
    common.requestFun("home/wx/set_vote", { eid: eid, openid: openid }, "POST", function (result) {
      if (result.status == 1) {
        wx.showToast({
          title: '成功为' + eid + '号投票',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //用户同意授权获取信息
  getUserInfoBind: function (res) {
    var userInfo = res.detail.userInfo
    if (userInfo) {
      app.globalData.userInfo = userInfo
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
      var data = {
        openid: app.globalData.userOpenid,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        city: userInfo.city
      }
      common.requestFun("home/wx/set_user_info", data, "POST", function () { })
    }
  }
})