const db = require('../db/index');

// 导入处理密码的模块
const bcrypt = require('bcryptjs');

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义sql语句
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?';
    // 调用db.query()执行sql语句,
    // req.user是token解析成功，通过express-jwt中间件，将user请求信息挂载到req上
    // console.log(req);
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        });
    })
}

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义sql语句
    const sql = 'update ev_users set ? where id=?';
    console.log(req.body);
    db.query(sql, [req.body, req.body.id], (err,results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败');

        res.cc('更新用户信息成功', 0);
    })
}

// 重置密码处理函数
exports.updatePassword = (req, res) => {
    const sqlSelect = 'select * from ev_users where id=?';
    // 查询用户是否存在
    // 用户身份信息验证成功（解析用户请求的token），会在req上挂载用户信息
    db.query(sqlSelect, req.user.id, (err, results) => {
        if(err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户不存在');
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('原密码错误');
        
        // 更新密码
        // 定义更新密码sql语句
        const sqlUpdate = 'update ev_users set password=? where id=?';
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(sqlUpdate, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新密码失败！');
            res.cc('更新密码成功',0)
        });
    })
}

// 更新用户头像处理函数
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?';
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新头像失败');

        res.cc('更新头像成功', 0);
    })
}