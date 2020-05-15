const db=wx.cloud.database()

Page({

  data: {
    active: 0,
    allone:[],
    alltwo:[]
  },

  onLoad: function (options) {
    let user=wx.getStorageSync('user');
    let allone=[];
    let alltwo=[];
    if(user.openid){
      db.collection('order').where({
        _openid:user.openid
      }).get({
        success:res=>{
          console.log('所有订单成功',res)   
          for(let i=0;i<res.data.length;i++){
            allone.push(res.data[i])
            for(let j=0;j<res.data[i].product_detail.length;j++){
              alltwo.push(res.data[i].product_detail[j])
            }
          }
          console.log(allone)
          // console.log(alltwo)

          this.setData({
            allorder:allone,
            alltwo:alltwo
          })
          
        }
      })
    }
  },
  onshow:function(options){
    let user=wx.getStorageSync('user');
    let allone=[];
    let alltwo=[];
    if(user.openid){
      db.collection('order').where({
        _openid:user.openid
      }).get({
        success:res=>{
          console.log('所有订单成功',res)   
          for(let i=0;i<res.data.length;i++){
            allone.push(res.data[i])
            for(let j=0;j<res.data[i].product_detail.length;j++){
              alltwo.push(res.data[i].product_detail[j])
            }
          }
          console.log(allone)
          // console.log(alltwo)

          this.setData({
            allorder:allone,
            alltwo:alltwo
          })
          
        }
      })
    }
  },
  // 删除订单
  removeOrder(e){
    let that=this
    const _ = db.command
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除这个订单吗？',
      success (res) {
        if (res.confirm) {
          db.collection('order').where({
            product_detail:_.elemMatch({
              _id:e.currentTarget.dataset.id
            })
           }).update({
             data:{
               product_detail:_.pull({
                 _id:e.currentTarget.dataset.id
               })
             }
           })
         } else if (res.cancel) {
          console.log('删除订单失败')   
          }
        
        that.onshow()
      }
    })
   
  }
  
})