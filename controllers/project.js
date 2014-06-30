"use strict";
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Util = require('../common/util');
var config = require('../config');
var Project = require('../models/project');
var ProjectPeople = require('../models/project_people');
var auth = require('../policies/auth');
var INDUSTRY_LIST = config.INDUSTRY_LIST;
var GROUP_LIST = config.GROUP_LIST;
var user = require('./user');


/**
 * @method deleteByIndex
 * 根据索引删除数组中的某个元素
 * @param {Number} 索引
 * @return {Array} 返回一个新数组
 */
Array.prototype.deleteByIndex = function(index) {
    if (index < 0) {
        return this;
    } else {
        return this.slice(0, index).concat(this.slice(index + 1, this.length));
    }　　
};

/**
 * @method deleteByValue
 * 根据值删除数组中的某个元素
 * @param {Number} 值
 * @return {Array} 返回一个新数组
 */
Array.prototype.deleteByValue = function(val) {
    return this.deleteByIndex(this.indexOf(val));
};

/**
 * @method convertProgress
 * 根据进度值返回响应的文本描述
 */
function convertProgress(val) {
    if (val < 10) {
        return 'idea';
    } else if (val >= 10 && val < 20) {
        return '招兵买马';
    } else if (val >= 20 && val < 60) {
        return '火热施工';
    } else if (val >= 60 && val < 80) {
        return '初露曙光';
    } else if (val >= 80 && val <= 99) {
        return '冲刺';
    } else if (val === 100) {
        return '胜利';
    } else {
        return '未知';
    }
}

