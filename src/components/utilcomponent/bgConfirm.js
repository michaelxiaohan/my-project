/*
@params {string} title 提示的标题
@params {string} url 请求路径
@params {string} params 请求参数
@params {function} callback 回调函数
@params {object} callback 参数
*/
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import axios from 'axios'
export function confirmFun(opt){
  let title=opt.title,
      url=opt.url,
      params=opt.params,
      callback=opt.callback,
      callbackParams=opt.callbackParams||null;
  MessageBox.confirm(title, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post(url,{
      id:params
    }).then((res)=>{
        Message.success({
          type: 'success',
          message: '删除成功!'
        });
        callback(callbackParams)
    })
  })
}
