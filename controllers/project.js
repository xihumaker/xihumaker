var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

var Util = require('../common/util');
var config = require('../config');
var Project = require('../models/project');

var INDUSTRY_LIST = config.INDUSTRY_LIST;
var GROUP_LIST = config.GROUP_LIST;

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
            purpose = req.param('purpose') || '',
            solution = req.param('solution') || '',
            teamInfo = req.param('teamInfo') || '',
            authorId = req.session.userId;

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
            purpose: purpose,
            solution: solution,
            teamInfo: teamInfo,
            createTime: Date.now(),
            authorId: authorId
        });

        console.log(project);

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
                console.log(doc);
                doc.localCreateTime = Util.convertDate(doc.createTime);

                if (doc.authorId == req.session.userId) {
                    doc.myProject = true;
                } else {
                    doc.myProject = false;
                    var members = doc.members;
                    if (members.indexOf(req.session.userId) !== -1) { //说明该用户已经加入该项目中
                        doc.hasJoin = true;
                    } else { // 说明用户未加入该项目
                        doc.hasJoin = false;
                    }
                }
                doc.localIndustry = INDUSTRY_LIST[doc.industry];
                doc.localGroup = GROUP_LIST[doc.group];
                res.render('weixin/projectInfo', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc
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
     * @method findProjectsByPage
     * 分页查询项目
     * 如果createTime为空，则说明用户是第一次查询，回前pageSize条数据
     * 如果createTime不为空，则根据pageSize和createTime返回pageSize条数据
     */
    findProjectsByPage: function(req, res) {
        var pageSize = req.param('pageSize'),
            createTime = req.param('createTime'),
            query;

        if (!pageSize) {
            res.json({
                "r": 1,
                "errcode": 10000,
                "msg": "参数错误"
            });
        }
        if (!createTime) {
            // sort('-createTime')，最新的先返回
            // sort('createTime'),最早的先返回
            query = Project.find().sort('-createTime').limit(pageSize);
        } else {
            query = Project.find({
                createTime: {
                    $lt: createTime
                }
            }).sort('-createTime').limit(pageSize);
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
        var pageSize = req.param('pageSize') || 3;
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
     * @method editProjectById
     * 通过项目Id来修改某个项目
     */
    editProjectById: function(req, res) {
        var _id = req.param('_id') || '';
        if (_id.length !== 24) {
            res.render('weixin/editProject', {
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
                res.render('weixin/editProject', {
                    "r": 1,
                    "errcode": 10022,
                    "msg": "服务器错误，调用editProjectById方法出错"
                });
                return;
            }

            if ( !! doc) {
                res.render('weixin/editProject', {
                    "r": 0,
                    "msg": "请求成功",
                    "project": doc
                });
                return;
            } else {
                res.render('weixin/editProject', {
                    "r": 1,
                    "errcode": 10015,
                    "msg": "项目不存在"
                });
                return;
            }
        });
    },

    findProjectByIdAndUpdate: function(req, res) {
        var _id = req.param('_id'),
            title = req.param('title'),
            description = req.param('description') || '',
            industry = req.param('industry') || -1,
            group = req.param('group') || -1,
            purpose = req.param('purpose') || '',
            solution = req.param('solution') || '',
            teamInfo = req.param('teamInfo') || '';

        if (!title) {
            res.json({
                "r": 1,
                "errcode": 10016,
                "msg": "项目标题不能为空"
            });
            return;
        }
        if (!description) {
            res.json({
                "r": 1,
                "errcode": 10027,
                "msg": "项目简介不能为空"
            });
            return;
        }

        Project.findByIdAndUpdate(_id, {
            $set: {
                title: title,
                description: description,
                industry: industry,
                group: group,
                purpose: purpose,
                solution: solution,
                teamInfo: teamInfo,
                updateTime: Date.now()
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    "r": 1,
                    "errcode": 10026,
                    "msg": "服务器错误，更新项目失败"
                });
                return;
            }
            res.json({
                "r": 0,
                "msg": "修改成功",
                "project": doc
            });
            return;
        });
    },

    /**
     * @method joinProjectById
     * 申请加入某个项目
     */
    joinProjectById: function(req, res) {
        var _id = req.param('_id');
        var userId = req.session.userId;

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

    }



};

module.exports = ProjectModule;