module.exports = {

    /**
     * @method findProjectById
     * 根据项目ID查找项目信息
     */
    findProjectById: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10014,
                    "msg": "服务器错误，调用findProjectById方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "查找项目信息成功",
                    "project": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
                return;
            }
        });
    },

    /**
     * @method addProject
     * 创建一个新项目
     */
    addProject: function(req, res) {
        var authorId = auth.getUserId(req, res);
        var body = req.body;
        var title = body.title;
        var description = body.description || '';
        var industry = body.industry || -1;
        var group = body.group || -1;
        var createTime = Date.now();
        var updateTime = Date.now();
        var teamName = body.teamName;
        var teamProfile = body.teamProfile;
        var progress = body.progress;
        var coverUrl = body.coverUrl;

        if (!title) {
            res.json({
                "r": 1,
                "errcode": 10016,
                "msg": "项目标题不能为空"
            });
            return;
        }

        var project = new Project({
            title: title,
            description: description,
            industry: industry,
            group: group,
            createTime: createTime,
            authorId: authorId,
            updateTime: updateTime,
            teamName: teamName,
            teamProfile: teamProfile,
            progress: progress,
            coverUrl: coverUrl
        });

        project.save(function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10017,
                    "msg": "服务器错误，创建项目失败"
                });
                return;
            }
            res.json({
                "r": 0,
                "msg": "创建成功",
                "project": doc
            });
            return;
        });
    },

    /**
     * @method showProject
     * 微信端 - 项目详情页
     */
    showProject: function(req, res) {
        var hasLogin = auth.userAuth(req, res);
        var isMyProject = false,
            hasJoin = false,
            userId = null;
        var projectId = req.params._id;
        if (hasLogin) {
            userId = auth.getUserId(req, res);
        }

        Project.findOne({
            _id: new ObjectId(projectId)
        }, function(err, doc) {
            if (err) {
                res.render('weixin/projectInfo', {
                    "r": 1,
                    "errcode": 10096,
                    "msg": "服务器错误，查找项目详情失败",
                    "hasLogin": hasLogin,
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return;
            }

            if ( !! doc) {
                var _doc = doc;

                if (String(doc.authorId) === userId) { // 是项目创始人
                    isMyProject = true;
                    res.render('weixin/projectInfo', {
                        "r": 0,
                        "msg": "请求成功",
                        "project": _doc,
                        "hasLogin": hasLogin,
                        "isMyProject": isMyProject,
                        "hasJoin": hasJoin
                    });
                    return;
                } else { // 非项目创始人
                    ProjectPeople.findOne({
                        belongToProjectId: projectId,
                        belongToUserId: userId
                    }, function(err, doc) {
                        if (err) {
                            res.render('weixin/projectInfo', {
                                "r": 1,
                                "errcode": 10096,
                                "msg": "服务器错误，查找项目详情失败",
                                "hasLogin": hasLogin,
                                "isMyProject": isMyProject,
                                "hasJoin": hasJoin
                            });
                            return;
                        }

                        if ( !! doc) {
                            hasJoin = true;
                        }

                        res.render('weixin/projectInfo', {
                            "r": 0,
                            "msg": "请求成功",
                            "project": _doc,
                            "hasLogin": hasLogin,
                            "isMyProject": isMyProject,
                            "hasJoin": hasJoin
                        });
                        return;
                    });
                }
            } else {
                res.render('weixin/projectInfo', {
                    "r": 1,
                    "errcode": 10097,
                    "msg": "项目不存在或已删除",
                    "hasLogin": hasLogin,
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return;
            }
        });



    },


    findProjects: function(req, res) {
        var pageSize = req.query.pageSize || 12,
            pageStart = req.query.pageStart || 0,
            industry = req.query.industry || -1,
            group = req.query.group || -1,
            progress = req.query.progress,
            level = req.query.level,
            sortBy = req.query.sortBy || 1,
            q = req.query.q;

        var query,
            queryParams = {};

        if (industry != -1) {
            queryParams.industry = industry;
        }
        if (group != -1) {
            queryParams.group = group;
        }
        if ( !! progress) {
            queryParams.progress = progress;
        }
        if ( !! level) {
            queryParams.level = level;
        }

        if ( !! q) {
            var reg = new RegExp(q);
            queryParams.$or = [{
                'title': reg
            }, {
                'description': reg
            }, {
                'teamName': reg
            }];
        }
        console.log(queryParams);

        if (sortBy == 1) { // 按热度排序
            console.log('按热度排序');
            query = Project.find(queryParams).sort('-rankScore').limit(pageSize).skip(pageStart);
        } else if (sortBy == 2) { // 按时间倒序排序
            console.log('按时间倒序排序');
            query = Project.find(queryParams).sort('-createTime').limit(pageSize).skip(pageStart);
        }



        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10025,
                    "msg": "服务器错误，查找问题失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找项目成功",
                "projectList": docs
            });
        });
    },

    /**
     * @method searchProjects
     * 项目高级搜索
     */
    searchProjects: function(req, res) {
        var pageSize = req.param('pageSize') || 12;
        var industry = req.param('industry') || -1;
        var group = req.param('group') || -1;
        var createTime = req.param('createTime');
        var progress = req.param('progress');
        var level = req.param('level');

        var query;
        var queryParams = {};

        if (group != -1) {
            queryParams.group = group;
        }
        if (industry != -1) {
            queryParams.industry = industry;
        }
        if ( !! createTime) {
            queryParams.createTime = {
                $lt: createTime
            };
        }
        if ( !! progress) {
            queryParams.progress = progress;
        }
        if ( !! level) {
            queryParams.level = level;
        }

        query = Project.find(queryParams).sort('-createTime').limit(pageSize);

        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10025,
                    "msg": "服务器错误，查找问题失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "查找项目成功",
                "projectList": docs
            });
        });
    },

    /**
     * @method showProjectInfo
     * Web端 - 项目详情页面
     */
    showProjectInfo: function(req, res) {
        var hasLogin = auth.userAuth(req, res);
        var isMyProject = false;
        var hasJoin = false;
        var userId = null;
        var projectId = req.params._id;

        if (hasLogin) {
            userId = auth.getUserId(req, res);
        }

        var errFun = function(err) {
            if (err) {
                res.render('projectInfo', {
                    "r": 1,
                    "errcode": 10096,
                    "msg": "服务器错误，查找项目详情失败",
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return true;
            }
        };

        Project.findOne({
            _id: new ObjectId(projectId)
        }, function(err, doc) {
            if (errFun(err)) {
                return;
            }

            if ( !! doc) {
                var _doc = doc;

                if (String(doc.authorId) === userId) { // 是项目创始人
                    isMyProject = true;
                    res.render('projectInfo', {
                        "r": 0,
                        "msg": "请求成功",
                        "project": _doc,
                        "isMyProject": isMyProject,
                        "hasJoin": hasJoin
                    });
                    return;
                } else { // 非项目创始人
                    ProjectPeople.findOne({
                        belongToProjectId: projectId,
                        belongToUserId: userId
                    }, function(err, doc) {
                        if (errFun(err)) {
                            return;
                        }

                        if ( !! doc) {
                            hasJoin = true;
                        }

                        res.render('projectInfo', {
                            "r": 0,
                            "msg": "请求成功",
                            "project": _doc,
                            "isMyProject": isMyProject,
                            "hasJoin": hasJoin
                        });
                        return;
                    });
                }
            } else {
                res.render('projectInfo', {
                    "r": 1,
                    "errcode": 10097,
                    "msg": "项目不存在或已删除",
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return;
            }
        });
    },

    /**
     * @method showEditProject
     * 显示项目编辑页面
     */
    showEditProject: function(req, res) {
        var _id = req.param('_id');

        if (_id.length !== 24) {
            res.render('editProject', {
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
            return;
        }

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('editProject', {
                    "r": 1,
                    "errcode": 10037,
                    "msg": "服务器错误，调用showEditProject方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.render('editProject', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc
                });
                return;
            } else {
                res.render('editProject', {
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
                return;
            }
        });
    },

    /**
     * @method findProjectByIdAndUpdate
     * 通过项目Id来修改某个项目
     */
    findProjectByIdAndUpdate: function(req, res) {
        var _id = req.params._id;
        var body = req.body;
        var title = body.title;
        var description = body.description;
        var industry = Number(body.industry);
        var group = Number(body.group);
        var teamName = body.teamName;
        var teamProfile = body.teamProfile;
        var progress = Number(body.progress);
        var coverUrl = body.coverUrl;
        var updateTime = Date.now();

        Project.findByIdAndUpdate(_id, {
            $set: {
                title: title,
                description: description,
                industry: industry,
                group: group,
                teamName: teamName,
                teamProfile: teamProfile,
                progress: progress,
                coverUrl: coverUrl,
                updateTime: updateTime
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10038,
                    "msg": "服务器错误，调用findProjectByIdAndUpdate方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.json({
                    "r": 0,
                    "msg": "修改成功",
                    "project": doc
                });
                return;
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
                return;
            }
        });
    },

    /**
     * @method findProjectByIdAndRemove
     * 根据ID查找项目并且删除找到的项目
     */
    findProjectByIdAndRemove: function(req, res) {
        var _id = req.param('_id');

        Project.findByIdAndRemove(_id, {

        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10039,
                    "msg": "服务器错误，删除项目失败"
                });
                return;
            }

            if (doc) {
                res.json({
                    "r": 0,
                    "msg": "删除成功",
                    "project": doc
                });
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
            }
        });
    },

    /**
     * @method findProjectsByUserId
     * 获取某个用户发起的项目
     */
    findProjectsByUserId: function(req, res) {
        var userId = req.params._id;

        var query = Project.find({
            authorId: userId
        }).sort('-createTime');

        query.exec(function(err, docs) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10040,
                    "msg": "服务器错误，获取当前请求用户创建的项目失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "获取用户发起的项目成功",
                "projectList": docs
            });
        });
    },

    /**
     * @method searchProjectsByKey
     * 根据用户输入的关键字搜索项目
     */
    searchProjectsByKey: function(req, res) {
        var q = req.query.q;
        var pageSize = Number(req.query.pageSize) || 12;
        var pageStart = Number(req.query.pageStart) || 0;

        if (!q) {
            res.json({
                "r": 1,
                "errcode": 10041,
                "msg": "搜索关键字为空"
            });
            return;
        }

        var reg = new RegExp(q);

        var query = Project.find({
            '$or': [{
                'title': reg
            }, {
                'description': reg
            }]
        }).sort('-createTime').limit(pageSize).skip(pageStart);

        Project.count({
            '$or': [{
                'title': reg
            }, {
                'description': reg
            }]
        }, function(err, count) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10041,
                    "msg": "服务器错误，搜索项目失败"
                });
                return;
            }

            query.exec(function(err, docs) {
                if (err) {
                    res.json({
                        "r": 1,
                        "errcode": 10041,
                        "msg": "服务器错误，搜索项目失败"
                    });
                    return;
                }

                res.json({
                    "r": 0,
                    "msg": "请求成功",
                    "projectList": docs,
                    "total": count
                });
            });
        });
    },

    /**
     * @method updateProjectLevel
     * 项目 - 设置项目级别，1-普通；2-创新；3-精华
     */
    updateProjectLevel: function(req, res) {
        var projectId = req.params._id,
            level = req.body.level;

        Project.findByIdAndUpdate(projectId, {
            $set: {
                level: level
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10108,
                    "msg": "服务器错误，更新项目级别失败"
                });
                return;
            }

            res.json({
                "r": 0,
                "msg": "更新成功",
                "project": doc
            });
        });
    }






};