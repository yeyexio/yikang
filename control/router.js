/**
 * Created by yeyexio on 2017/3/4.
 */
const db = require("../model/db.js");
const ObjectId = require("mongodb").ObjectID;
const md5 = require("../model/md5.js");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.showMyRegist = function (req, res, next) {
    res.render("myregist");
}
exports.doMyRegist = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var password = fields.password;
        var profession = fields.profession;
        db.find("usernames", {"username": username}, function (err, result) {
            if (err) {
                res.send("-2");
                console.log("aaa")
                return;
            }
            if (result != 0) {
                res.send("-1");
                return;
            }
            password = md5(md5(password) + "yikang")
            db.insertOne("usernames", {
                "username": username,
                "password": password,
                "profession":profession
            }, function (err, result) {
                if (err) {
                    res.send("-3");
                    return;
                }
                req.session.login = "1";
                req.session.username = username;
                req.session.profession = profession;
                res.send("1");
            })
        })
        console.log(username)
    })
}

exports.showLogin = function(req,res,next){
    res.render("myLogin")
}

exports.doLogin = function(req,res,next){
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var username = fields.username;
            var password = fields.password;
            var md5Password = md5(md5(password) + "yikang");
            db.find("usernames", {"username": username}, function (err, result) {
                if (err) {
                    res.send("���ݿ��ѯ����");
                    return;
                }
                if (result.length == 0) {
                    res.send("-1");//���޴���
                    return;
                }
                if (md5Password == result[0].password) {
                    req.session.login = "1";
                    req.session.username = username;
                    req.session.profession = result[0].profession;
                    req.session.headpic = result[0].headpic;
                    res.send("1");  //��½�ɹ�
                    return;
                } else {
                    res.send("-2");  //�������
                    return;
                }
            });
        });
    };

exports.myspace = function (req, res, next) {
    if (req.session.login == "1") {
        //�Ѿ���½��
        var username = req.session.username;
        var login = true;
    } else {
        //û�е�½
        var username = "";
        var login = false;
    }
    db.find("usernames", {username: username}, function (err, result) {
        if(result.length == 0) {
            var headpic = "timg.jpg";
        }
        else if(result[0].headpic == undefined){
            var headpic = "timg.jpg";
            var havepic = false;
        }
        else{
            var headpic = result[0].headpic;
            var havepic = true;
        }
        req.session.headpic = headpic;
        res.render("myspace", {
            "login": login,
            "username": username,
            "headpic": headpic,//ͷ��
            "havepic":havepic,
            "profession":req.session.profession
        });
    });
};

exports.dohead = function (req, res, next) {
    if (req.session.login != "1") {
        return;
    }
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../head");
    form.parse(req, function (err, fields, files) {
        var oldpath = files.headpic.path;
        var newpath = path.normalize(__dirname + "/../head") + "/" + req.session.username + ".jpg";
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send();
                return;
            }
            req.session.headpic = req.session.username + ".jpg";
            //ˢ��
            db.updateMany("usernames", {"username": req.session.username}, {
                $set: {"headpic": req.session.headpic}
            }, function (err, results) {
                res.redirect("/myspace");
            });
        });
    });
};
exports.checkchat = function(req,res,next){
    res.render("chatlist");
};

exports.chat = function(req,res,next){
    if(req.session.login != "1" ){
        res.redirect("/login");
        return;
    }
    res.render("chat",{
        "username":req.session.username,
        "headpic":req.session.headpic
    })
};

exports.myquestion = function(req,res,next){
    if (req.session.login == "1") {
    var username = req.session.username;
    var login = true;
    var headpic = req.session.headpic;
    var profession = req.session.profession;
    db.find("usernames", {username: username}, function (err, result) {
            var headpic = result[0].headpic;
            res.render("myquestion", {
                "login": login,
                "username": username,
                "headpic": headpic,//ͷ��
                "profession":profession
            });
        });
} else {
   res.redirect("/myspace")
}
};

exports.present = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        db.insertOne("mymessage", {
                "message": fields.message,
                "mesname": fields.username,
                "time": (new Date()).toLocaleString(),
                "head": req.session.headpic,
                "title":fields.title,
                "profession":fields.profession
            }, function (err, result) {
                if (err) {
                    res.send({'result': -1});
                    return;
                }
                res.send({'result': 1})
            }
        )
    })
};

exports.delete = function(req,res,next) {
    var id = req.query.id;
    db.deleteMany("mymessage", {"_id": ObjectId(id)}, function (err, result) {
        if (err) {
            res.send("bbb");
            return;
        }
        res.send(1);
    });
};

exports.initial = function(req,res,next){
    var head = req.session.headpic;
    //为设么不能用用户名来当搜索条件,怪事!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    db.find("mymessage",{"head":head},{"sort":{"time":-1}},function(err,result){
       if(err){
           return;
       }
        res.json({"result":result});
    });
}

exports.search = function(req,res,next){
    res.render("search")
}

exports.dosearch = function(req,res,next){
    var title = req.query.title;

    db.find("mymessage",{"title":title},{"sort":{"time":-1}},function(err,result){
        if(err){
            return;
        }
        if(result.length == 0){
            console.log("没有该数据")
            res.send("-1");
            return;
        }
        res.json({"result":result});
    });
}