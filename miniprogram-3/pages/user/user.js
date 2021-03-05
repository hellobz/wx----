// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userinfo:{},
      collect:[
        {
          num:0,
          name:'收藏的店铺'
        },
        {
          num:0,
          name:'收藏的商品'
        },
        {
          num:0,
          name:'关注的商品'
        },
        {
          num:0,
          name:'我的足迹'
        },

      ],
      collectNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

},
  onShow(){
    const userinfo = wx.getStorageSync('userinfo');
    let collect = wx.getStorageSync('collect') || [];
    this.setData({
      userinfo,
      collectNum:collect.length
    })
  }
})