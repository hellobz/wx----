import {
  request
} from "../../request/index.js"

//导入es7的async转换 
import regeneratorRuntime from '../../lib/runtime/runtime'
const app = getApp();
// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Cateforical: [],
    //左侧菜单数据
    leftMenuList: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧商品数据
    rightContent: [],
    //竖向滚动条位置
    currentTop: 0,
  },

  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 0 web中的本地存储 和小程序中的本地存储的区别
     *    1 写代码的方式不一样了
     *      web: localStorage.setItem("key","value") localStorage.getItem("key")
     *      小程序中: 存 wx.setStorageSync("key","value")  
     *                获取 wx.getStorageSync("key")
     *   2.存的时候 有没有类型转换
     *          web不管存入的是什么类型的数据 最终都会先调用以下 toString(),把数据变成了字符串 再存进去
     *          小程序中:不存在 类型转换的这个操作 存什么类型的数据 获取的时候就是什么类型
     * 
     * 1 先判断一下本地存储中有没有旧的数据
     * {time:Date.now(),data:[...]}
     * 2 没有旧数据 直接发送请求
     * 3 有旧数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */

    // 1获取本地存储中的数据 (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync('cates')
    //2.判断
    if (!Cates) {
      //不存在 发送请求获取数据
      this.getCategorical();
    } else {
      //有旧的数据 自定义过期时间 10s 验证完毕为5分钟
      if (Date.now() - Cates.time > 1000 * 40) {
        //超过之后重新发起请求
        this.getCategorical();
      } else {
        //可以使用旧的数据
        this.Cates = Cates.data;
        let tempLeftCate = this.Cates.map(v => v.cat_name);
        let tempRightCate = this.Cates[0].children
        this.setData({
          leftMenuList: tempLeftCate,
          rightContent: tempRightCate
        })
      }
    }

  },


  //获取分类数据
  async getCategorical() {

    const res = await request({
      url: '/categories'
    }, )

    this.Cates = res

    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    });

    //构造左侧的大菜单数据
    let tempLeftCate = this.Cates.map(v => v.cat_name);
    let tempRightCate = this.Cates[0].children
    this.setData({
      leftMenuList: tempLeftCate,
      rightContent: tempRightCate
    })
    // request({
    //     url: '/categories'
    //   })
    //   .then(result => {
    //     this.Cates = result.data.message

    //     //把接口的数据存入到本地存储中
    //     wx.setStorageSync('cates', {
    //       time: Date.now(),
    //       data: this.Cates
    //     });

    //     //构造左侧的大菜单数据
    //     let tempLeftCate = this.Cates.map(v => v.cat_name);
    //     let tempRightCate = this.Cates[0].children
    //     this.setData({
    //       leftMenuList: tempLeftCate,
    //       rightContent: tempRightCate
    //     })
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  },

  //左侧菜单点击对应变化 事件源e
  handleChange(e) {
    /**
     * 1.获取被点击的标题身上的索引
     * 2.给data中的currentIndex赋值就可以了
     * 3.根据不同的索引来渲染右侧的商品内容
     */
    //点击的时候让scrollTop归0
    this.setData({
      currentTop: 0
    })

    //打印事件源
    console.log(e);

    //点击的时候对应的右侧内容发生变化
    const {
      index
    } = e.currentTarget.dataset
    //构造右侧的商品数据
    let tempRightCate = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent: tempRightCate
    })
  },
})