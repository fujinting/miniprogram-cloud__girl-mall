
Page({

  data: {
      canIUse:wx.canIUse('button.open-type.getUserInfo'),
      user:{},
      openid:''
  },
  
  onLoad: function() {
    let user=wx.getStorageSync('user');
          this.setData({
            user:user,
            openid:user.openid
         })
         
  },
  // 授权登录
  bindGetUserInfo (e) {
    let that=this
    // 调用云函数获取openid
    wx.cloud.callFunction({
      name:'login',
      success:res=>{
        console.log("云函数调用成功")
        // console.log(res.result.openid)
        // console.log(e.detail.userInfo)
        if(e.detail.userInfo){
          that.setData({
            openid:res.result.openid,
            user:e.detail.userInfo
          })
  
          that.data.user.openid=that.data.openid
          // console.log("openid",that.data.openid)
          console.log("user",that.data.user)
          wx.setStorageSync('user', that.data.user)
          
        }
        
      },
      fail:res=>{
        console.log("云函数调用失败")
      }
    })
   
  
   
   
  },
  // 收货地址
    receiveAddr(){
      wx.getSetting({
        success(res) {
          console.log(res)
          if (res.authSetting['scope.address']) {
            wx.authorize({
              scope: 'scope.address',
              success () {
                wx.chooseAddress({
                  success (res) {
                    console.log(res)
                  }
                })
              }
            })
          }else{
            wx.authorize({
              scope: 'scope.address',
              success () {
                wx.chooseAddress({
                  success (res) {
                    console.log(res)
                  }
                })
              }
            })
          }
        }
      })
    },
    // 退款退货
    refund(){
      wx.showToast({
        title: '请联系客服',
        icon: 'none',
        duration: 2000
      })
     
    },
    // bug反馈
    tellBug(){
      wx.showToast({
        title: '有bug?不存在的！',
        icon: 'none',
        duration: 2000
      })
    },
    // 跳转到全部订单
    allOrder(){
      let user=wx.getStorageSync('user');
      if(user.openid){
        wx.redirectTo({
          url: '../order/order',
        })   
      }else{
        wx.showToast({
          title: '请先登录吧',
          icon:'none'
        })
      }
       
    }   
})