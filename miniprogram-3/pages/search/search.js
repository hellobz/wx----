import { request } from "../../request/index.js";
//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime'

// pages/search/search.js
/**
 * 1输入框绑定 值改变事件 input事件
 *  1获取到输入框的值
 *  2合法性判断 空字符过滤掉
 *  3检验通过 把输入框的值 发送到后台
 *  4返回的数据打印到页面上
 * 
 * 2防抖 (防止抖动) 定时器来实现
 *    0防抖一般用于输入框中的 防止重复输入 重复发送请求
 *    1节流 一般是用在页面下拉和上拉
 *    1定义全局的定时器id
 */

  // ifCancel当标签频繁展示隐藏用上它是最好的了

Page({

  /**
   * 页面的初始数据
   * 将inpVal输入框的值绑定到标签上 value
   */
  data: {
    goods:[],
    //取消 按钮 是否显示
    ifCancel:true,
    //输入框的值
    inpVal:''
  },
  TimeId:-1,

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

  //输入框的值改变 就会触发的事件
  handleInput(e){
    // 按华为h时候立马触发这些代码 按下u又重新开始 把上一个清除掉定时器 又开起下一个u的定时器了 没有第三次输入的话它就一秒钟发送请求
    // console.log(e);
    //1获取输入框的值
    const {value} = e.detail;
    //2检测合法性 trim是看它是不是空字符串
    if(!value.trim()){
      //值不合法
      this.setData({
        ifCancel:true,
        goods:[]
      });  
      return;
    };
    //通过了再让按钮显示出来
    this.setData({
        ifCancel:false
    });
    //3准备发送请求获取数据
    //防抖
    //清除定时器
    // 通过判断了做清除定时器 一开始没开起定时器 清除就清除
    clearTimeout(this.TimeId);
    // 立马开起定时器 一秒钟之后执行
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },1000);
   
  },

  //发送请求获取搜索建议数据
  async qsearch(query){
    const goods = await request({url:"/goods/qsearch",data:{query}});
    this.setData({
        goods
    })
  },

  //点击取消
  handleReset(){
      this.setData({
        goods:[],
        ifCancel:true,
        inpVal:""
      })
  }

})