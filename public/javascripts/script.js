const profileimage = document.querySelector(".profileimage");
const inputimage = document.querySelector(".inputimage");
const formimage =document.querySelector(".form-image");

profileimage.addEventListener("click",function(){
    inputimage.click();
})
  
inputimage.addEventListener("change",function(){
    formimage.submit();
})
