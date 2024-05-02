const mongoose = require("mongoose");
 

 const userModel = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, "name is required"],
        minlength:[4,"username should be more then 4 letter"],
    },
    username:{
        type:String,
        trim:true,
        required:[true, "name is required"],
        minlength:[4,"username should be more then 4 letter"],
    },
    email:{
        type:String,
        
    },
    password:String,
 },{timestamp:true})

 const user = mongoose.model("user",userModel);

 module.exports=user;