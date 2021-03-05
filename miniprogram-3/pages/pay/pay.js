/**
 * 1 页面加载的时候
 *  从缓存中获取购物车数据 渲染到页面中
 *    这些数据 checked = true
 * 
 * 2. 微信支付
 *    1.哪些人 哪些账号可以实现微信支付
 *    1.企业账号的小程序后台中 必须给开发者 添加上白名单
 *      1.一个appid可以同时绑定多个开发者
 *      2.这些开发者就可以共用这个appid 和它的开发者权限
 * 
 * 3.支付按钮
 *    1.先判断缓存中有没有token
 *    2 没有 跳转到授权页面 进行获取token
 *    3.有token
 *    4.创建订单 获取订单编号
 *    5.已经完成了微信支付
 *    6.手动删除缓存中 已经被选中了的商品
 *    7删除后的购物车数据 填充缓存
 *    8再跳转页面
 */     

//引入简化代码文件 要把名称补充完整 多个引入用对象
import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from '../../utils/asyncWechat.js';
import {request} from "../../request/index.js"
//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:{},
      info:[],
      //总价格
      totalPrice:0,
      //总数量
      totalNum:0
      
  },

      //支付
     async handlePayMent(){
        try{
            //1.判断缓存中有没有token
            const token = wx.getStorageSync('token')
            if(!token){
              wx.navigateTo({
                url: '/pages/auth/auth',            
              });
              return;
            };
            //3.创建订单
            //3.1 准备 请求头参数
              // const header = {Authorization:token};
            //3.2准备 请求体参数
              const order_price = this.data.totalPrice;
              const consignee_addr = this.data.address.all;
              let goods = [];
              const {info} = this.data;
              info.forEach(v=>goods.push({
                goods_id:v.goods_id,
                goods_number:v.num,
                goods_price:v.goods_price
              }));
  
              const orderParams = {order_price,consignee_addr,goods}
              
            //4 准备发送请求 创建订单 获取订单编号
            const {order_number} = await request({url:'/my/orders/create',method:'post',data:orderParams});
            
            //5.发起预支付请求
            const {pay} = await request({url:'/my/orders/req_unifiedorder',method:'post',data:{order_number}});
  
            //6.发起微信支付
           await requestPayment(pay);              
           
           const res = await request({url:'/my/orders/chkOrder',data:{order_number},method:'post'})

           await showToast({title:"支付成功"});

           //7手动删除缓存中 已经支付了的商品
           //为什么前面有info还要从缓存中获取 因为前面info是已经过滤了的 我们要完整的
           let newInfo = wx.getStorageSync('cart');
              //要留下来未被选中的
              newInfo = newInfo.filter(v=>!v.ifCheck);
              wx.setStorageSync('cart', newInfo);

           //7成功之后跳转到订单页面
           wx.navigateTo({
             url: '/pages/order/order',
           })
        }catch(err){
          await showToast({title:"支付失败"});
            console.log(err);
        }
      },

      //由于·购物车需频繁打开和隐藏的 购物车每次打开都做一个初始化
      onShow(){
            //获取缓存中的收获地址信息
        const address = wx.getStorageSync('address')
        

          //1.获取缓存中购物车数据
          let info = wx.getStorageSync('cart') || [];
          // console.log(info);
          // 过滤后的购物车数组
          info = info.filter(v=>v.ifCheck === true);
          this.setData({address});
          this.setInfo(info);
      },               

      //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
      setInfo(info){

          //总价格和总数量
          let totalPrice = 0;
          let totalNum = 0;
          info.forEach(item=>{
              totalPrice += item.goods_price*item.num;
              totalNum+=item.num;              
          });

        //5把购物车数据重新设置回data中和缓存中
        this.setData({
          info,
          totalPrice,
          totalNum     
     });

      },  
      
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})