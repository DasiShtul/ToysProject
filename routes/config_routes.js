const indexR=require("./index");
const userR=require("./users");
const toysR=require("./toys");

exports.routesInit=(app)=>{
    app.use("/",indexR);
    app.use("/users",userR);
    app.use("/toys",toysR);
}