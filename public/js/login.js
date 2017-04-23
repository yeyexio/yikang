/**
 * Created by yeyexio on 2017/3/5.
 */
$(function(){
    $("#login").click(function(){
        $.post("/doLogin",{
            username:$("#username").val(),
            password:$("#password").val()
        },function(result){
            if(result == -1){
                $("#successalert").hide();
                $("#erralet1").hide();
                $("#erralert").fadeIn();
                return;
            }
            else if(result ==-2){
                $("#successalert").hide();
                $("#erralet").hide();
                $("#erralert1").fadeIn();
                return;
            }
            else if(result == 1){
                console.log("ssss")
                $("#erralert").hide();
                $("#erralert1").hide();
                $("#successalert").fadeIn();
                setTimeout(function(){
                    window.location = "/myspace";
                },1000)
                return;
            }
        })
    })
    $("#username").on("focus",function(){
        $("#password").val("");
    })
})