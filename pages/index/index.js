// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channelId: "ch_1a348b67",//需要将此处inavId改为自己的
    appId: "d317f559", //需要将此处appId改为自己的
    accountId: `miniProgram_${Math.floor(1000 + Math.random() * 9000)}`,//需要将此处accountId改为自己的
    token: "access:d317f559:75107dced08acdb1" //需要将此处token改为自己的
  },

  gotoPush: function () {
    wx.navigateTo({
      url: `../chat/chat?channelId=${this.data.channelId}&appId=${this.data.appId}&accountId=${this.data.accountId}&token=${this.data.token}`,
    })
  },

  getinput: function (e) {
    this.data[e.currentTarget.id] = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})