## 微吼云聊天小程序 sdk

当前版本对原有的 sdk 进行了精简并增加了一些监听函数，之前的方法名称未更改

### 目录结构

- index 为入口文件夹

- chat 为聊天页面

- minisdk 为 SDK 文件

- 其余为微信小程序必要文件

### 消息类型

| 名称                            | 含义               |
| ------------------------------- | ------------------ |
| this.vhallChat.TYPE_TEXT        | 文本消息           |
| this.vhallChat.TYPE_DISABLE_ALL | 全员禁言           |
| this.vhallChat.TYPE_DISABLE     | 某个用户被禁言     |
| this.vhallChat.TYPE_PERMIT_ALL  | 取消全员禁言       |
| this.vhallChat.TYPE_PERMIT      | 某个用户被取消禁言 |

### 使用方法

```javascript
import VhallChat from '../../minisdk/vhall-mpsdk-chat-1.0.2'
// 先实例化对象
this.vhallChat = new VhallChat()
/**
 * 再调用实例化SDK方法，之后所有的方法均应该在createInstance的成功函数后执行
 * @param {Object} opt- 包括 appId、channelId、accountId、token
 * @param {function} 成功函数
 * @param {function} 失败函数
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
 * message: {
 * user_id："", // 用户ID
 * date_time: "2019-07-25 18:44:06", // 上线时间
 * }
 */
this.chat.onJoin(message => {})
/**
 * 监听下线消息
 * @param {function} callback 回调函数
 * message: {
 * user_id："", // 用户ID
 * date_time: "2019-07-25 18:44:06", // 上线时间
 * }
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
this.chat.onClose(res => {
  console.log('onClose', res)
})
/**
 * 小程序SocketTask onError事件和参数
 * 数据格式：{errMsg:错误信息}
 * */
this.chat.onTaskError(res => {
  console.log('onTaskError', res)
})
/**
 * wx.connectSocket fail
 * */
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
this.chat.emitChat(params, (success = () => {}), (failure = err => {}))
/**
 * 发送自定义消息
 * @param {Object} data - 消息体
 */
this.chat.emitCustom(data)

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
this.chat.getHistoryList((opt = {}), (success = () => {}), (failure = () => {}))

/**
 *旧版error事件，不推荐使用
 * e:{
 *     user_id // 用户ID 即accountId
 *    }
 */
this.chat.onError(e => {})

/**
 * 销毁实例
 */
this.chat.destroyInstance()
```
