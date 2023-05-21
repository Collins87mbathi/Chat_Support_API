const mongoose = require("mongoose");


const CONNECTDB = (url) => {

mongoose.connect(url).then(()=>{
console.log(`database connected successfully - 1`);
}).catch((error)=>{
console.log(`getting this error : ${error}`);
})
}

module.exports = CONNECTDB;
