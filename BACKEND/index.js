require('dotenv').config();
const server =require('./src/app');
const {conn}=require('./src/db'); 
const fileUpload=require('express-fileupload');
const {
    PORT
}=process.env
server.use(
    fileUpload({
    useTempFiles: true,
    tempFileDir: "./assets/",
  })
);
server.get("/",(req, res)=>{
    res.status(200).send('<h1>Welcome to the SOUNDWAVE web api</h1>');
})
server.use((err,req, res, next)=>{
    const {statusCode, message}=err;
    res.status(statusCode).json({
        error: true,
        message: message
    })
})
conn.sync({force: false}).then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server listening local on port: http://localhost:${PORT}`); 
    })
}); 