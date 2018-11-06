// pages/user/enroll.js
var common = require("../../utils/common.js");
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tempFilePaths:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	formSubmit: function(e) {
		var data = {
			openid: app.globalData.userOpenid,
			title: e.detail.value.title,
			img: e.detail.value.img,
			textarea: e.detail.value.textarea
		}
		common.requestFun("home/wx/set_enroll_info", data, "POST", function (result) { 
			wx.showToast({
				title: result.msg,
				icon: 'none',
				duration: 2000
			})
			if(result.status==1)
			{
				 wx.switchTab({
					 url:"../../pages/index/index"
				 })
			}
		})
	},
	chooseImage(e) {
		var that = this
		wx.chooseImage({
			success: function(res) {
				var tempFilePaths = res.tempFilePaths //图片
				wx.uploadFile({
					url: 'https://toupiao.xinsu360.net/home/wx/ajax_upload_wx_images', //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'file', //文件对应的参数名字(key)
					formData: {}, //其它的表单信息
					success: function(result) {
						var newObject = JSON.parse(result.data)
						that.setData({
							tempFilePaths:newObject.data
						})
					}
				})
			}
		})
	}
})
