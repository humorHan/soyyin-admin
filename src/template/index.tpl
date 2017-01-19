<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>酱印网管理系统</title>
    <link rel="shortcut icon" type="image/ico" href="http://www.soyyin.com/assets/img/favicon.ico">
    <link rel="stylesheet" href="css/bootstrap-flatly.min.css">
    <style type="text/css">
        .row{
            margin-top: 130px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <h3 class="text-center">酱印网管理系统</h3>
                <div class="login-panel panel panel-default">
                    <div class="panel-body">
                        <form role="form">
                            <fieldset>
                                <div class="form-group">
                                    <input id="username" class="form-control" placeholder="用户名" name="email" type="email" autofocus>
                                </div>
                                <div class="form-group">
                                    <input id="password" class="form-control" placeholder="密码" name="password" type="password" value="">
                                </div>
                                <button class="btn btn-lg btn-success btn-block" id="login-btn" type="button">登录</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="js/lib/jquery-3.1.1.min.js"></script>
    <script src="js/lib/jquery.cookie.js"></script>
</body>
</html>