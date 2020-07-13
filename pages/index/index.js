// pages/index.js
import indexData from '../../const/const'
Page({
  /**
   * 页面的初始数据
   */
  data: indexData,
  gotoPush() {
    wx.navigateTo({
      url: `../chat/chat?channelId=${this.data.channelId}&appId=${this.data.appId}&accountId=${this.data.accountId}&token=${this.data.token}`
    })
  },

  getinput(e) {
    this.data[e.currentTarget.id] = e.detail.value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
