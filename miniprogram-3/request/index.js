let times = 0;
export const request = (params) => {
  // 判断url中是否带有/my/  请求的是私有的路径 带上header token
  let header = {...params.header};
  //方法1
  if(params.url.includes("/my/")){
    //拼接header 带上token
    header["Authorization"] = wx.getStorageSync('token');
  }

  //方法2
  // let reg = /\/my\//
  // if(reg.test(params.url)){

  // }

    times++;
    //初次显示加载中
    wx.showLoading({
      title: '加载中',
      mask:true
    })
  //定义公共的url
  let baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete:()=>{
        times--;
        if(times === 0){
          //关闭加载
          wx.hideLoading()
        }
      }
    })
  })
}

export const request1 = (params) => {
  // 判断url中是否带有/my/  请求的是私有的路径 带上header token
  let header = {...params.header};
  //方法1
  if(params.url.includes("/my/")){
    //拼接header 带上token
    header["Authorization"] = wx.getStorageSync('token');
  }

  //方法2
  // let reg = /\/my\//
  // if(reg.test(params.url)){

  // }

    times++;
    //初次显示加载中
    wx.showLoading({
      title: '加载中',
      mask:true
    })
  //定义公共的url
  let baseUrl = 'http://rap2.taobao.org:38080/app/mock/264719';

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete:()=>{
        times--;
        if(times === 0){
          //关闭加载
          wx.hideLoading()
        }
      }
    })
  })
}