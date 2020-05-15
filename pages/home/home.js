const db=wx.cloud.database()

Page({

  data: {
    banners:[],
    commends:[]
  },
  onLoad: function (options) {
  
      db.collection('banners').get().then(res=>{
        console.log(res);
        
        this.setData({
          banners:res.data
        })
      
      }),
      db.collection('goods').get().then(res=>{
          console.log(res);
         
            this.setData({
            commends:res.data
          }) 
      })
  },
  itemClick(){
    console.log("---")
  }

 
 
})