/**
 * 小六壬預測系統 (Xiao Liu Ren Divination) - v1.2.0
 * TypeScript 版本
 */

import { divine as coreDivine, divineByTime as coreDivineByTime, random as coreRandom, GRID, NINE_GRID, BASE_SIX } from '../core/divine';

interface GridItem {
    name: string;
    五行: string;
    方位: string;
    特質: string;
    神煞: string;
    意義: string;
    尋物: string;
    辦事求職: string;
    感情人際: string;
    疾病身體: string;
}

/**
 * 驗證數字是否在有效範圍內
 */
function validateNumber(n: number, name: string, min: number = 1, max: number = 9): void {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
        throw new Error(`${name} 必須是 ${min}-${max} 的整數`);
    }
}

class XiaoLiuRen {
    /**
     * 三數起卦法
     */
    divine(n1: number, n2: number, n3: number): object {
        validateNumber(n1, 'n1');
        validateNumber(n2, 'n2');
        validateNumber(n3, 'n3');
        return coreDivine(n1, n2, n3);
    }

    /**
     * 時間起卜法
     */
    divineByTime(month: number, day: number, hour: number): object {
        validateNumber(month, 'month', 1, 12);
        validateNumber(day, 'day', 1, 30);
        validateNumber(hour, 'hour', 1, 12);
        return coreDivineByTime(month, day, hour);
    }

    /**
     * 隨機一卦
     */
    random(): object {
        return coreRandom();
    }
}

export { XiaoLiuRen, GRID, NINE_GRID, BASE_SIX };

// Fastify server
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });
const diviner = new XiaoLiuRen();

fastify.get('/', async () => ({
    message: '小六壬 API v1.2.0',
    endpoints: [
        '/divine?n1=1&n2=7&n3=5 - 三數起卦',
        '/time?month=1&day=17&hour=1 - 時間起卜',
        '/random - 隨機一卦'
    ]
}));

fastify.get('/divine', async (request) => {
    const { n1, n2, n3 } = request.query as { n1?: string; n2?: string; n3?: string };
    if (!n1 || !n2 || !n3) {
        return { error: '請提供 n1, n2, n3 (1-9 的整數)' };
    }
    try {
        return diviner.divine(parseInt(n1), parseInt(n2), parseInt(n3));
    } catch (e: any) {
        return { error: e.message };
    }
});

fastify.get('/time', async (request) => {
    const { month, day, hour } = request.query as { month?: string; day?: string; hour?: string };
    if (!month || !day || !hour) {
        return { error: '請提供 month (1-12), day (1-30), hour (1-12)' };
    }
    try {
        return diviner.divineByTime(parseInt(month), parseInt(day), parseInt(hour));
    } catch (e: any) {
        return { error: e.message };
    }
});

fastify.get('/random', async () => diviner.random());

const start = async () => {
    try {
        await fastify.listen({ port: 3008 });
        console.log('小六壬 API 運行中：http://localhost:3008');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
