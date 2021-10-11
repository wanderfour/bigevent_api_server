const express = require('express');
const router = express.Router();

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入数据验证规则对象
const {add_cate_schema, del_cate_schema, get_cate_schema, update_cate_schema} = require('../schema/artcate');

// 导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate');

// 获取文章分类路由模块
router.get('/cates', artCate_handler.getArtcileCate);

// 新增文章分类路由
router.post('/addcates', expressJoi(add_cate_schema), artCate_handler.addArticleCate);

// 删除文章分类路由
router.get('/deletecate/:id', expressJoi(del_cate_schema), artCate_handler.deleteCateById);

// 获取文章分类数据路由
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handler.getCateById);

// 更新文章分类数据路由
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handler.updateCateById);


module.exports = router;