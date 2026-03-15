/**
 * 小六壬預測系統 (Xiao Liu Ren Divination) - v1.1.0
 * TypeScript 版本
 */

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

const GRID: Record<number, GridItem> = {
    1: { name: "留連", 五行: "水", 方位: "西南", 特質: "停止，反復", 神煞: "玄武", 意義: "延宕", 尋物: "東西藏在某處，需要耐心找", 辦事求職: "事情會卡住", 感情人際: "難以割捨", 疾病身體: "需要長期調養" },
    2: { name: "大安", 五行: "木", 方位: "正東", 特質: "長期、緩慢、穩定", 神煞: "青龍", 意義: "吉利", 尋物: "東西就在家裡", 辦事求職: "順利穩定", 感情人際: "感情穩定", 疾病身體: "身體無大礙" },
    3: { name: "桃花", 五行: "土", 方位: "東北", 特質: "欲望、牽絆、異性", 神煞: "紅鸞", 意義: "感情", 尋物: "東西藏在熱鬧場所", 辦事求職: "靠人脈關係", 感情人際: "有戀情機會", 疾病身體: "注意泌尿系統" },
    4: { name: "速喜", 五行: "火", 方位: "正南", 特質: "驚喜、快速、突然", 神煞: "朱雀", 意義: "喜慶", 尋物: "很快就會找到", 辦事求職: "會非常快得到好消息", 感情人際: "彼此有火花", 疾病身體: "康復快速" },
    5: { name: "空亡", 五行: "土", 方位: "內", 特質: "失去、虛偽、空想", 神煞: "勾陳", 意義: "虛驚", 尋物: "東西找不到了", 辦事求職: "一場空", 感情人際: "對方心意不明", 疾病身體: "需要多注意" },
    6: { name: "小吉", 五行: "水", 方位: "正北", 特質: "起步、不多、尚可", 神煞: "六合", 意義: "貴人", 尋物: "會有貴人幫你找到", 辦事求職: "有貴人相助", 感情人際: "有好的發展機會", 疾病身體: "逐漸好轉" },
    7: { name: "病符", 五行: "金", 方位: "西南", 特質: "病態異常、治療", 神煞: "凶煞", 意義: "疾病", 尋物: "東西可能在醫療院所", 辦事求職: "身體不適", 感情人際: "對方身體有恙", 疾病身體: "需要看醫生" },
    8: { name: "赤口", 五行: "金", 方位: "正西", 特質: "吵架、打架、鬥爭", 神煞: "白虎", 意義: "口舌糾紛", 尋物: "可能已經遺失", 辦事求職: "容易有口舌是非", 感情人際: "容易吵架", 疾病身體: "可能需要動刀" },
    9: { name: "天德", 五行: "金", 方位: "西北", 特質: "貴人、上司、高遠", 神煞: "天德貴人", 意義: "吉祥", 尋物: "有貴人幫忙找回", 辦事求職: "紫微降臨，求人辦事", 感情人際: "有長輩撮合", 疾病身體: "有福報" }
};

// 建立 name -> GRID 的映射以提高查找效率
const GRID_BY_NAME: Record<string, GridItem> = Object.values(GRID).reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
}, {} as Record<string, GridItem>);

const NINE_GRID = ["留連", "大安", "桃花", "速喜", "空亡", "小吉", "病符", "赤口", "天德"];
const BASE_SIX = ["大安", "留連", "速喜", "赤口", "小吉", "空亡"];

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
        // 輸入驗證
        validateNumber(n1, 'n1');
        validateNumber(n2, 'n2');
        validateNumber(n3, 'n3');

        const startIdx = n1 - 1;
        const start = NINE_GRID[startIdx];
        
        const step2Idx = (startIdx + n2) % 9;
        const step2 = NINE_GRID[step2Idx];
        
        const finalIdx = (step2Idx + n3) % 9;
        const final = NINE_GRID[finalIdx];
        
        const info = GRID_BY_NAME[final];
        
        return {
            方法: "三數起卦",
            input: `${n1} → ${n2} → ${n3}`,
            結論: {
                卦名: final,
                五行: info.五行,
                方位: info.方位,
                特質: info.特質,
                神煞: info.神煞,
                意義: info.意義
            },
            常見用法: {
                尋物: info.尋物,
                辦事求職: info.辦事求職,
                感情人際: info.感情人際,
                疾病身體: info.疾病身體
            },
            steps: {
                起點: start,
                中點: step2
            }
        };
    }

    /**
     * 時間起卜法
     */
    divineByTime(month: number, day: number, hour: number): object {
        // 輸入驗證
        validateNumber(month, 'month', 1, 12);
        validateNumber(day, 'day', 1, 30);
        validateNumber(hour, 'hour', 1, 12);

        const idx = (month + day + hour - 2) % 6;
        const result = BASE_SIX[idx];
        const info = GRID_BY_NAME[result];
        
        return {
            方法: "時間起卜",
            input: `月=${month}, 日=${day}, 時=${hour}`,
            結論: {
                卦名: result,
                五行: info.五行,
                方位: info.方位,
                特質: info.特質,
                神煞: info.神煞,
                意義: info.意義
            },
            常見用法: {
                尋物: info.尋物,
                辦事求職: info.辦事求職,
                感情人際: info.感情人際,
                疾病身體: info.疾病身體
            }
        };
    }

    /**
     * 隨機一卦
     */
    random(): object {
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        const n3 = Math.floor(Math.random() * 9) + 1;
        return this.divine(n1, n2, n3);
    }
}

export { XiaoLiuRen, GRID, NINE_GRID, BASE_SIX };

// Fastify server
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });
const diviner = new XiaoLiuRen();

fastify.get('/', async () => ({
    message: '小六壬 API v1.1.0',
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
