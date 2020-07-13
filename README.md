## 微吼云聊天小程序 sdk

更新了监听聊天消息的使用方式，抽离了base

### 目录结构

- index 为入口文件夹

- chat 为聊天页面

- minisdk 为 SDK 文件

- 其余为微信小程序必要文件

### 消息类型

| 名称                            | 含义                              |
| ------------------------------- | --------------------------------- |
| this.vhallChat.TYPE_TEXT        | 文本消息                          |
| this.vhallChat.TYPE_DISABLE_ALL | 全员禁言                          |
| this.vhallChat.TYPE_DISABLE     | 某个用户被禁言                    |
| this.vhallChat.TYPE_PERMIT_ALL  | 取消全员禁言                      |
| this.vhallChat.TYPE_PERMIT      | 某个用户被取消禁言                |
| this.vhallChat.EVENT_CHAT       | 聊天消息                          |
| this.vhallChat.EVENT_CLOSE      | 微信socket onClose消息            |
| this.vhallChat.EVENT_ERROR      | 微信socket onError消息            |
| this.vhallChat.CONNECTFAIL      | 微信socket connectSocket fail消息 |
| this.vhallChat.RECONNECTING     | 微信socket 正在重联时触发         |
| this.vhallChat.RECONNECTED      | 微信socket 重联成功触发           |
| this.vhallChat.RECONNECTFAIL    | 微信socket 重联失败触发           |
| this.vhallChat.EVENT_CUSTOM     | 自定义消息                        |
| this.vhallChat.EVENT_JOIN       | 用户加入房间消息                  |
| this.vhallChat.EVENT_LEAVE      | 用户离开房间消息                  |



### 使用方法

