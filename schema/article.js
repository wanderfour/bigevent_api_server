const joi = require('joi');

// 定义验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
// allow('') 允许空字符串，应用于草稿的场景
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();
;
// 发布文章验证规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

// 定义验证规则
const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();
const cate_id1 = joi.number().integer().min(1).allow('');
const state1 = joi.string().valid('已发布', '草稿').allow('');


// 获取文章验证规则对象
exports.get_article_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: cate_id1,
        state: state1
    }
}