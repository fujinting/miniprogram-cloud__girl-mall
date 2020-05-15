const db=wx.cloud.database()
const goods=db.collection("goods")

Page({

    data: {
      name:'',
      id:'',
      srcs:[],
      price:'',
      content:'',
      num:'',
      show:true,

      // 新的商品数据
      // 新颜色
      newcolor:'',
      colornum:'',
      // 新尺寸
      newsize:'',
      sizenum:'',
      // 新数量
      newnum:1,

      cartnum:''
      
    },

 
  onLoad: function (options) {
      // 获取跳转过来的ID，利用id获取商品详情
      let id=options.id
      goods.doc(id).get().then(res=>{
          // console.log(res.data)
          this.setData({
            name:res.data.name,
            id:res.data._id,
            srcs:res.data.srcs,
            price:res.data.price,
            content:res.data.content,
            num:res.data.num,
            colors:res.data.colors,
            sizes:res.data.sizes
          })
         
      }),
      this.getCartNum()
      
  },
  // 获取购物车内商品数量
  getCartNum(){
    let user=wx.getStorageSync('user');
    if(user.openid){
      db.collection('cart').where({
        _openid:user.openid
      }).get({
        success:res=>{
          console.log(res);
          this.setData({
            cartnum:res.data.length
          })
        }
      })
       
    }
    
  },
  // 选择颜色
  chooseColor(e){
    let that=this
    that.setData({
      newcolor:e.currentTarget.dataset.name,
      colornum:e.currentTarget.dataset.num
    })
  },
  // 选择尺寸
  chooseSize(e){
    let that=this
    that.setData({
      newsize:e.currentTarget.dataset.name,
      sizenum:e.currentTarget.dataset.num
    })
  },
  // 选择购买数量
  onChange(value){
      // console.log(value.detail)
      let that=this
      that.setData({
       newnum:value.detail
      })
  },
  // 确认规格
  submitSpc(){
    let that=this
    that.closeShow()
  },
  // 加入购物车
  addCart(){   
      let that =this
      let user=wx.getStorageSync('user');
      
      if(user.openid){
        if(that.data.newcolor && that.data.newsize){
          db.collection("cart").add({
            data:{
              product_name:that.data.name,
              product_price:that.data.price,
              product_src:that.data.srcs[0],
              product_id:that.data.id,
              product_color:that.data.newcolor,
              product_size:that.data.newsize,
              product_num:that.data.newnum
            },success:function(res){
                console.log("商品加入购物车成功")
                 wx.showToast({
                  title: '加入成功',
                }) 
                that.getCartNum()        
            }

          })
        }else{
         that.specShow()
        }
      }else{  
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
      }
        
      
  },
 // 点击出现 选择商品规格
 specShow(){
  let that=this
  that.setData({
    show:!that.data.show,
   
  })
 },
 closeShow(){
  let that=this
  that.setData({
    show:true,
   
  })
 },
  // 直接购买,自动加入购物车
    submitBuy(){
         let user=wx.getStorageSync('user');
         let that=this;
         if(user.openid){
              if(that.data.newcolor && that.data.newsize){
                db.collection("cart").add({
                  data:{
                        product_name:that.data.name,
                        product_price:that.data.price,
                        product_src:that.data.srcs[0],
                        product_color:that.data.newcolor,
                        product_size:that.data.newsize,
                        product_num:that.data.newnum,
                        product_id:that.data.id,
                        product_checked:'true'
                        
                   },
                   success:function(res){
                        console.log("点击购买成功，即将跳转")   
                        wx.redirectTo({
                          // url: '../pay/pay?id='+that.data.id,
                          // url: `../pay/pay?id=${that.data.id}`
                            url: '../pay/pay?id='+res._id    
                        })  
                   }
                    
                })
              }else{
                   that.specShow()      
              }

          }else{
              wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
              })
          }
        
                
     },

  // 点击跳转到购物车
  toCart(){
    wx.switchTab({
      url: '../cart/cart'
    })
  }
})