module.exports=function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);class i{constructor(){this.dispatcher={eventListeners:{}}}on(t,e){void 0===this.dispatcher.eventListeners[t]&&(this.dispatcher.eventListeners[t]=[]),this.dispatcher.eventListeners[t].push(e)}off(t,e){if(!this.dispatcher.eventListeners[t])return;const s=this.dispatcher.eventListeners[t].indexOf(e);-1!==s&&this.dispatcher.eventListeners[t].splice(s,1)}emit(t,e={}){if(!t)throw new Error("Undefined event");const s=this.dispatcher.eventListeners[t]||[];for(let t=0;t<s.length;t+=1)s[t](e)}}class n extends i{constructor(t){super(),this.options=t,this.socketStatus=!1,this.reconnectOut=null,this.reconnectTimes=0,this.customChat=t.customChat||!1,this.pingInterval=25e3,this.pingTimeout=6e4,this.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},this.initSocket=this.initSocket.bind(this),this.bindOpen=this.bindOpen.bind(this),this.bindMessage=this.bindMessage.bind(this),this.bindError=this.bindError.bind(this),this.bindClose=this.bindClose.bind(this),this.incrementNumber=this.incrementNumber.bind(this),this.send=this.send.bind(this),this.close=this.close.bind(this)}initSocket(t=(()=>{}),e=(()=>{})){const s=this;this.socketTask=wx.connectSocket({url:this.options.url,success(e){t(e)},fail(t){s.emit("connectFail",t),e(t),s.stopHeart()}}),this.bindOpen(),this.bindMessage(),this.bindClose(),this.bindError()}bindOpen(){this.socketTask.onOpen(t=>{this.socketStatus=!0,this.emit("onOpen",t),this.reconnectTimes&&(this.emit("reConnected",t),this.reconnectTimes=0,clearTimeout(this.reconnectOut),this.reconnectOut=null),this.customChat&&this.startHeart()})}bindMessage(){this.socketTask.onMessage(t=>{if(!isNaN(Number(t.data)))return;const e=this.foramtMsg(t.data);e.needEmit&&this.emit("onMessage",e.data)})}bindError(){this.socketTask.onError(t=>{this.emit("onError",t)})}bindClose(){this.socketTask.onClose(t=>{this.socketStatus=!1,this.stopHeart(),this.emit("onClose",t),1e3!=t.code&&1001!=t.code&&1006!=t.code&&this.incrementNumber()})}send(t,e=!0){1==this.socketTask.readyState&&(e&&(t.data=`${this.packets.message}${this.packets.ping}["${t.name}",${JSON.stringify(t.data)}]`),this.socketTask.send(t))}close(t){3!=this.socketTask.readyState&&(this.customChat&&this.socketTask.send({data:`${this.packets.message}${this.packets.close}`},!1),this.socketTask.close(t),this.stopHeart())}incrementNumber(){this.reconnectTimes++,this.reconnectTimes<6&&!this.socketStatus?(this.initSocket(),this.emit("reConnecting"),this.reconnectOut=setTimeout(this.incrementNumber,5e3)):(this.emit("reConnectFail"),this.reconnectTimes=0,clearTimeout(this.reconnectOut),this.reconnectOut=null)}foramtMsg(t){let e={needEmit:!0,data:{}};try{e.data=JSON.parse(t),e.data=decodeURIComponent(e.data.text)}catch(s){if(e.needEmit=!1,t.startsWith(`${this.packets.message}${this.packets.ping}`)){let e=t.substring(2);e=JSON.parse(e),this.emit(e[0],e[1]),this.emit("allSocket",{name:e[0],data:e[1]})}if(t.startsWith(`${this.packets.open}`)){let e=t.substring(1);e=JSON.parse(e),this.pingInterval=e.pingInterval,this.pingTimeout=e.pingTimeout}}return e}startHeart(){this.heartInterval||(this.heartInterval=setInterval(()=>{this.send({data:this.packets.ping},!1)},this.pingInterval))}stopHeart(){this.heartInterval&&(clearInterval(this.heartInterval),this.heartInterval=null)}}class o extends class{constructor(){this.info={}}setKV(t,e){this.info[t]=e}getKV(t){return this.info[t]}deleteKey(t){this.info.hasOwnProperty(t)&&delete this.info[t]}reset(){this.info={}}toString(){let t=Object.keys(this.info),e="";return t.forEach(t=>{e+=`${t}:${this.info[t]} `}),e}}{constructor(t){super(),this.roomId=t.roomId||"",this.app_id=t.appId,this.third_party_user_id=t.thirdPartyUserId,this.access_token=t.accessToken,this.channelId=t.channelId,this.package_check="peter",this.client="wechat_applet",this.host="https://api.vhallyun.com/sdk",this.initAPI="/v1/init/start",this.sendAPI="/v2/message/send",this.request=this.request.bind(this),this.pMsg=null,this.sMsg=null,this.events={msg:()=>{},onClose:()=>{},connectFail:()=>{},onTaskError:()=>{},allSocket:()=>{},reConnectFail:()=>{},reConnecting:()=>{}}}request(t,e,s,i){e.client=this.client,e.app_id=this.app_id,e.third_party_user_id=this.third_party_user_id,e.access_token=this.access_token,e.package_check=this.package_check,e.room_id=e.room_id||this.roomId,wx.request({url:`${this.host}${t}`,data:e,method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},success:t=>{t.statusCode>=400?i({code:400,message:"调用接口失败"}):200!==t.data.code?i(t.data):s(t.data)},fail:i})}dispatch(t){let e;try{e="string"==typeof t?JSON.parse(t):t}catch(t){return}try{"function"==typeof this.events[e.event]?this.events[e.event](e):"function"==typeof this.events[e.service_type]?this.events[e.service_type](e):this.events.msg(e)}catch(t){return}}connectSocketIO(){this.sMsg=new n({url:`${this.getKV("socket_server").replace(/http/,"ws")}/socket.io/?token=${this.getKV("connection_token")}&EIO=3&transport=websocket`,customChat:!0}),this.sMsg.initSocket(()=>{},t=>{this.events.connectFail(t)}),this.sMsg.on("onMessage",t=>{this.dispatch(t)}),this.sMsg.on("msg",t=>{this.dispatch(t)}),this.sMsg.on("onOpen",()=>{this.join()}),this.sMsg.on("onClose",t=>{this.events.onClose(t)}),this.sMsg.on("onError",t=>{this.events.error(t),this.events.onTaskError(t)}),this.sMsg.on("reConnecting",()=>{this.events.reConnecting()}),this.sMsg.on("reConnected",()=>{this.events.reConnected()}),this.sMsg.on("reConnectFail",()=>{this.events.reConnectFail()}),this.sMsg.on("allSocket",t=>{this.events.allSocket(t)})}connectPushStream(){this.pMsg=new n({url:`${this.getKV("nginx_server").replace(/http/,"ws")}/ws/${this.channelId}?_=${(new Date).getTime()}&tag=0&time=&eventid=`}),this.pMsg.initSocket(()=>{},t=>{this.events.connectFail(t)}),this.pMsg.on("onOpen",()=>{}),this.pMsg.on("onMessage",t=>{this.dispatch(t)}),this.pMsg.on("onClose",t=>{this.events.onClose(t)}),this.pMsg.on("onError",t=>{this.events.error(t),this.events.onTaskError(t)}),this.pMsg.on("reConnecting",()=>{this.events.reConnecting()}),this.pMsg.on("reConnected",()=>{this.events.reConnected()}),this.pMsg.on("reConnectFail",()=>{this.events.reConnectFail()}),this.pMsg.on("allSocket",t=>{this.events.allSocket(t)})}init(t,e){this.request(this.initAPI,{},s=>{try{for(let t in s.data)this.setKV(t,s.data[t]);t()}catch(t){e(t)}},t=>{e(t)})}connect(t){this.connectPushStream(),this.connectSocketIO(),this.sMsg.on("joined",e=>{t(e)})}disconnect(){try{this.leave(),this.pMsg.close(),this.sMsg.close()}catch(t){console.warn(t)}this.pMsg=null,this.sMsg=null}on(t,e){this.events[t]=e}emit(t,e,s={},i=0,n=(()=>{}),o=(()=>{})){let r={type:t,channel_id:this.channelId,no_audit:i,body:"string"==typeof e?e:JSON.stringify(e),context:JSON.stringify(s)};this.request(this.sendAPI,r,t=>{n(t)},t=>{o(t)})}join(){if(!this.sMsg)return;const t={channel:this.channelId,third_party_user_id:this.third_party_user_id};this.sMsg.send({data:t,name:"join"})}leave(){if(!this.sMsg)return;const t={channel:this.channelId,third_party_user_id:this.third_party_user_id};this.sMsg.send({data:t,name:"leave"})}}const r="EVENT_CHAT",c="EVENT_CUSTOM",a="EVENT_JOIN",h="EVENT_LEAVE",d="EVENT_ERROR",l={TYPE_TEXT:"text",TYPE_DISABLE:"disable",TYPE_DISABLE_ALL:"disable_all",TYPE_PERMIT:"permit",TYPE_PERMIT_ALL:"permit_all"},u="/v2/message/set-channel",p="/v2/message/get-userid-list",m="/v2/message/lists",g={im:()=>{},custom:()=>{},document:()=>{},room:()=>{},Join:()=>{},Leave:()=>{}};class k extends i{constructor(t){super(),this.VhallChat=t.VhallChat,this.socket=t.socket,this.channelId=t.channelId,this.getOnlineInfo=this.getOnlineInfo.bind(this),this.socket.on("service_im",t=>{let e=JSON.parse(t.data),s=e.text_content,i=JSON.parse(t.context);try{void 0!==i.nick_name&&void 0!==i.avatar||void 0===e.nick_name||void 0===e.avatar||(i.nick_name=e.nick_name,i.avatar=e.avatar)}catch(t){}this.emit(r,{type:e.type,text_content:s,user_id:t.sender_id,context:i,date_time:t.date_time})}),this.socket.on("service_custom",t=>{this.emit(c,{text_content:t.data,user_id:t.sender_id,context:JSON.parse(t.context),date_time:t.date_time})}),this.socket.on("service_document",t=>{g.document&&g.document(t)}),this.socket.on("service_room",t=>{g.room&&g.room(t)}),this.socket.on("service_online",t=>{switch(JSON.parse(t.data).type){case"Join":this.emit(a,{user_id:t.sender_id,date_time:t.date_time});break;case"Leave":this.emit(h,{user_id:t.sender_id,date_time:t.date_time})}}),this.socket.on("error",t=>{this.emit(d,{user_id:this.VhallChat.thirdPartyUserId})}),this.socket.on("onClose",t=>{this.emit("onClose",t)}),this.socket.on("onTaskError",t=>{this.emit("onTaskError",t)}),this.socket.on("connectFail",t=>{this.emit("connectFail",t)}),this.socket.on("allSocket",t=>{this.emit("allSocket",t)}),this.socket.on("reConnecting",()=>{this.emit("reConnecting")}),this.socket.on("reConnected",()=>{this.emit("reConnected")}),this.socket.on("reConnectFail",()=>{this.emit("reConnectFail")})}destroyInstance(){this.VhallChat.disconnectMessageService()}onChat(t){this.on(r,t)}onCustom(t){this.on(c,t)}onDocMsg(t){g.document=t}onRoomMsg(t){g.room=t}onJoin(t){this.on(a,t)}onLeave(t){this.on(h,t)}onError(t){this.on(d,t)}connectFail(t){this.on("connectFail",t)}onClose(t){this.on("onClose",t)}onTaskError(t){this.on("onTaskError",t)}reConnecting(t){this.on("reConnecting",t)}reConnected(t){this.on("reConnected",t)}reConnectFail(t){this.on("reConnectFail",t)}allSocket(t){this.on("allSocket",t)}emitChat(t,e,s){const{data:i,context:n={},inspection:o=!0}=t;if(!t.hasOwnProperty("data")||"string"!=typeof i)return void(s&&s({code:"",message:"无效的参数",data:{}}));const r={type:"text",text_content:t.data};this.socket.emit("service_im",r,n,Number(!o)||0,e,s)}emitCustom(t){this.socket.emit("service_custom",t)}emitDocMsg(t){this.socket.emit("service_document",t)}emitRoomMsg(t){let e=JSON.parse(t);!e.hasOwnProperty("type")||"live_start"!==e.type&&"live_over"!==e.type||(e.room=this.channelId),this.socket.emit("service_room",t)}getOnlineInfo({currPage:t=0,pageSize:e=0},s=(()=>{}),i=(()=>{})){const n={channel_id:this.channelId,curr_page:t,page_size:e};this.socket.request(p,n,t=>{s(t)},t=>{i(t)})}getUserListInfo(t,e=(()=>{}),s=(()=>{})){this.getOnlineInfo(t,e,s)}setDisable(t,e=(()=>{}),s=(()=>{})){const i={channel_id:this.channelId,type:t.type,target_id:t.target_id};this.socket.request(u,i,t=>{e(t)},t=>{s(t)})}getHistoryList(t={},e=(()=>{}),s=(()=>{})){const i={channel_id:this.channelId,curr_page:t.currPage,page_size:t.pageSize,filter_status:0,start_time:t.startTime,end_time:t.endTime};this.socket.request(m,i,t=>{e(t)},t=>{s(t)})}}s.d(e,"default",(function(){return _}));class _{constructor(){for(let t in l)this[t]=l[t];this.socket=null}init(t){return this.socket=new o(t),new Promise((t,e)=>{this.socket.init(()=>{t()},t=>{e(t)})})}connectMessageService(){return new Promise((t,e)=>{this.socket.connect(e=>{t(e)},t=>{switch(t){case"应用查询为空":e({code:"611030",message:"appId不存在",data:{}});break;default:e({code:"611000",message:"初始化房间失败",data:{}})}}),setTimeout(()=>{e()},1e4)})}disconnectMessageService(){this.socket&&(this.socket.disconnect(),this.socket=null)}createInstance(t,e,s=(()=>{})){const{appId:i,channelId:n,accountId:o,token:r}=t;if(!(n&&o&&i&&r))return void s({code:"",message:"无效的参数",data:{}});let c={};c.appId=i,c.thirdPartyUserId=o,c.accessToken=r,c.channelId=n,this.init(c).then(()=>this.connectMessageService()).then(t=>{let s={VhallChat:this,socket:this.socket,channelId:n},i={message:new k(s),disable:t.data.disable_users.includes(o),disable_all:Boolean(t.data.channel_disable)};e(i)}).catch(t=>{console.error(t),s(t)})}}}]);