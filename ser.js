const express = require('express');
const pool = require('./db'); 
const app = express();
const studentsRouter = require('./student');
const cors=require('cors')

app.use(cors())

app.use(express.json());

app.use('/students', studentsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://120.46.23.151:${PORT}`);
});