// pages/list/list.js
var common = require("../../utils/common.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: 0,
    enrollList:[],
    page: 1,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  },
  // 页面渲染完成后
  onReady: function () {
    var that = this
    that.getEnrollList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.page = 1
    this.data.enrollList = []
    this.getEnrollList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showNavigationBarLoading();
    this.getEnrollList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //加载数据
  listStatusTap: function(event) {
    var that = this
    that.setData({
      option: event.currentTarget.dataset.id
    });
    that.data.page = 1
    that.data.enrollList = []
    that.getEnrollList()
  },

  //请求数据上拉加载
  getEnrollList: function () {
    var that = this
    common.requestFun("home/wx/get_index_list", { option : that.data.option, page: that.data.page }, "GET", function (result) {
      if (result.status == 1) {
        var newEnrollList = [];
        newEnrollList = that.data.enrollList.concat(result.data);
        that.setData({
          enrollList: newEnrollList,
          page: that.data.page + 1,
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },
  //投票按钮绑定事件
  tiVoteBind: function (res) {
    var eid = res.currentTarget.dataset.eid;
    var openid = app.globalData.userOpenid;
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
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {

  }
})