const {Pool}=require('pg')

const pool=new Pool({
    user:'test3',
    host:'120.46.23.151',
    database:'library',
    password:'Bigdata@123',
    port:'26000',
    ssl:false
})
module.exports=pool