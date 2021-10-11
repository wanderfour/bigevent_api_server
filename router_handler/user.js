// 导入数据库操作模块
const db = require('../db/index');

// 导入bcryptjs，用于密码加密
const bcrypt = require('bcryptjs');

// 导入jsonwebtoken，用于生成token
const jwt = require('jsonwebtoken');

// 导入token加密解密的秘钥，通过导入全局配置文件
const config = require('../config');

// 注册接口功能
// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 检测表单数据是否合法（前端验证为辅，后端验证为主，后端永远不要相信前端提交过来的任何内容）
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 1,
    //         message: '用户名或密码不能为空！'
    //     })
    // }
    // 表单数据验证已通过引入joi模块优化
    // 检测用户名是否被占用
    const sqlStr = 'select username from ev_users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            // return res.send({status: 1, message: err.message});
            // res.cc 简化改造
            return res.cc(err);
        }
        if (results.length >0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名已被占用，请更换其他用户名'
            // })
            return res.cc('用户名已被占用，请更换其他用户名');
        }
        // 对密码进行加密处理
        // 加密后返回的是密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        
        // 插入新用户
        const sqlInsert = 'insert into ev_users set ?';
        db.query(sqlInsert, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            if(err) {
                // return res.send({
                //     status: 1,
                //     message: err.message
                // })
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                // return res.send({
                //     status: 1,
                //     message: '注册用户失败，请稍后再试！'
                // })
                return res.cc('注册用户失败，请稍后再试！');
            }
            // res.send({status: 0, message: '注册成功'});
            res.cc('注册成功', 0);
        })
    })

}

// 登录接口功能
exports.login = (req, res) => {
    // 接收请求的表单数据
    let userinfo = req.body;
    // sql语句
    const sql = 'select * from ev_users where username=?';
    // 执行sql语句，根据用户名查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err);
        // 获取数据条数要等于1
        if (results.length !== 1) return res.cc('登录失败');
        // 判断密码是否正确
        // 比较用户输入密码和数据库密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc('密码不正确');

        // 在服务器端生成JWT的token字符串
        // 通过es6高级语法，快速去除密码的值
        const user = {...results[0], password: '', user_pic: ''};
        // 对用户信息加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn});
        // 将token发送到客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}