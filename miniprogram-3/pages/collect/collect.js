// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      name: '商品收藏',
      isActive: true
    },
    {
      id: 1,
      name: '品牌收藏',
      isActive: false
    },
    {
      id: 2,
      name: '店铺收藏',
      isActive: false
    },
    {
      id: 3,
      name: '浏览足迹',
      isActive: false
    }
  ],  
  // 信息
  info1:[
    '全部',
    '正在热卖',
    '即将上线'
  ],
    id:0,
    //收藏
    collect:[]
  },

  onShow: function () {
          const collect = wx.getStorageSync('collect') || [];
          this.setData({
            collect
          });            
  },

  //点击改变样式
  handleChangeStyle(e){
      console.log(e);
      const {index} = e.currentTarget.dataset;
      this.setData({
        id:index
      });
  },
  handleTabsItemChange(e){
    let {index} = e.detail;
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