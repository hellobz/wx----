// pages/cart/cart.js
/**
 * 1.获取用户的收获地址
 *  1.绑定点击事件
 *  2调用小程序内置api 获取用户的收获地址
 * 2.获取用户对小程序所授予 获取地址的权限状态 scope
 *    1假设用户 点击获取收获地址的提示框 确定 authSetting scope.address
 *      scope true  直接调用 获取收货地址
 *    
 *    3假设 用户从来没有调用过收货地址的api
 *      scope undefined 直接调用 获取收货地址
 * 
 *    2假设 用户点击获取收获地址的提示框 取消 scope值为false
 *      1 诱导用户自己打开授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候
 *      2获取收货地址  
 *    4 把获取到的收获地址 存入到本地存储中
 * 
 * 2.页面加载完毕要做的事
 *    0 onLoad onShow
 *    1.获取本地存储中的地址数据
 *    2 把数据 设置给data中的一个变量
 *      
 *  3. onShow
 *    0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
 *      1 num =1
 *      2 ifCheck = true
 *    1.获取缓存中的购物车数组
 *    2.把购物车数据填充到data中
 * 4全选的实现 数据的展示
 *  1.onShow 获取缓存中的购物车数组
 *  2.根据购物车中的商品数据 所有的商品都被选中 checked = true 全选就被选中
 * 
 * 5.总价格和总数量
 *  1.都需要商品被选中 我们才拿它来计算
 *  2.获取购物车数组
 *  3.遍历
 *  4.判断商品是否被选中
 *  5.总价格 += 商品的单价 * 商品的数量
 *  6 总数量+= 商品数量
 *  7把计算后的价格和数量设置回data中
 * 
 * 6商品的选中功能
 *  1.绑定change事件
 *  2.获取到被修改的商品对象
 *  3.商品对象的选中状态 取反
 *  4.重新填回data中和缓存中
 *  5.重新计算全选 总价格总数量
 * 
 * 7全选和反选
 *  1.全选复选框绑定事件 change
 *  2.获取data中的全选变量 allCheck
 *  3.直接取反 allCheck =!allCheck
 *  4.遍历购物车数组 让里面商品选中状态跟随 allChecked 改变而改变
 *  5.把购物车数组 和allChecked 重新设置回data 把购物车重新设置回缓存中
 * 
 * 8 商品数量的编辑
 *    1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
 *        1. "+" "+1"
 *        2. "-" "-1"
 *    2.传递被点击的商品id goods_id
 *    3.获取data中的购物车数组 来获取需要被修改的商品对象
 *    4.当购物车的数量 =1 同时用户点击 "-"
 *      1  弹窗提示 wx.showModal 询问用户是否要删除
 *      2.取消什么都不做
 *    4.直接修改商品对象的数量 num
 *    5.把info数组 重新设置回 缓存中 和data中 this.setInfo
 * 
 * 9 点击结算
 *    1判断有没有收获地址信息
 *    2.判断一下用户有没有选购商品
 *    3经过以上验证了 跳转到支付页面
 */
