const db=wx.cloud.database()

Page({
  data: {
      categories:[],
      category_now:"",
      goods:[],
      num:''
  },
  
  get_category(e){
      console.log(e)
      let that=this
      that.setData({
        category_now:e.currentTarget.dataset.name,
        num:e.currentTarget.dataset.num
      })
     that.get_goods()
  },
  get_goods(){
      let that =this
      db.collection('goods').where({
        category:that.data.category_now
      }).get({
        success:function(res){
            console.log("获取分类成功",res);
            that.setData({
              goods:res.data
            })
        }
      })

  },
  
  onLoad: function (options) {
    let that =this
    // 获取所有的分类
    db.collection('categories').get().then(res=>{
      this.setData({
        categories:res.data
     })     
     //获取默认第一页的商品  
    db.collection('goods').where({
        category:res.data[0].category
    }).get({
        success:function(res){
          console.log("获取分类成功",res);
          that.setData({
            goods:res.data
         })
        }
    })
  })
    
  }

  
})