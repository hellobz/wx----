/**
 * 1 页面被打开的时候 这里用onShow 因为订单是要被频繁的被打开的
 *    0 onShow 不同于onLoad 无法在形参上接收 options参数
 *    0.5判断缓存中有没有token
 *      1没有 直接跳转到授权页面
 *      2 有   直接往下进行
 * 
 *    1获取url上的参数type
 *    2 根据type来决定页面标题的数组元素 哪个被激活选中
 *    2根据type 去发送请求获取订单数据
 *    3渲染页面
 * 
 * 2点击不同标题 重新发送请求来获取和渲染数据
 */

// pages/order/order.js

//引入简化代码文件 要把名称补充完整 多个引入用对象
import {request} from "../../request/index.js"
//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      name: '全部',
      isActive: true
    },
    {
      id: 1,
      name: '待付款',
      isActive: false
    },
    {
      id: 2,
      name: '代发货',
      isActive: false
    },
    {
      id: 3,
      name: '退款/退货',
      isActive: false
    }
  ],    
  orders:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const {type} =  options;
      this.typeList = type;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      const token = wx.getStorageSync('token');
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }

    //1.获取当前的小程序的页面栈-数组 长度最大是10页面
    //2 数组中 索引最大的页面就是当前页面
      let pages = getCurrentPages();
      console.log(pages);
      let currentPage = pages[pages.length-1];
      // console.log(currentPage.options);
      //3 获取url上的type参数
      const {type} = currentPage.options;
      this.getOrders(type);
      //4.激活选中页面标题 当type=1 index=0
      this.changeForIndex(type-1);
  },

    //头部点击
    //4.根据标题索引来激活选中 标题数组
    changeForIndex(index){
      //2.修改原数组
      let {
        tabs
      } = this.data;
      tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
      //3.赋值到data中
      this.setData({
        tabs
      })
  },

    handleTabsItemChange(e) {
      // console.log(e);
      //1.获取被点击的标题索引

      const {
        index
      } = e.detail;

      this.changeForIndex(index);
      //2重新发起请求 
      this.getOrders(index+1);
    },

    //获取订单列表的方法
    async getOrders(type){
      
      const res = await request({url:"/my/orders/all",data:{type}});
      const {orders} = res;
      this.setData({
        orders:orders.map(v=>({...v,create_time_ch:new Date(v.create_time*1000).toLocaleString()}))
      });
    },
  
})