import data from '../shared/data.json';

export interface GridItem {
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

export interface DivineResult {
    方法: string;
    input: string;
    結論: {
        卦名: string;
        五行: string;
        方位: string;
        特質: string;
        神煞: string;
        意義: string;
    };
    常見用法: {
        尋物: string;
        辦事求職: string;
        感情人際: string;
        疾病身體: string;
    };
    steps?: {
        起點: string;
        中點: string;
    };
}

export const GRID: Record<string, GridItem> = data.grid as Record<string, GridItem>;
export const NINE_GRID: string[] = data.nineGrid;
export const BASE_SIX: string[] = data.baseSix;

const GRID_BY_NAME: Record<string, GridItem> = Object.values(GRID).reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
}, {} as Record<string, GridItem>);

function validateNumber(n: number, name: string, min: number = 1, max: number = 9): void {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
        throw new Error(`${name} 必須是 ${min}-${max} 的整數`);
    }
}

function buildResult(
    resultName: string,
    method: string,
    inputStr: string,
    start: string | null = null,
    step2: string | null = null
): DivineResult {
    const info = GRID_BY_NAME[resultName] || {} as GridItem;

    const response: DivineResult = {
        方法: method,
        input: inputStr,
        結論: {
            卦名: resultName,
            五行: info.五行 || "",
            方位: info.方位 || "",
            特質: info.特質 || "",
            神煞: info.神煞 || "",
            意義: info.意義 || ""
        },
        常見用法: {
            尋物: info.尋物 || "",
            辦事求職: info.辦事求職 || "",
            感情人際: info.感情人際 || "",
            疾病身體: info.疾病身體 || ""
        }
    };

    if (start && step2) {
        response.steps = {
            起點: start,
            中點: step2
        };
    }

    return response;
}

export function divine(n1: number, n2: number, n3: number): DivineResult {
    validateNumber(n1, 'n1');
    validateNumber(n2, 'n2');
    validateNumber(n3, 'n3');

    const startIdx = n1 - 1;
    const start = NINE_GRID[startIdx];

    let step2Idx = (startIdx + n2 - 1) % 9;
    if (step2Idx < 0) step2Idx += 9;
    const step2 = NINE_GRID[step2Idx];

    let finalIdx = (step2Idx + n3 - 1) % 9;
    if (finalIdx < 0) finalIdx += 9;
    const final = NINE_GRID[finalIdx];

    return buildResult(final, '三數起卦', `${n1} → ${n2} → ${n3}`, start, step2);
}

export function divineByTime(month: number, day: number, hour: number): DivineResult {
    validateNumber(month, 'month', 1, 12);
    validateNumber(day, 'day', 1, 30);
    validateNumber(hour, 'hour', 1, 12);

    const startIdx = (month - 1) % 6;
    const start = BASE_SIX[startIdx];

    let step2Idx = (startIdx + day - 1) % 6;
    if (step2Idx < 0) step2Idx += 6;
    const step2 = BASE_SIX[step2Idx];

    let finalIdx = (step2Idx + hour - 1) % 6;
    if (finalIdx < 0) finalIdx += 6;
    const final = BASE_SIX[finalIdx];

    return buildResult(final, '時間起卜', `月=${month}, 日=${day}, 時=${hour}`, start, step2);
}

export function random(): DivineResult {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    const n3 = Math.floor(Math.random() * 9) + 1;
    return divine(n1, n2, n3);
}
