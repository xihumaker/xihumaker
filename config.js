/**
 * 项目配置文件
 *
 * MONGODB_IP: 			MongoDB数据库服务器IP地址
 * MONGODB_DATABASE: 	MongoDB数据库名字
 * WEB_SERVER_PORT: 	Web服务器端口号，发布80
 * TOKEN                微信TOKEN
 * ADMIN_ACCOUNT        西湖创客汇后台管理员账号
 * INDUSTRY_LIST        行业分类
 * GROUP_LIST           组别分类
 */
module.exports = {
    MONGODB_IP: "127.0.0.1",
    MONGODB_DATABASE_NAME: "xihumaker",
    WEB_SERVER_IP: 'xihumaker.jios.org',
    QINIU_ACCESS_KEY: 'nrcu5P6P671pB3ujgNdEe34It3ajrILnEQD5EmKD',
    QINIU_SECRET_KEY: 'y0as1N68ZRiTqLK_QRnwMxVAitj6Rlu1D57F1MO4',
    QINIU_Bucket_Name: 'xihumakertest',
    WEB_SERVER_PORT: 80,
    TOKEN: 'xihumaker',

    ADMIN_ACCOUNT: {
        username: 'admin',
        password: '123456'
    },

    INDUSTRY_LIST: {
        '-1': '全部行业',
        '1001': '时尚科技',
        '1002': '创意设计',
        '1003': '自然环境',
        '1004': '智慧城市',
        '1005': '文艺生活',
        '1006': '医疗健康',
        '1007': '运动休闲',
        '1008': '敬老爱幼',
        '1009': '表达传播'
    },

    GROUP_LIST: {
        '-1': '全部组别',
        '2001': '杭州电子科技大学',
        '2002': '中国计量学院',
        '2003': '杭州分舵',
        '2004': '洛阳分舵'
    },

    PROJECT_STATUS: {
        '1': 'idea',
        '2': '招兵买马',
        '3': '火热施工',
        '4': '初露曙光',
        '5': '冲刺',
        '6': '胜利'
    }
}