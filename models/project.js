var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
 * _id          项目唯一ID
 * title        项目标题
 * industry     项目所属行业
 * group        项目所属组别
 * authorId     项目创始人ID
 * createTime   项目启动日期
 * updateTime   项目最近更新时间
 * coverUrl     项目封面图片地址
 * teamName     项目队名
 * teamProfile  团队一句话简介
 * likeNum      项目被赞的个数
 * concernNum   项目被关注的个数
 * coinNum      项目共得到的金币个数
 * progress     项目进度 0~100%，队长自行设定数值。
 * description  项目详细描述
 * level        项目级别，1-普通；2-创新；3-精华。（项目初建时均为1级，当管理员认为有一定创新意义时升为2级，
 *              特别推荐的升为3级。在项目列表页，用户可以只看精华项目。2级仅用于后台标记，前台不体现区别）
 * rankScore    项目热度，热度＝赞＋关注×5＋金币。仅用于默认排序，不在前台显示数值
 */
var ProjectSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    industry: {
        type: Number,
        default: -1
    },
    group: {
        type: Number,
        default: -1
    },
    authorId: ObjectId,
    createTime: {
        type: Number,
        default: 0
    },
    updateTime: {
        type: Number,
        default: 0
    },
    members: {
        type: Array,
        default: []
    },
    waitingList: {
        type: Array,
        default: []
    },
    coverUrl: {
        type: String,
        default: ''
    },
    teamName: {
        type: String,
        default: ''
    },
    teamProfile: {
        type: 'String',
        default: ''
    },
    likeNum: {
        type: Number,
        default: 0
    },
    concernNum: {
        type: Number,
        default: 0
    },
    coinNum: {
        type: Number,
        default: 0
    },
    progress: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    level: {
        type: Number,
        default: 1
    },
    rankScore: {
        type: Number,
        default: 0
    }
});

// 添加实例方法
ProjectSchema.methods = {
    sayHello: function() {
        console.log('hello');
    }
};

// 添加静态方法
ProjectSchema.statics = {
    sayWorld: function() {
        console.log('world');
    }
};

//compile schema to model
module.exports = mongoose.model('Project', ProjectSchema, 'ck_projects');