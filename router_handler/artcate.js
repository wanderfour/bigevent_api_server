const db = require('../db/index');

// 获取文章分类列表处理函数
exports.getArtcileCate = (req, res) => {
    const sql = 'select id as Id, name, alias, is_delete from ev_article_cate where is_delete=0 order by id';
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);

        res.send({
            status: 0,
            message: '获取文章分类列表成功',
            data: results
        });
    })
}

// 新增文章分类处理函数
// name和alias不能重复，需要查重
exports.addArticleCate = (req, res) => {
    const sql = 'select * from ev_article_cate where name=? or alias=?';
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 0) {
            if (results.length === 1 && results[0].name === req.body.name && results[0].alias !== req.body.alias) return res.cc('分类名称被占用');
            if (results.length === 1 && results[0].name !== req.body.name && results[0].alias === req.body.alias) return res.cc('分类别名被占用');
            return res.cc('分类名称和别名被占用');
        }
        // 插入新增的分类数据
        const sqlInsert = 'insert into ev_article_cate set ?';
        db.query(sqlInsert, req.body, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败');
            res.cc('新增文章分类成功', 0);
        })
    })
}

// 删除文章分类处理函数
exports.deleteCateById = (req, res) => {
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败');
        res.cc('删除文章分类成功', 0);
    })
}

// 获取文章分类数据处理函数
exports.getCateById = (req, res) => {
    const sql = 'select * from ev_article_cate where id=?';
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        console.log(results);
        if (results.length !== 1) return res.cc('获取文章分类数据失败');
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        });
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 查询分类名称与别名是否被占用
    const sql = 'select * from ev_article_cate where id!=? and (name=? or alias=?)';
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length >= 2) return res.cc('分类名称与别名被占用');
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用');
        if (results.length ===1 && results[0].name === req.body.name) return res.cc('分类名称被占用');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用');

        // 更新文章分类数据
        const sql = 'update ev_article_cate set ? where id=?';
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败');

            res.cc('更新文章分类成功');
        })
    })

}