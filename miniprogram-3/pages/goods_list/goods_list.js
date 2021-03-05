import {
  request
} from "../../request/index.js"

//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime'
// pages/goods_list/goods_list.js
Page({

  data: {
    tabs: [{
        id: 0,
        name: '综合',
        isActive: true
      },
      {
        id: 1,
        name: '销量',
        isActive: false
      },
      {
        id: 2,
        name: '价格',
        isActive: false
      },
    ],     

    commodity: [],
    pricety:[],
    numbty:[]
    
  },

//请求参数
param: {
  query: '',
  cid: '',
  pagenum: 1,
  pagesize: 10
},

//总条数
totalPages:1,   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // console.log(this.data.commodity);  
    this.param.cid = options.cid || "";
    this.param.query = options.query || "";
    this.getListSearch(this.param)
  },

  //上拉触底
  onReachBottom(){
      if(this.param.pagenum>=this.totalPages){
        wx.showToast({
          title: '人家也是有底线的',
          icon:'loading',
          duration:2000
        })
      }else{
        this.param.pagenum++;
        this.getListSearch(this.param);
        //  console.log('有下一页数据')
      }
  },

  //下拉刷新
  onPullDownRefresh(){
      console.log('下拉刷新');
      //01重置数组
      this.setData({
        commodity:[]
      });
      //02重置页码
      this.param.pagenum = 1;
      //03重新发起请求
      this.getListSearch(this.param);    
  },

  //获取商品列表搜索数据
  async getListSearch(n) {
    
    const res = await request({
      url: "/goods/search",
      data: n
    });
    const total = res.total;
    this.totalPages = Math.ceil(total/this.param.pagesize)
    console.log(res);
    function comple(price){
      return function (a,b){
        let value1 = a[price];
        let value2 = b[price];
        return value1 - value2;
      }
    }

    // 价格
    let sort1 = [];
    sort1.push(...res.goods);
    sort1 = sort1.sort(comple('goods_price'));
    // console.log(sort1);

    // 销量
    let sort2 = [];
    sort2.push(...res.goods);
    sort2 = sort2.sort(comple('goods_number'));
    // console.log(sort2);

    this.setData({
      commodity:[...this.data.commodity,...res.goods],
      pricety:[...this.data.pricety,...sort1],
      numbty:[...this.data.numbty,...sort2]

    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
      wx.stopPullDownRefresh()
  },
  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // console.log(e);
    //1.获取被点击的标题索引
    const {
      index
    } = e.detail;
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

})