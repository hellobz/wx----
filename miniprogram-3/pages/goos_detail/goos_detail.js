import {
  request
} from "../../request/index.js"

/**
 * 点击轮播图预览大图功能
 * 1.给轮播图绑定点击事件
 * 2.调用小程序的api previewImage
 * 3.点击加入购物车
 *    1绑定点击事件 
 *    2获取缓存中的购物车数据 数组格式
 *    3先判断 当前的商品是否已经存在于购物车
 *    4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
 *    5不存在购物车数组中 直接给购物车数组添加一个新元素 新元素 带上购买数量属性 num 重新把购物车数组 填充缓存道中
 *    6弹出用户提示
 * 
 * 4.商品收藏
 *    1页面onShow的时候 加载缓存中的商品收藏的数据
 *    2判断当前商品是不是被收藏
 *      1是 改变页面的图标
 *      2不是 ....
 *    3.点击商品收藏按钮
 *      1判断商品是否存在于缓存数组中
 *      2已经存在 把改商品删除
 *      3没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */     

//导入转es7async文件
import regeneratorRuntime from '../../lib/runtime/runtime'
// pages/goos_detail/goos_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       goodsList:{},
        //商品是否被收藏
       isCollect:false
  },
    shopList:{},
  // 点击图片预览
  handlePreview(e){
    console.log(e);
    let current = e.currentTarget.dataset.url
   
    //1.先构造要预览的图片数组
    // maps是构造新数组
    let urls = this.shopList.pics.map(v=>v.pics_mid)
    wx.previewImage({
      urls,
      current
    })
  },

  //加入购物车
  handleCartAdd(){
    //1.先获取缓存中的购物车数据
      let cartArr = wx.getStorageSync('cart')||[];
      //2 判断商品对象是否存在于购物车数组中
      let index = cartArr.findIndex(v=>v.goods_id === this.shopList.goods_id);
      if(index === -1){
        //不存在 第一次添加
          this.shopList.num = 1;
          this.shopList.ifCheck = true;
          cartArr.push(this.shopList)
      }else{
          //已经存在购物车数据 执行 num++
          cartArr[index].num++;
      }
      //5把购物车重新添加到缓存中
      wx.setStorageSync('cart', cartArr);
      //6弹窗提示
      wx.showToast({
        title: '加入购物车成功',
        icon:'success',
        //true 防止用户手抖 疯狂点击按钮
        mask:true
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length-1];
      let options = currentPage.options;
      const {goods_id} = options;
      this.getDetail({goods_id});  
  },
    async getDetail({goods_id}){
        let goodsList = await request({url:"/goods/detail",data:{goods_id}});
        this.shopList = goodsList;

            //1.获取缓存中的商品收藏的数组
      let collect = wx.getStorageSync('collect') || [];
      //2判断当前商品是否被收藏
      let isCollect = collect.some(v=>v.goods_id === this.shopList.goods_id);

        this.setData({
          goodsList:{
            goods_name:goodsList.goods_name,
            goods_price:goodsList.goods_price,
            //iphone部分手机不识别webp格式的 webp很好的格式 体积小质量高
            //最好找到后台 让他进行修改
            // 临时自己改 确保后台是存在 1.webp=>1.jpg 加g全部替换
            goods_introduce:goodsList.goods_introduce.replace(/\.webp/g,'.jpg'),
            pics:goodsList.pics
          },
          isCollect
        })
    }

      //改变收藏
    ,handleChangeCollect(){
      let isCollect = false;
       //1.获取缓存中商品收藏
       let collect = wx.getStorageSync('collect') || [];
       //2判断商品是否被收藏
       let index = collect.findIndex(v=>v.goods_id === this.shopList.goods_id );
       //3. 当index != -1 表示已经收藏过
       if(index !== -1){
          //能找到 已经收藏过了 在数组中删除该商品
          collect.splice(index,1);
          isCollect = false;
          wx.showToast({
            title: '取消成功',
            icon:'success',
            mask:true
          })
       }else{
          //没收藏
          collect.push(this.shopList);
          isCollect = true;
          wx.showToast({
            title: '收藏成功',
            icon:'success',
            mask:true
          })
       }
       //4把数组存入到缓存中
       wx.setStorageSync('collect', collect);
       //5修改data中的属性 isCollect
       this.setData({
         isCollect
       })
    }
})