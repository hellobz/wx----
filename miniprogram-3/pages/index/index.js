//index.js
//获取应用实例
const app = getApp()
//引入用来发送请求的方法 一定要把路径补全
import {
  request
} from "../../request/index.js"

//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //分类菜单
    menu: [],
    //楼层
    floorList: [],
    indicatorDots: true,
    interval: 1500,
    duration: 500,
    circular: true
  },
  //页面开始加载 就会触发
  onLoad(options) {
    //不是嵌套在函数作用域不要定义that
    // let that = this;
    //1.发送异步请求获取轮播图数据
    /**
     * url 请求哪个地方的数据
     * data 你要发送什么数据
     * header 请求头不用加 有默认的
     * method 请求方式 默认get 可删除
     * dataType 你想要的返回值类型 json 因为有默认值啦 可删除
     * responseType 返回数据类型 文本类型 可删除
     * success 成功之后的回调函数 fail失败之后的回调函数 complete成功或者失败都会调用的回调函数
     * 
     *  data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',

       dataType: 'json',
      responseType: 'text',

      ,
      fail: () => {},
      complete: () => {}
     */
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',

    // })
    this.getSwiperList();
    this.getMenu();
    this.getFloor();
  },

  //获取轮播图数据
  getSwiperList() {


    request({
        url: '/home/swiperdata'
      })
      .then(result => {
        result.forEach(v=>{
          v.navigator_url = v.navigator_url.replace(/\/goods_detail\/main/,"/goos_detail/goos_detail");
        })
        this.setData({
          swiperList: result
        })
      })
      .catch(err => {
        console.log(err)
      });
  },
  //获取分类菜单数据
  getMenu() {

    request({
        url: '/home/catitems'
      })
      .then(result => {
        this.setData({
          menu: result
        })
      })
      .catch(err => {
        console.log(err)
      });
  },
  //获取楼层数据
  getFloor() {

    request({
        url: '/home/floordata'
      })
      .then(result => {
        result.forEach(v=>{
          v.product_list.forEach(z=>{
            z.navigator_url = z.navigator_url.replace(/\/goods_list/,"/goods_list/goods_list");
          })
        })
        this.setData({
          floorList: result
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

})