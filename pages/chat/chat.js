// import VhallBase from '../../mpSdkBaseCopy/main'
// import VhallChat from '../../sdk/main'
import VhallBase from '../../minisdk/vhall-mpsdk-base-1.0.0'
import VhallChat from '../../minisdk/vhall-mpsdk-chat-1.1.0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    accountId: '',
    content: ''
  },
  vhallBase: null,
  vhallChat: null,
  chat: null,
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let users = new Set()
    let opt = {
      appId: options.appId,
      channelId: options.channelId,
      accountId: options.accountId,
      token: options.token
    }
    this.setData({ accountId: options.accountId })
    this.vhallBase = new VhallBase()
    this.vhallChat = new VhallChat()
    try {
      await this.vhallBase.createInstance(opt)
      const { message } = await this.vhallChat.createInstance({ ...opt, vhallBase: this.vhallBase })
      this.chat = message
      this.addEventListener(users)
      this.onNetworkStatusChange()
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: `实例化失败`,
        icon: 'none',
        duration: 2000
      })
    }
  },
  addEventListener(users) {
    this.getOnlineInfo(users)
    // 监听聊天消息
    this.chat.on(this.vhallChat.EVENT_CHAT, res => {
      switch (res.type) {
        case this.vhallChat.TYPE_TEXT:
          {
            let list = []
            list = this.data.newslist
            list.push({ content: res.text_content, type: res.type, nickName: res.user_id })
            this.setData({
              newslist: list
            })
            this.bottom()
          }
          break
        case this.vhallChat.TYPE_DISABLE_ALL:
          wx.showToast({ title: '全员禁言', icon: 'none' })
          break
        case this.vhallChat.TYPE_DISABLE:
          if (res.user_id == this.data.accountId) {
            wx.showToast({ title: '当前用户被禁言', icon: 'none' })
          }
          break
        case this.vhallChat.TYPE_PERMIT_ALL:
          wx.showToast({ title: '取消全员禁言', icon: 'none' })
          break
        case this.vhallChat.TYPE_PERMIT:
          if (res.user_id == this.data.accountId) {
            wx.showToast({ title: '当前用户取消禁言', icon: 'none' })
          }
          break
        default:
          break
      }
    })
    this.chat.on(this.vhallChat.EVENT_CLOSE, res => {
      console.log('onClose 触发', res)
    })

    this.chat.on(this.vhallChat.EVENT_ERROR, res => {
      console.log('onTaskError 触发', res)
    })
    this.chat.on(this.vhallChat.CONNECTFAIL, res => {
      console.log('socket连接失败', res)
      wx.showToast({ title: 'socket连接失败', icon: 'none' })
    })
    this.chat.on(this.vhallChat.RECONNECTING, () => {
      console.log('socket正在重连')
      wx.showToast({ title: 'socket正在重连', icon: 'none' })
    })

    this.chat.on(this.vhallChat.RECONNECTED, res => {
      console.log('socket重连成功')
      wx.showToast({ title: 'socket重连成功', icon: 'none' })
    })

    this.chat.on(this.vhallChat.RECONNECTFAIL, res => {
      console.log('socket重连失败')
      wx.showToast({ title: 'socket重连失败', icon: 'none' })
    })
    this.chat.on(this.vhallChat.EVENT_CUSTOM, res => {
      console.log(res)
    })
  },
  /**
   * 获取在线人数列表，第一页，每页1000.仅做为演示参考
   */
  getOnlineInfo(users) {
    this.chat
      .getOnlineInfo({ currPage: 1, pageSize: 1000 })
      .then(s => {
        s.data.list.forEach(user => {
          users.add(user)
        })
        this.setData({
          online_number: users.size
        })
        // 监听上线消息
        this.chat.on(this.vhallChat.EVENT_JOIN, res => {
          console.log('chat', res)
          users.add(res.user_id)
          this.setData({
            online_number: users.size
          })
          wx.showToast({
            title: `用户 ${res.user_id} 已上线`,
            icon: 'none',
            duration: 2000
          })
        })
        // 监听下线消息
        this.chat.on(this.vhallChat.EVENT_LEAVE, res => {
          users.delete(res.user_id)
          this.setData({
            online_number: users.size
          })
          wx.showToast({
            title: `用户 ${res.user_id} 已下线`,
            icon: 'none',
            duration: 2000
          })
        })
      })
      .catch(e => {
        wx.showToast({
          title: `获取在线人数列表失败: ${e.msg}, ${e.code}`,
          icon: 'none',
          duration: 2000
        })
      })
  },
  // 页面卸载
  onUnload() {
    try {
      this.vhallChat.destroy()
      wx.offNetworkStatusChange()
    } catch (error) {
      console.warn(error)
    }
    this.chat = null
    this.vhallChat = null
    this.vhallBase = null
    wx.showToast({
      title: '连接已断开~',
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},
  //事件处理函数
  send() {
    if (!this.data.content || this.data.content.trim() == '') {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (!this.chat) {
        return
      }
      let msgBody = {
        data: this.data.content,
        context: { nick_name: 'vhall' }
      }
      // 发送聊天消息
      this.chat
        .emitChat(msgBody)
        .then(() => {
          this.cleanInput()
        })
        .catch(e => {
          // 发送聊天消息失败
          console.log(e)
          wx.showToast({
            title: `${e.msg}: ${e.code}`,
            icon: 'none',
            duration: 2000
          })
        })
    }
  },
  //监听input值的改变
  bindChange(res) {
    this.setData({
      content: res.detail.value
    })
  },
  // 清空输入框消息
  cleanInput() {
    this.setData({
      content: ''
    })
  },
  //聊天消息始终显示最底端
  bottom() {
    this.setData({
      scrollTop: this.data.newslist.length * 1000
    })
  },
  stopAll() {
    this.chat.setDisable({ type: this.vhallChat.TYPE_DISABLE_ALL })
  },
  cancleAll() {
    this.chat.setDisable({ type: this.vhallChat.TYPE_PERMIT_ALL })
  },
  stopCurrentUser() {
    this.chat.setDisable({ type: this.vhallChat.TYPE_DISABLE, target_id: this.data.accountId })
  },
  cancleCurrentUser() {
    this.chat.setDisable({ type: this.vhallChat.TYPE_PERMIT, target_id: this.data.accountId })
  },
  onNetworkStatusChange() {
    wx.onNetworkStatusChange(({ isConnected, networkType }) => {
      console.log('监测到网络变化：', isConnected, networkType)
      if (isConnected) {
        // if (this.networkType == 'wifi' && networkType != 'wifi') {
        // 从 wifi 切到 4g socket会 断开 触发 1006，因部分服务端断开的情况也触发该状态码，sdk无法分辨进行自动重联，故需要手动重联
        setTimeout(() => {
          // 延迟1s是为了避免在开发者工具上报错
          this.reconnectSocket()
        }, 1000)

        // }
      }
      this.networkType = networkType
    })
  },
  async reconnectSocket() {
    // this.vhallBase
    //   .initiativeReconnect()
    //   .then(() => {
    //     console.log('vhallBase then 触发')
    //     this.vhallChat.initiativeReconnect()
    //   })
    //   .catch(() => {
    //     console.log('vhallBase catch 触发')
    //   })
    try {
      await this.vhallBase.initiativeReconnect()
      await this.vhallChat.initiativeReconnect()
    } catch (error) {
      console.log(error)
    }
  }
})
