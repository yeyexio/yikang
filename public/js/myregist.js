/**
 * Created by yeyexio on 2017/3/4.
 */
$(function(){
    $("#regist").click(function(){
        if($("#username").val().length<3){
            $("#successalert").hide();
            $("#erralert").hide();
            $("#erralert4").fadeOut();
            $("#erralert3").fadeIn();
            return;
        }
        if($("#password").val().length<6){
            $("#successalert").hide();
            $("#erralert").hide();
            $("#erralert3").hide();
            $("#erralert4").fadeIn();
            return;
        }
        if($("#passwordB").val()!= $("#password").val()){
            $("#successalert").hide();
            $("#erralert").hide();
            $("#erralert3").hide();
            $("#erralert4").hide();
            $("#erralert2").fadeIn();
            return;
        }


        $.post("/doregist",{
            username:$("#username").val(),
            password:$("#password").val(),
            profession:$("#profession").val()
        },function(result){
            if(result == -1){
                $("#erralert2").hide();
                $("#erralert3").hide();
                $("#erralert4").hide();
                $("#successalert").hide()
                $("#erralert").fadeIn();
            }else if(result == 1){
                $("#erralert2").hide();
                $("#erralert3").hide();
                $("#erralert4").hide();
                $("#erralert").hide();
                $("#successalert").fadeIn();
                setTimeout(function(){
                    window.location = "/myspace";
                },1000)
            }
        })
    });

    $("#password").on("focus",function(){
        $("#password").val("");
    });
    $("#passwordB").on("focus",function(){
        $("#passwordB").val("");
    });

})