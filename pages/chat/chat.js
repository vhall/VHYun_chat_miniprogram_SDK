// pages/chat/chat.js
const app = getApp()
import { VhallChat } from '../sdk/vhall-mpsdk-chat-1.0.0.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    appId: '',
    accountId: '',
    channelId: '',
    token: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (var key in options) {
      if (this.data.hasOwnProperty(key)) {
        var _d = {};
        _d[key] = options[key];
        this.setData(_d);
      }
    }
    let users = new Set()
    let opt = {
      appId: this.data.appId, 
      channelId: this.data.channelId, 
      accountId: this.data.accountId, 
      token: this.data.token
    };
    VhallChat.createInstance(opt, (res) => {
      this.chat = res.message;
      // 监听聊天消息
      this.chat.onChat((res) => {
        if (res.type === VhallChat.TYPE_TEXT) {
          var list = []
          list = this.data.newslist
          list.push({ content: res.text_content, type: res.type, nickName: res.user_id})
          this.setData({
            newslist: list
          })
          this.bottom()
        }
      });
      // 获取在线人数列表，第一页，每页1000.仅做为演示参考
      this.chat.getUserListInfo({ currPage: 1, pageSize: 1000 }, (s) => {
        console.log(s)
        s.data.list.forEach((user) => {
          users.add(user);
        })
        this.setData({
          online_number: users.size
        })
        // 监听上线消息
        this.chat.onJoin((res) => {
          console.log(res)
          users.add(res.user_id);
          this.setData({
            online_number: users.size
          })
          wx.showToast({
            title: `用户 ${res.user_id} 已上线`,
            icon: "none",
            duration: 2000
          })
        });
        // 监听下线消息
        this.chat.onLeave((res) => {
          console.log(res)
          users.delete(res.user_id);
          this.setData({
            online_number: users.size
          })
          wx.showToast({
            title: `用户 ${res.user_id} 已下线`,
            icon: "none",
            duration: 2000
          })
        });
      }, (e) => {
        wx.showToast({
          title: `获取在线人数列表失败: ${e.msg}, ${e.code}`,
          icon: "none",
          duration: 2000
        })
      });
    }, e => {
      // 实例化失败
      console.log(e);
      wx.showToast({
        title: `实例化失败`,
        icon: "none",
        duration: 2000
      })
    });
  },
  // 页面卸载
  onUnload() {
    if (this.chat) {
      this.chat.destroyInstance();
      this.chat = null;
    }
    wx.showToast({
      title: '连接已断开~',
      icon: "none",
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.chat) {
      this.chat.destroyInstance();
      this.chat = null;
    }
    wx.showToast({
      title: '连接已断开~',
      icon: "none",
      duration: 2000
    })
    wx.navigateBack({});
  },
  //事件处理函数
  send: function () {
    var flag = this
    if (this.data.content.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      if (!this.chat) {
        return;
      }
      let msgBody = {
        data: this.data.content,
      }
      // 发送聊天消息
      this.chat.emitChat(msgBody, (res) => {
        this.cleanInput();
      }, (e) => {
        // 发送聊天消息失败
        console.log(e);
        wx.showToast({
          title: `${e.msg}: ${e.code}`,
          icon: "none",
          duration: 2000
        })
      });
    }
  },
  //监听input值的改变
  bindChange(res) {
    this.setData({
      content: res.detail.value
    })
  },
  // 清空输入框消息
  cleanInput: function() {
    this.setData({
      content: ""
    })
  },
  //聊天消息始终显示最底端
  bottom: function () {
    this.setData({
      scrollTop: this.data.newslist.length * 1000
    })
  },
})
