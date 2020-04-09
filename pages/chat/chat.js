import VhallChat from '../../minisdk/vhall-mpsdk-chat-1.0.2'
// import VhallChat from '../../sdk/main'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    accountId: '',
    content: ''
  },
  vhallChat: null,
  chat: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let users = new Set()
    let opt = {
      appId: options.appId,
      channelId: options.channelId,
      accountId: options.accountId,
      token: options.token
    }
    this.setData({ accountId: options.accountId })
    this.vhallChat = new VhallChat()
    this.vhallChat.createInstance(
      opt,
      res => {
        this.chat = res.message
        // 监听聊天消息
        this.chat.onChat(res => {
          console.log(res)
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
        // 获取在线人数列表，第一页，每页1000.仅做为演示参考
        this.chat.getOnlineInfo(
          { currPage: 1, pageSize: 1000 },
          s => {
            s.data.list.forEach(user => {
              users.add(user)
            })
            this.setData({
              online_number: users.size
            })
            // 监听上线消息
            this.chat.onJoin(res => {
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
            this.chat.onLeave(res => {
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
          },
          e => {
            wx.showToast({
              title: `获取在线人数列表失败: ${e.msg}, ${e.code}`,
              icon: 'none',
              duration: 2000
            })
          }
        )

        this.chat.onClose(res => {
          console.log('onClose', res)
        })

        this.chat.onTaskError(res => {
          console.log('onTaskError', res)
          // wx.showToast({ title: 'socket onError触发', icon: 'none' })
        })
        this.chat.connectFail(res => {
          wx.showToast({ title: 'socket连接失败', icon: 'none' })
        })
        this.chat.reConnecting(() => {
          wx.showToast({ title: 'socket正在重连', icon: 'none' })
        })

        this.chat.reConnected(res => {
          wx.showToast({ title: 'socket重连成功', icon: 'none' })
        })
        this.chat.reConnectFail(res => {
          wx.showToast({ title: 'socket重连失败', icon: 'none' })
        })
        this.chat.onCustom(res => {
          console.log(res)
        })
      },
      e => {
        // 实例化失败
        console.log(e)
        wx.showToast({
          title: `实例化失败`,
          icon: 'none',
          duration: 2000
        })
      }
    )
  },
  // 页面卸载
  onUnload() {
    try {
      this.chat.destroyInstance()
    } catch (error) {
      console.warn(error)
    }
    this.chat = null
    this.vhallChat = null
    wx.showToast({
      title: '连接已断开~',
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    try {
      this.chat.destroyInstance()
    } catch (error) {
      console.warn(error)
    }
    this.chat = null
    this.vhallChat = null
    wx.showToast({
      title: '连接已断开~',
      icon: 'none'
    })
  },
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
      this.chat.emitChat(
        msgBody,
        () => {
          this.cleanInput()
        },
        e => {
          // 发送聊天消息失败
          console.log(e)
          wx.showToast({
            title: `${e.msg}: ${e.code}`,
            icon: 'none',
            duration: 2000
          })
        }
      )
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
  }
})
