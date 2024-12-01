const express = require('express');
const path=require('path')
const app = express();
const studentsRouter = require('./student');
const cors=require('cors')

app.use(cors())

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')))

app.use('/students', studentsRouter);

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'))
})
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://120.46.23.151:${PORT}`);
});