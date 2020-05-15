const db=wx.cloud.database()

Page({
  data: {
    cart_goods:[],
    allprice:0,
    empty:false
  },

  onLoad: function (options) {
    let user=wx.getStorageSync('user');
    if(user.openid){
      db.collection('cart').where({
        _openid:user.openid
      }).get({
        success:res=>{
          console.log('获取购物车商品成功',res)   
          this.setData({
            cart_goods:res.data,
          })
          this.getallPrice()
        }
      })
    }
   
   
     
  },
  onShow: function (options) {
    let user=wx.getStorageSync('user');
    if(user.openid){
      db.collection('cart').where({
        _openid:user.openid
      }).get({
        success:res=>{
          console.log('获取购物车商品成功',res)   
          this.setData({
            cart_goods:res.data,
          })
          this.getallPrice()
        }
      })
    }
 },

// 选中状态下 
 choose(e){
    let that = this
    // console.log(e.detail.value)
    // console.log(e)
    if(e.detail.value.length!==0){
      db.collection('cart').doc(e.target.dataset.id).update({
        data:{
          product_checked:"true"
        },success:function(res){
          that.onLoad()
         
        }
      })
    }else{
      db.collection('cart').doc(e.target.dataset.id).update({
        data:{
          product_checked:""
        },success:function(){
          that.onLoad()
         
        }
      })
    }
   
   
    
  },
// 获取总价格
getallPrice(){
  let user=wx.getStorageSync('user');
  let that=this
  db.collection('cart').where({
    product_checked:"true",
    _openid:user.openid
  }).get({
    success:function(res){
      // console.log(res.data.length)
          let allprice=0;
          for(let i=0;i<res.data.length;i++){
              allprice=allprice+res.data[i].product_num*res.data[i].product_price
          }
          that.setData({
            allprice:allprice
          })

    }
  })
},

  // 删除订单
  removeOrder(e){ 
    let that=this
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除这个商品吗？',
      success (res) {
        if (res.confirm) {
            db.collection('cart').doc(e.target.dataset.id).remove({
              success:function(res){
                that.onLoad()  
              }
            })
         } else if (res.cancel) {
          console.log('删除商品失败')   
          }
      }
    })
   
  },
  // 去结算
  toPay(){
    let user=wx.getStorageSync('user');
    db.collection('cart').where({
      product_checked:"true",
      _openid:user.openid
    }).get({
      success:function(res){
        // console.log('获取商品成功',res)
        if(res.data.length == 0){
          wx.showToast({
            title: '你还未选择商品',
            icon:"none"
          })
        }else{
          wx.redirectTo({
            url: '../pay/pay'
          })
        }
      }
    })
    
  }
})