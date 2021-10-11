// 文章的处理函数模块

// 导入处理路径的 path 核心模块
const path = require('path');

// 导入数据库连接模块
const db = require('../db/index');

// 发布文章的函数处理模块
exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');

    // 定义文章内容对象
    const articleInfo = {
        // 文章的标题、内容、发布状态、所属分类Id
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id
    }
    // 发布文章
    const sql = 'insert into ev_articles set ?';
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('发布文章失败');
        res.cc('发布文章成功', 0);
    })
}

// 针对不同查询条件拼接sql
const sqlHead = `SELECT
                    art.id as Id,
                    title,
                    pub_date,
                    state,
                    cate.name as cate_name,
                    cate_id
                    FROM 
                    my_db_01.ev_articles as art
                    left join ev_article_cate as cate on cate.id = art.cate_id`

const sqlLimit = ` limit ? offset ?`
const sqlCateid = ` where cate_id = ?`
const sqlState = ` where state = ?`
const sqlCateidState = ` where cate_id = ? and state = ?`

// 获取文章列表处理函数
exports.getArticles = (req, res) => {

    // 判断不同条件下的sql和查询参数
    let sql = '';
    let sqlTotal = '';
    let sqlParams = [];
    let totalParams = [];
    let total = 0;

    if (!req.query.cate_id && !req.query.state) {
        sql = sqlHead + sqlLimit;
        sqlTotal = sqlHead;
        sqlParams = [req.query.pagesize, req.query.pagenum - 1];
    } else if (req.query.cate_id && !req.query.state) {
        sql = sqlHead + sqlCateid + sqlLimit;
        sqlTotal = sqlHead + sqlCateid;
        sqlParams = [req.query.cate_id, req.query.pagesize, req.query.pagenum - 1];
        totalParams = [req.query.cate_id];
    } else if (!req.query.cate_id && req.query.state) {
        sql = sqlHead + sqlState + sqlLimit;
        sqlTotal = sqlHead + sqlState;
        sqlParams = [req.query.state, req.query.pagesize, req.query.pagenum - 1];
        totalParams = [req.query.state];
    } else {
        sql = sqlHead + sqlCateidState + sqlLimit;
        sqlTotal = sqlHead + sqlCateidState;
        sqlParams = [req.query.cate_id, req.query.state, req.query.pagesize, req.query.pagenum - 1];
        totalParams = [req.query.cate_id, req.query.state];
    }
    db.query(sqlTotal, totalParams, (err, results) => {
        if (err) return res.cc(err);
        total = results.length;
        db.query(sql, sqlParams, (err, results) => {
            if (err) return res.cc(err);
            res.send({
                status: 0,
                message: '获取文章列表数据成功',
                data: results,
                total: total
            })
        })

    })

}