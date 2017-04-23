/**
 * Created by yeyexio on 2017/3/4.
 */
const express = require("express");
const app = express();
const router = require("./control/router.js");
const session = require('express-session');
const http = require('http').Server(app);
const io = require("socket.io")(http);


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set("view engine","ejs");
app.use(express.static("./public"));
app.use("/head",express.static("./head"));
app.get("/regist",router.showMyRegist);
app.post("/doregist",router.doMyRegist);
app.get("/login",router.showLogin);
app.post("/doLogin",router.doLogin);
app.get("/myspace",router.myspace);
app.post("/dohead",router.dohead);
app.get("/checkchat",router.checkchat)
app.get("/chat",router.chat);
app.get("/myquestion",router.myquestion);
app.post("/present",router.present);
app.get("/delete",router.delete);
app.get("/initial",router.initial);
app.get("/search",router.search);
app.get("/dosearch",router.dosearch)







io.on("connection",function(socket){
    socket.on("msg",function(msg){
        io.emit("msg",msg);
    });
});



http.listen("2880");
