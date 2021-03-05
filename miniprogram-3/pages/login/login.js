// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //点击获取用户信息
  handleLogin(e){
      // console.log(e);
      const {userInfo} = e.detail;
      wx.setStorageSync('userinfo', userInfo);

      wx.navigateBack({
        delta:1})
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})