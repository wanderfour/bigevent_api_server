// 导入 express 模块
const express = require('express');
const app = express();

// 导入并配置 cors 中间件
const cors = require('cors');
app.use(cors());

// 导入错误数据验证模块
const joi = require('joi');

// 配置解析token的中间件（必须在路由之前）
const expressJWT = require('express-jwt');
const config = require('./config');

// 配置解析表单数据的中间件
// 配置解析application/x-www-form-urlencoded格式的表单数据的中间件
app.use(express.urlencoded({extended: false}));

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 封装res.cc()函数，优化res.send()代码
// 响应数据的中间件
app.use(function( req, res, next) {
    // status = 0 为成功，status = 1 为失败，默认将status的值设置为1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            status,
            // 状态描述，判断err是错误对象还是字符串
            message: err instanceof Error ? err.message : err,
        })
    }
    next();
})

// 全局配置解析token
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path:[/^\/api\//]}));

// 导入用户路由模块
const userRouter = require('./router/user');
// 注册用户路由模块，并加上统一的 '/api' 前缀
app.use('/api', userRouter);

// 导入获取用户信息的路由模块
const userinfoRouter = require('./router/userinfo');
// 注册用户路由模块，加上统一的 '/my' 前缀
app.use('/my', userinfoRouter);

// 导入获取文章分类管理的路由模块
const artcateRouter = require('./router/artcate');
// 注册文章分类路由模块，加上统一的 '/my/article‘ 前缀
app.use('/my/article', artcateRouter);

// 导入文章管理的路由模块
const articleRouter = require('./router/article');
// 注册文章管理路由，加上统一的前缀
app.use('/my/article', articleRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败的错误
    if (err instanceof joi.ValidationError) {
        return res.cc(err);
    }
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败');
    // 未知的错误
    // 不能连续两次调用res.send() 否则会报错
    res.cc('未知的错误');
})


// 启动服务器
app.listen(3007, ()=>{
    console.log('api server running at http://127.0.0.1:3007');
})