```javascript
import VhallBase from '../../minisdk/vhall-mpsdk-base-1.0.0'
import VhallChat from '../../minisdk/vhall-mpsdk-chat-1.1.0'
// 先实例化对象
const vhallBase = new VhallBase()
this.vhallChat = new VhallChat()
/**
 * 先调用实例化vhallBase sdk方法，待其实例化成功后
 * 再调用实例化vhallChat SDK方法，之后所有的方法均应该在createInstance的成功函数后执行
 * createInstance 方法返回promise，推荐使用promise方式，不要使用原来的回调地狱式写法
 * @param {Object} opt- 包括 appId、channelId、accountId、token、vhallBase
 * @param {function} 成功函数
 * @param {function} 失败函数
 * 推荐：
 */
try {
  await vhallBase.createInstance(opt)
  const { message } = await this.vhallChat.createInstance({ ...opt, vhallBase })
  this.chat = message
  this.addEventListener(users)
} catch (error) {
  console.log(error)
  wx.showToast({
    title: `实例化失败`,
    icon: 'none',
    duration: 2000
  })
}
/**
 * 旧写法，计划在之后的版本中删除：
*/
this.vhallChat.createInstance(
  opt,
  res => {
    // 成功函数
    this.chat = res.message
  },
  e => {
    // 实例化失败
    console.log(e)
  }
)

/**
 *  监听聊天消息
 * message消息体：
 * {
 * type: this.vhallChat.TYPE_TEXT, // 聊天消息类型，目前有文本类型、全部禁言、取消全部禁言、取消禁言、取消全部禁言
 * text_content: "", // 文本消息体 - （废弃）请用data，和js-sdk保持一致
 * data：'', // 同 text_content
 * user_id："", // 发送本消息的用户ID
 * context: {  // 自定义消息体
 *  nick_name: "", // 昵称信息
 *  avatar: "", // 头像信息
 * },
 * msgId：消息id
 * date_time: "2019-07-25 18:44:06", // 消息发送时间
 * }
 *
 */
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_CHAT, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onChat(message => {})
/**
 * 监听自定义消息
 * message消息体：
 * {
 * text_content: "", // 文本消息体 - （废弃）请用data，和普通聊天消息保持一致
 * data：'', // 同 text_content
 * user_id："", // 发送本消息的用户ID
 * context: {  // 自定义消息体
 *  nick_name: "", // 昵称信息
 *  avatar: "", // 头像信息
 * },
 * msgId：消息id
 * date_time: "2019-07-25 18:44:06", // 消息发送时间
 * }
 **/
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_CUSTOM, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onCustom(message => {})
/**
* 获取在线人数列表，第一页，每页1000.仅做为演示参考
* @param {Object} currPage - 当前页
* @param {Object} pageSize - 每页个数
* @param {function} callback 回调函数
* @returns {Object} s
* eg:{
	"code": 200,
	"msg": null,
	"data": {
		"list": ["chat6900", "chat9963", "miniProgram_5266", "10000120"], // 频道在线用户列表
		"disable_users": ["chat7790", "chat3556", "chat2347", "chat4773", "chat5807"], // 频道被禁言用户列表
		"channel_disable": false, // 频道是否被禁言
		"total": 4, // 频道在线用户总数
		"page_num": 1, // 页码
		"page_all": 1 // 总页数
	}
 }
*
*/
/**
 * 推荐写法：
 */
this.chat.getOnlineInfo({ currPage: 1, pageSize: 1000 }).then(s=>{}).catch(e=>{})
/**
 * 旧写法（不推荐）：
 */
this.chat.getOnlineInfo(
  { currPage: 1, pageSize: 1000 },
  s => {
    // 成功函数
  },
  e => {
    // 失败函数
  }
)
/**
 * 监听上线消息
 * @param {function} callback 回调函数
 * res: {
 * user_id："", // 用户ID
 * date_time: "2019-07-25 18:44:06", // 上线时间
 * }
 */
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_JOIN, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onJoin(res => {})
/**
 * 监听下线消息
 * @param {function} callback 回调函数
 * res: {
 * user_id："", // 用户ID
 * date_time: "2019-07-25 18:44:06", // 上线时间
 * }
 */
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_LEAVE, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onLeave(res => {})

/**
 * 小程序SocketTask onClose事件和参数
 * 数据格式：{ code:socket通用状态码，1000表示正常关闭，reason：链接被关闭的原因 }
 * 已知异常状态码及含义：
 * res.code == 1000 && res.reason == "normal closure" - 小程序主动关闭
 * res.code == 1000 && res.reason == "interrupted" - 小程序切换到后台，被微信杀掉，需要重连连接
 * res.code == 1001 && res.reason == "Stream end encountered" - 服务端拒绝连接
 * res.code == 1006 && res.reason == "abnormal closure" - 服务关闭（部分安卓返回1005）
 * */
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_CLOSE, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onClose(res => {
  console.log('onClose', res)
})
/**
 * 小程序SocketTask onError事件和参数
 * 数据格式：{errMsg:错误信息}
 * */
/**
 * 推荐写法：
 */
this.chat.on(this.vhallChat.EVENT_ERROR, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.onTaskError(res => {
  console.log('onTaskError', res)
})
/**
 * wx.connectSocket fail
 * 推荐写法：
 * */
this.chat.on(this.vhallChat.CONNECTFAIL, res => {})
/**
 * 旧写法（不推荐）：
 */
this.chat.connectFail(res => {
  console.log('connectFail', res)
})
/**
 * 发送聊天消息
 * @param {object} params {data:"" // 聊天消息，字符串格式。必填, context:{} // 自定义消息，JSON格式。选填,inspection:true （Boolean） 选填，是否开启消息审查，默认开启}
 * @param {function} success 成功回调
 * @param {function} failure 失败回调
 * err 消息格式： { code: 错误码, message: "", data: {} }
 */
/**
 * 推荐写法：
 */
this.chat.emitChat(params).then().catch()
/**
 * 旧写法（不推荐）：
 */
this.chat.emitChat(params, (success = () => {}), (failure = err => {}))
/**
 * 发送自定义消息
 * @param {Object} data - 消息体
 */
this.chat.emitCustom(data).then().catch()

/**
 * 设置禁言操作
 * @param {object} opt - {type:'',target_id:''}
 * type 取值：
 * this.vhallChat.TYPE_DISABLE 禁言频道内某个用户的聊天（频道内单个用户的禁言）
 * this.vhallChat.TYPE_DISABLE_ALL 禁言整个频道的聊天（全员禁言）
 * this.vhallChat.TYPE_PERMIT 取消禁言频道内某个用户的聊天（取消频道内单个用户的禁言）
 * this.vhallChat.TYPE_PERMIT_ALL 取消禁言整个频道的聊天 （取消全员禁言）
 * target_id: 即accountId，针对单个用户时必传
 * @param {function} success 成功回调
 * @param {function} failure 失败回调
 */
/**
 * 推荐写法：
 */
this.chat.setDisable(opt).then().catch()
/**
 * 旧写法（不推荐）：
 */
this.chat.setDisable(opt, (success = () => {}), (failure = () => {}))
/**
* 获取历史聊天消息
* @param {object} opt :{currPage,pageSize,startTime,endTime}
* currPage: 当前页
* pageSize: 每页条数
* startTime: 开始时间(格式2020/01/01)
* endTime: 结束时间(格式2020/01/01)
* @param {function} success 成功回调
* @param {function} failure 失败回调
* @returns {Object}
* eg:{
	"code": 200,
	"msg": null,
	"data": {
	"list": [{
		"type": "text", // 消息类型
		"data": "2", // 消息内容
		"date_time": "2019-12-02 19:20:05", // 发送时间
		"third_party_user_id": "miniProgram_1463", // 发送方accountId
		"msg_id": "msg_1783ebeaaa339b0fd6d51dccb37cf5e0", // 消息id
		"context": { // 用户自定义消息体
			"nick_name": "vhall",
			"avatar": ""
		},
		"nick_name": "vhall", // 昵称
		"avatar": "" // 头像
	}],
	"total": 4, // 消息总数
	"page_num": "1", // 当前页数
	"page_all": 2 // 总页数
  }
 }
*/
/**
 * 推荐写法：
 */
this.chat.getHistoryList((opt).then().catch()
/**
 * 旧写法（不推荐）：
 */
this.chat.getHistoryList((opt = {}), (success = () => {}), (failure = () => {}))

/**
 * 销毁实例
 */
this.chat.destroyInstance()
```
