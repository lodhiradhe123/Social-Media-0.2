const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
 

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
        required:[true,"emai is required"]
        
    },
    password:String,
    number:{
        type:Number,
        required:[true,"number is required"]

    }
 },{timestamp:true})

 userModel.plugin(plm);
 const user = mongoose.model("user",userModel);
 module.exports=user;