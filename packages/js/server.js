/**
 * Fastify API Server - 小六壬預測系統
 * Node.js 版本
 */

const fastify = require('fastify')({ logger: true });
const { XiaoLiuRen } = require('./xiao_liu_ren');

const diviner = new XiaoLiuRen();

// 根路由
fastify.get('/', async (request, reply) => {
    return {
        message: '小六壬 API v1.0.0',
        endpoints: [
            '/divine?n1=1&n2=7&n3=5 - 三數起卦',
            '/time?month=1&day=17&hour=1 - 時間起卜',
            '/random - 隨機一卦',
            '/position?hexagram=大安 - 查詢方位'
        ]
    };
});

// 三數起卦
fastify.get('/divine', async (request, reply) => {
    const { n1, n2, n3 } = request.query;
    
    if (!n1 || !n2 || !n3) {
        return { error: '請提供 n1, n2, n3 三個參數 (1-9)' };
    }
    
    const num1 = parseInt(n1);
    const num2 = parseInt(n2);
    const num3 = parseInt(n3);
    
    if (num1 < 1 || num1 > 9 || num2 < 1 || num2 > 9 || num3 < 1 || num3 > 9) {
        return { error: '參數需為 1-9 的數字' };
    }
    
    return diviner.divine(num1, num2, num3);
});

// 時間起卜
fastify.get('/time', async (request, reply) => {
    const { month, day, hour } = request.query;
    
    if (!month || !day || !hour) {
        return { error: '請提供 month, day, hour 三個參數' };
    }
    
    return diviner.divineByTime(parseInt(month), parseInt(day), parseInt(hour));
});

// 隨機一卦
fastify.get('/random', async (request, reply) => {
    return diviner.random();
});

// 查詢方位
fastify.get('/position', async (request, reply) => {
    const { hexagram } = request.query;
    
    if (!hexagram) {
        return { error: '請提供 hexagram 參數' };
    }
    
    return diviner.getPosition(hexagram);
});

// 啟動伺服器
const start = async () => {
    try {
        await fastify.listen({ port: 3006, host: '0.0.0.0' });
        console.log('小六壬 API 運行中：http://localhost:3006');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
