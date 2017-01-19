import $ from 'jquery'
import { Promise } from 'es6-promise'

$(function() {
    $.removeCookie("display_name");
    $.removeCookie("id");
    $.removeCookie("roles");
    $("#login-btn").click(function() {
        login();
    });
    $("#username").keydown(function(e) {
        if (e.keyCode === 13) {
            $("#password").focus();
        }
    });
    $("#password").keydown(function(e) {
        if (e.keyCode === 13) {
            login();
        }
    });

    function login() {
        var data = {
            "username": $("#username").val(),
            "password": $("#password").val()
        };
        if (!data.username || !data.password) {
            alert("账号或密码为空！");
            return;
        }
        new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/v2/admin/users/login',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data),
                async: true,
                success: function(data) {
                    if (!data.result || data.result === 0) {
                        resolve({displayName: data.display_name, id: data.id});
                    } else {
                        if (data.result === 1013) {
                            reject("用户名或密码错误");
                        } else {
                            reject(data.error_message);
                        }
                    }
                },
                error: function(err) {
                    reject("出错了，" + err.status + "," + err.statusText);
                }
            });
        }).then(loginInfo => {
            $.ajax({
                url: '/api/v2/admin/permissions/my-role-list',
                type: 'GET',
                contentType: 'application/json',
                async: true,
                success: function(data) {
                    if (!data.result || data.result === 0) {
                        $.cookie("display_name", loginInfo.displayName, { path: '/' });
                        $.cookie("id", loginInfo.id, { path: '/' });
                        $.cookie("roles", JSON.stringify(data.data), { path: '/' });
                        window.location.href = "main.html";
                    } else {
                        alert(data.error_message);
                    }
                },
                error: function(err) {
                    alert("出错了，" + err.status + "," + err.statusText);
                }
            });
        }, value => {
            alert(value);
        });
    }
});