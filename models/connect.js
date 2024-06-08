const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://radheshyamlodhi48:uy1m25TQ8TlK0lf5@cluster0.plr1rcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("connected");
 }).catch((err)=>{
    console.log(err);
 })