//引入简化代码文件 要把名称补充完整 多个引入用对象
import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/asyncWechat.js';
//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:{},
      info:[],
      //全选
      allCheck:false,
      //总价格
      totalPrice:0,
      //总数量
      totalNum:0
      
  },

      //由于·购物车需频繁打开和隐藏的 购物车每次打开都做一个初始化
      onShow(){
            //获取缓存中的收获地址信息
        const address = wx.getStorageSync('address')
        

          //1.获取缓存中购物车数据
          const info = wx.getStorageSync('cart') || [];
          console.log(info);

          this.setData({address});
          this.setInfo(info);
      },    

      //增加减少
     async handleChangGoods(e){
      
        // return; //不要往下面执行
        //1.获取传过来的参数
          let {operation,id} =  e.currentTarget.dataset;
          //2.获取购物车数组
          let {info} = this.data;  
          //3.找到需要修改商品的索引
          let index = info.findIndex(v=>v.goods_id === id);
          //4判断是否要执行删除
          if(info[index].num ===1 && operation === -1){
            //4.1弹窗提示
            //这个show是个回调函数 success也是个函数 这样写this就变成了show的对象了
            //要把success变成箭头函数方式
            let res = await showModal({content:'你是否要删除'});
            if(res.confirm){
              info.splice(index,1);
              this.setInfo(info);
            }}else{
              //4.进行修改数量
              info[index].num+=operation; 
              //5修改负数和过载情况  
            //  info[index].num=Math.max(info[index].num,1);
            //  info[index].num=Math.min(info[index].num,10);       
            //5设置回缓存和data中             
            this.setInfo(info);
            }

          //   if(info[index].num ===1 && operation === -1){
          //   wx.showModal({
          //     title:'删除商品',
          //     content:'你确定要删除这个商品',
          //     success:(res)=>{
          //       if(res.confirm){
          //         info.splice(index,1);
          //         this.setInfo(info);
          //       }else if(res.cancel){
          //           console.log('取消');
          //       }
          //     }
          //   })
          // }else{
          //   //4.进行修改数量
          //   info[index].num+=operation; 
          //   //5修改负数和过载情况  
          // //  info[index].num=Math.max(info[index].num,1);
          // //  info[index].num=Math.min(info[index].num,10);       
          // //5设置回缓存和data中             
          // this.setInfo(info);
          // }
          //else正常做数量编辑
                              
      },

      //结算
      async handleSettle(){
          let {address,totalNum} = this.data;
          console.log(address);
          if(!address.all){
            await showToast({title:'您还没有添加收获地址'});
            return;
          };
          
          //数量不为0
          if(!totalNum){
            await showToast({title:'你还没有选中商品'});
            return;
          }
          
            //3.跳转到支付页面
            wx.navigateTo({
              url: '/pages/pay/pay',
              success:(result)=>{

              }
            })
          
      },

      //全选反选
      handleAllCheck(){
          //1.获取data中的数据
          let {info,allCheck} = this.data;
          // console.log(info);
          //修改全选
          allCheck = !allCheck;
          //3.循环修改info数组中的商品选中状态
          info.forEach(v=>v.ifCheck = allCheck);
          //4.把修改后的值 填充回data或者缓存中
          this.setInfo(info);
      },

      //点击改变商品选中状态
      handleGoodsChange(e){
        //获取被修改的商品id
        const goods_id = e.currentTarget.dataset.id;
          console.log(goods_id);
          //2获取购物车数组
         let {info} = this.data;
         let info1 =  wx.getStorageSync('cart');
         //3找到被修改的商品对象
         let index = info.findIndex(v=>v.goods_id === goods_id);
         //4 选中状态取反
         info[index].ifCheck = !info[index].ifCheck;                  

         this.setInfo(info);
      },

      //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
      setInfo(info){
         let allCheck = true;

          //总价格和总数量
          let totalPrice = 0;
          let totalNum = 0;
          info.forEach(item=>{
              //ifCheck是商品的勾选
              if(item.ifCheck){
                  totalPrice += item.goods_price*item.num;
                  totalNum+=item.num;
              }else{
                allCheck = false;
              }
          });

          //判断一下数组是否为空
        allCheck = info.length?allCheck:false;

        //5把购物车数据重新设置回data中和缓存中
        this.setData({
          info,
          totalPrice,
          totalNum,
          allCheck          
     })

     wx.setStorageSync('cart', info);
      },

    // 添加收获地址 
    
      async handleAddTo(){
        try{
        //1 获取权限状态
        const res = await getSetting();
        const scopeAddress = res.authSetting["scope.address"];
        // 2 判断权限状态
        if(scopeAddress===false){
          // 3先诱导用户打开授权页面
          await openSetting();
        }
        //4调用获取收货地址的api
        let address = await chooseAddress();
        address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
 
        //存入到缓存中
        wx.setStorageSync('address', address)
        // console.log(res1);
      }catch(error){
        console.log(error);
    }
    },

      //报错chooseAddress:fail auth deny 原因是你没有在fail里处理代码 通过try catch解决
        //1.获取权限状态
        // wx.getSetting({
        //   success:(res)=>{
        //         //2获取权限状态 只要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
        //           const scopeAddress = res.authSetting["scope.address"];
        //           if(scopeAdddress===true || scopeAdddress === undefined){
        //             wx.chooseAddress({
        //               success: (res1) => {
        //                 console.log(res1);
        //               }
        //             })
        //           }else{
        //               //3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
        //               wx.openSetting({
        //                 success: (res2) => {
        //                   //4可以调用 收货地址代码
        //                   wx.chooseAddress({
        //                     success: (res3) => {
        //                       console.log(res3);
        //                     }
        //                   })
        //                 },
        //               })
        //           }
        //         },
        //         fail:()=>{
                    
        //         },
        //         complete: () => {},
              
        // })

      // 测试
      //获取用户收获地址
      // wx.chooseAddress({
      //   success: (res) => {
      //     console.log(res);
      //   },
      // })

    //   wx.getSetting({
    //     success:(res)=>{
    //         console.log(res);
    //     },
    //     fail:()=>{
            
    //     },
    //     complete: (res) => {},
    //   })
    // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})