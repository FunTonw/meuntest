const express =  require("express");
const app = express();
const port = 4000;




app.get("/",(req, res)=>{
    console.log(req);
    res.send("Hallo");
    
})

app.listen(port, () =>{
    console.log(`http:/localhost:${port}`)
})