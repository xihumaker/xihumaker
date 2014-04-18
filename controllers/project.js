var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Util = require('../common/util');
var config = require('../config');
var Project = require('../models/project');

var INDUSTRY_LIST = config.INDUSTRY_LIST;
var GROUP_LIST = config.GROUP_LIST;

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
}

/**
 * @method deleteByValue
 * 根据值删除数组中的某个元素
 * @param {Number} 值
 * @return {Array} 返回一个新数组
 */
Array.prototype.deleteByValue = function(val) {
    return this.deleteByIndex(this.indexOf(val));
}

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

var ProjectModule = {

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
                    "msg": "请求成功",
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
        var title = req.param('title'),
            description = req.param('description') || '',
            industry = req.param('industry') || -1,
            group = req.param('group') || -1,
            authorId = req.signedCookies.xihumaker.userId,
            createTime = Date.now(),
            updateTime = Date.now(),
            teamName = req.param('teamName'),
            teamProfile = req.param('teamProfile'),
            progress = req.param('progress'),
            coverUrl = req.param('coverUrl');

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
     * @method getProjectById
     * 通过Id查找项目信息
     */
    getProjectById: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.render('weixin/projectInfo', {
                "r": 1,
                "errcode": 10015,
                "msg": "项目不存在"
            });
            return;
        }

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('weixin/projectInfo', {
                    "r": 1,
                    "errcode": 10014,
                    "msg": "服务器错误，调用findProjectById方法出错"
                });
                return;
            }

            if ( !! doc) {
                var hasLogin = false; // 保存用户是否已经登录
                var isMyProject = false; // 保存是否是当前登录用户创建的项目
                var hasJoin = false; // 保存用户是否已经加入该项目
                var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
                if ( !! userId) { // 判断用户是否已经登录
                    hasLogin = true;
                    if (doc.authorId == userId) { // 用户已经登录，并且是该项目的创始人
                        isMyProject = true;
                    } else { // 用户已经登录，并且不是该项目的创始人
                        var members = doc.members;
                        if (members.indexOf(userId) !== -1) { // 说明该用户已经加入该项目中
                            hasJoin = true;
                        }
                    }
                }
                doc.localCreateTime = Util.convertDate(doc.createTime);
                doc.localIndustry = INDUSTRY_LIST[doc.industry];
                doc.localGroup = GROUP_LIST[doc.group];

                res.render('weixin/projectInfo', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc,
                    "hasLogin": hasLogin,
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return;
            } else {
                res.render('weixin/projectInfo', {
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
                return;
            }
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
        var query;

        if (!createTime) {
            if (industry == -1 && group == -1) {
                query = Project.find().sort('-createTime').limit(pageSize);
            } else if (industry == -1 && group != -1) {
                query = Project.find({
                    group: group
                }).sort('-createTime').limit(pageSize);
            } else if (industry != -1 && group == -1) {
                query = Project.find({
                    industry: industry
                }).sort('-createTime').limit(pageSize);
            } else if (industry != -1 && group != -1) {
                query = Project.find({
                    industry: industry,
                    group: group
                }).sort('-createTime').limit(pageSize);
            }
        } else {
            if (industry == -1 && group == -1) {
                query = Project.find({
                    createTime: {
                        $lt: createTime
                    }
                }).sort('-createTime').limit(pageSize);
            } else if (industry == -1 && group != -1) {
                query = Project.find({
                    group: group,
                    createTime: {
                        $lt: createTime
                    }
                }).sort('-createTime').limit(pageSize);
            } else if (industry != -1 && group == -1) {
                query = Project.find({
                    industry: industry,
                    createTime: {
                        $lt: createTime
                    }
                }).sort('-createTime').limit(pageSize);
            } else if (industry != -1 && group != -1) {
                query = Project.find({
                    industry: industry,
                    group: group,
                    createTime: {
                        $lt: createTime
                    }
                }).sort('-createTime').limit(pageSize);
            }
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
     * @method joinProjectById
     * 申请加入某个项目
     */
    joinProjectById: function(req, res) {
        var _id = req.param('_id');
        var userId = req.signedCookies.xihumaker.userId;

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10028,
                    "msg": "服务器错误，加入项目失败"
                })
                return;
            }

            if ( !! doc) {
                var members = doc.members;
                if (members.indexOf(userId) !== -1) {
                    res.json({
                        "r": 1,
                        "errcode": 10030,
                        "msg": "你已经在该项目中，不能重复加入"
                    })
                    return;
                } else {
                    members[members.length] = userId;

                    Project.findByIdAndUpdate(_id, {
                        $set: {
                            members: members
                        }
                    }, function(err, doc) {
                        if (err) {
                            res.json({
                                "r": 1,
                                "errcode": 10028,
                                "msg": "服务器错误，加入项目失败"
                            })
                            return;
                        }

                        res.json({
                            "r": 0,
                            "msg": "加入项目成功",
                            "project": doc
                        });
                        return;
                    });
                }
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10029,
                    "msg": "要加入的项目不存在"
                })
                return;
            }
        });

    },

    /**
     * @method quitProjectById
     * 退出项目
     */
    quitProjectById: function(req, res) {
        var _id = req.param('_id');
        var userId = req.signedCookies.xihumaker.userId;

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10031,
                    "msg": "服务器错误，退出项目失败"
                })
                return;
            }

            if ( !! doc) {
                var members = doc.members;
                if (members.indexOf(userId) === -1) {
                    res.json({
                        "r": 1,
                        "errcode": 10032,
                        "msg": "你不在该项目中"
                    });
                    return;
                } else {
                    members = members.deleteByValue(userId);

                    Project.findByIdAndUpdate(_id, {
                        $set: {
                            members: members
                        }
                    }, function(err, doc) {
                        if (err) {
                            res.json({
                                "r": 1,
                                "errcode": 10031,
                                "msg": "服务器错误，退出项目失败"
                            })
                            return;
                        }
                        res.json({
                            "r": 0,
                            "msg": "退出项目成功",
                            "project": doc
                        });
                        return;
                    })
                }
            } else {
                res.json({
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                })
                return;
            }
        });
    },

    getProjectInfoById: function(req, res) {
        var userId = req.signedCookies.xihumaker && req.signedCookies.xihumaker.userId;
        var hasLogin = !! userId;

        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.render('projectInfo', {
                "r": 1,
                "errcode": 10015,
                "msg": "项目不存在",
                "hasLogin": hasLogin
            });
            return;
        }

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('projectInfo', {
                    "r": 1,
                    "errcode": 10014,
                    "msg": "服务器错误，调用findProjectById方法出错",
                    "hasLogin": hasLogin
                });
                return;
            }

            if ( !! doc) {

                var isMyProject = false; // 保存是否是当前登录用户创建的项目
                var hasJoin = false; // 保存用户是否已经加入该项目

                if (hasLogin) {
                    if (doc.authorId == userId) { // 用户已经登录，并且是该项目的创始人
                        isMyProject = true;
                    } else { // 用户已经登录，并且不是该项目的创始人
                        var members = doc.members;
                        if (members.indexOf(userId) !== -1) { // 说明该用户已经加入该项目中
                            hasJoin = true;
                        }
                    }
                }

                doc.localCreateTime = Util.convertDate(doc.createTime);
                doc.localIndustry = INDUSTRY_LIST[doc.industry];
                doc.localGroup = GROUP_LIST[doc.group];
                doc.localProgress = convertProgress(doc.progress);

                res.render('projectInfo', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc,
                    "hasLogin": hasLogin,
                    "isMyProject": isMyProject,
                    "hasJoin": hasJoin
                });
                return;
            } else {
                res.render('projectInfo', {
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在",
                    "hasLogin": hasLogin,
                    "hasJoin": hasJoin
                });
                return;
            }
        });
    },

    showEditProject: function(req, res) {
        var _id = req.param('_id');

        Project.findOne({
            _id: new ObjectId(_id)
        }, function(err, doc) {
            if (err) {
                res.render('editProject', {
                    "r": 1,
                    "errcode": 10037,
                    "msg": "服务器错误，调用showEditProject方法出错",
                    "hasLogin": true
                });
                return;
            }

            if ( !! doc) {
                doc.localCreateTime = Util.convertDate(doc.createTime);
                doc.localIndustry = INDUSTRY_LIST[doc.industry];
                doc.localGroup = GROUP_LIST[doc.group];
                doc.localProgress = convertProgress(doc.progress);

                res.render('editProject', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc,
                    "hasLogin": true
                });
                return;
            } else {
                res.render('editProject', {
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在",
                    "hasJoin": true
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
        var _id = req.params._id;

        var query = Project.find({
            authorId: _id
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
                "msg": "请求成功",
                "projectList": docs
            });
        });
    },

    /**
     * @method searchProjectsByKey
     * 根据用户输入的关键字搜索项目
     */
    searchProjectsByKey: function(req, res) {
        console.log(req.query);
        // 获取关键字
        var q = req.query.q;
        var pageSize = Number(req.query.pageSize);
        var pageStart = Number(req.query.pageStart);

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
    }







};

module.exports = ProjectModule;