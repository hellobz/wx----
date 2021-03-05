/**
 * 1 点击+ 触发tap点击事件
 *    1.调用小程序内置的 选择图片的api
 *    2.获取到图片的路径 数组
 *    3.把图片路径 存到 data的变量中
 *    4.页面就可以根据图片数组 进行循环显示 自定义组件
 * 
 * 2点击自定义图片 组件
 *   1获取被点击的元素的索引
 *   2 获取data中的图片数组
 *   3根据索引 数组中删除对应的元素
 *   4 把数组重新设置回data中
 * 
 * 3 点击提交
 *    1 获取文本域的内容 类似普通输入框的获取
 *        1data中定义变量 表示输入框内容
 *        2文本域绑定输入事件 事件触发的时候 把输入框的值 存入变量中
 * 
 *    2对这些内容 做合法性验证
 *    3验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
 *        1 遍历图片数组
 *         1挨个上传
 *        3自己再维护图片数组 存放图片上传后的外网链接
 *    4文本域 和外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台
 *    5清空当前页面
 *    6返回上一页
 *  
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入框的值
    areaVal:'',
    tabs: [{
      id: 0,
      name: '体验问题',
      isActive: true
    },
    {
      id: 1,
      name: '商品、商家投诉',
      isActive: false
    }
  ], 
    //被选中的图片数组
    choosePhoto:[]   
  },
  // 外网的图片的路径数组
  UpImgs:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //获取输入框
  handleTextarea(e){
      const areaVal = e.detail.value;
      this.setData({
        areaVal
      });
  },

  //提交事件
  handleBtn(){
    //获取文本域的内容 图片数组
    const {areaVal,choosePhoto} = this.data;
    // 合法性的验证
      if(!areaVal.trim()){
        //不合法
        wx.showToast({
          title: '输入不合法',
          icon:'none',
          mask:true
        })
        return;
      }
      //3准备上传图片 到专门的图片服务器
      //上传文件的api 不支持 多个文件同时上传 遍历数组 挨个上传
      //显示正在等待的图标
      wx.showLoading({
        title: '正在提交',
        mask:true
      });

      // 判断有没有需要上传的图片数组
      if(choosePhoto.length!=0){
        choosePhoto.forEach((v,i)=>{

      
          wx.uploadFile({
            // 被上传的文件的路径
            filePath: v,
            // 上传的文件的名称 后台来获取文件 file
            name: 'file',
            //图片要上传到哪里
            url: 'https://imgchr.com/',
            //顺带的文本信息
            formData:{},
            success:(res)=>{
              let url = JSON.parse(res.data).url;
              this.UpImgs.push(url);
              //所有的图片上传完毕了才触发的
              if(i=== choosePhoto.length-1){
                //
                console.log("把文本的内容和外网的图片数组 提交到后台中");
                // 提交都成功了
                //重置页面
                this.setData({
                  choosePhoto:[],
                  areaVal:''
                })
                wx.hideLoading({              
                })
                // 返回上一个页面
                wx.navigateBack({
                  delta:1,
                });
    
              }
            } 
          })
        })
      }else{
          wx.uploadFile({
            filePath: areaVal,
            name: 'file',
            url: '',
            success:(res1)=>{
              wx.hideLoading({
              });
              wx.navigateBack({
                delta:1
              });
            }
          })          
      }
    
  },

  //选择图片
  handleChoosePhoto(){
      //调用选择图片内置的api
      wx.chooseImage({
        //同时选中图片的数量
        count:9,
        //图片的格式 原图 压缩图
        sizeType:['original','compressed'],
        //图片的来源 相册 相机
        sourceType:['album','camera'],
        success: (res) => {
          console.log(res);
          const choosePhoto = res.tempFilePaths;
          this.setData({
            //图片数组 进行拼接
              choosePhoto:[...this.data.choosePhoto,...choosePhoto]
          })
        },
      })
  },

  //组件
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

  //删除图片
  handleDelete(e){
    const {index} = e.currentTarget.dataset;
    const {choosePhoto}= this.data;
    choosePhoto.splice(index,1);
    this.setData({
      choosePhoto
    })
  }
})