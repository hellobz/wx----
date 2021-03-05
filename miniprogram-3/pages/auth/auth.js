// pages/auth/auth.js
//引入简化代码文件 要把名称补充完整 多个引入用对象
import {request,request1} from "../../request/index.js"
import {login} from '../../utils/asyncWechat.js';
//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    code:'',
  //获取用户信息
  async handleGetUserInfo(e){
    try{
      // console.log(e);
      //1.获取用户信息
      let {encryptedData,iv,rawData,signature} = e.detail;
      //2.获取登录成功之后code值
      let {code} = await login({timeout:10000});
      // console.log(code);
      let loginParams = {encryptedData,iv,rawData,signature,code};
      //3发送请求获取用户的token值      
      const res = await request1({url:'/tkk',data:loginParams,method:'post'});
      console.log(res);
      //4把token存储到缓存中 同时跳转回上一个页面
      //delta 1返回上一层 2返回上两层
      wx.setStorageSync('token', res.token);
      wx.navigateBack({
          delta:1
      })
    }catch(err){
      console.log(err);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }

})