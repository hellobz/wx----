  /**
   * promise 形式 getSetting
   */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          reject(error);
        }
      })
    })
}

  /**
   * promise 形式 chooseAddress
   */
  export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
      wx.chooseAddress({
        success: (res1) => {
          resolve(res1);
        },
        fail: (error) => {
          reject(error);
        }
      })      
    })
}

  /**
   * promise 形式 openSetting
   */
  export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
      wx.openSetting({
        success: (res1) => {
          resolve(res1);
        },
        fail: (error) => {
          reject(error);
        }
      })      
    })
}

  /*
    prmoise 形式 showModal
      @param {object} param0 参数
  */
  export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
      wx.showModal({
        title:'删除商品',content,
        success: (res1) => {
          resolve(res1);
        },
        fail: (error) => {
          reject(error);
        }
      })      
    })
}


  /*
    prmoise 形式 showToast
      @param {object} param0 参数
  */
  export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
      wx.showToast({
        title,icon:'none',
        success: (res1) => {
          resolve(res1);
        },
        fail: (error) => {
          reject(error);
        }
      })      
    })
}

/*
    prmoise 形式 login
      @param {object} param0 参数
  */
 export const login=({timeout})=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout,
      success:(result)=>{
        resolve(result);        
      },
      fail:(err)=>{
        reject(err);
      }
    })         
  })
}

/*
    prmoise 形式 login 调起微信支付
      @param {object} pay 参数
  */
 export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success:(result)=>{
        resolve(result);        
      },
      fail:(err)=>{
        reject(err);
      }
    })         
  })
}