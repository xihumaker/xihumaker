/**
 * 项目配置文件
 *
 * MONGODB_IP: 			MongoDB数据库服务器IP地址
 * MONGODB_DATABASE: 	MongoDB数据库名字
 * WEB_SERVER_PORT: 	Web服务器端口号，发布80，测试8080
 *
 */
module.exports = {
    MONGODB_IP: "127.0.0.1",
    MONGODB_DATABASE_NAME: "xihumaker",
    WEB_SERVER_IP: 'xihumaker.jios.org',
    WEB_SERVER_PORT: 80,
    TOKEN: 'xihumaker',

    // 行业分类
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

    // 组别分类
    GROUP_LIST: {
        '-1': '全部组别',
        '2001': '杭州电子科技大学',
        '2002': '中国计量学院',
        '2003': '杭州分舵',
        '2004': '洛阳分舵'
    }
}