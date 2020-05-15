const db=wx.cloud.database()
const cart=db.collection("cart")

Page({

  data: {
    name:'',
    id:'',
    src:'',
    price:'',
    num:'',
    size:'',
    product:[],

    or:false,
    and:true,

    allPrice:0,
    username:'',
    phone_number:'',
    address:'',
    messages:''
  },
  // 备注
  remark:function(e){
    let that = this
    console.log(e)
    that.setData({
      messages:e.detail.value
    })
  },
  

 
  onLoad: function (options) {
    // 获取跳转过来的ID，利用id获取商品详情
    let user=wx.getStorageSync('user');
    let id=options.id
    let that=this
    // console.log(options.id)
    if(id){
          cart.doc(id).get().then(res=>{
            // console.log(res.data)
            this.data.product.push(res.data)
            this.setData({
              product:this.data.product,
              allPrice:res.data.product_price*res.data.product_num
            })
             
        })
    }else{
        db.collection('cart').where({
             product_checked:"true",
             _openid:user.openid
        }).get({
             success:function(res){
                  //  console.log('获取商品成功',res)
                  let allprice=0;
                  for(let i=0;i<res.data.length;i++){
                      allprice=allprice+res.data[i].product_num*res.data[i].product_price
                  }
                
                  that.setData({
                    allPrice:allprice,
                    product:res.data
                  })
              
              }
      })
    }
    
  },
  
  address:function(e){
    let that = this
    wx.getSetting({

      success(res) {
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  that.setData({
                    username:res.userName,
                    phone_number:res.telNumber,
                    address:res.provinceName+res.cityName+res.countyName+res.detailInfo,
                    or:true,
                    and:false
                  })

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

allPay(){
  console.log("购买成功")
  let time = new Date();
  let mytime=time.toLocaleString()
  let that = this
  if(that.data.username!=="" && that.data.address!=="" && that.data.phone_number!==""){
    db.collection('order').add({
      data:{
        username:that.data.username,  //用户名
        phone_number:that.data.phone_number,  //用户手机号
        address:that.data.address,    //用户地址
        messages:that.data.messages,   //用户留言备注
        time:mytime,                    //下单时间
        product_detail:that.data.product,
        allPrice:that.data.allPrice
      
      },success(res){
        wx.showToast({
          title: '购买失败...',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../order/order',
          })
        },500)
       
        
      }
    })
  }else{
    wx.showToast({
      title: '请填写地址',
      icon: 'none',
      duration: 2000
    })
  }
}
})