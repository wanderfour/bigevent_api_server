const express = require('express');
const router = express.Router();

// 导入 multer第三方模块，来解析multiple/form-data格式的表单数据
const multer = require('multer');
const path = require('path');

// 引入数据验证中间件
const expressJoi = require('@escook/express-joi');
// 导入验证规则对象
const { add_article_schema, get_article_schema } = require('../schema/article');

// 创建multer实例
// 并定义解析后图片数据存放的路径
const uploads = multer({dest: path.join(__dirname, '../uploads')});

// 导入路由处理函数模块
const article_handler = require('../router_handler/article');

// 发布文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 多个中间件的调用顺序，先解析数据，再做数据验证
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle);

// TODO: 获取文章列表路由
router.get('/list', expressJoi(get_article_schema), article_handler.getArticles);

// TODO: 删除文章列表路由
// TODO: 编辑文章列表路由


module.exports = router;