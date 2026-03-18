/**
 * 小六壬預測系統 (Xiao Liu Ren Divination) - v1.2.0
 * Node.js 版本
 */

const { grid, gridByName, nineGrid, baseSix } = require('../shared/data');

/**
 * 驗證數字是否在有效範圍內
 */
function validateNumber(n, name, min = 1, max = 9) {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
        throw new Error(`${name} 必須是 ${min}-${max} 的整數`);
    }
}

/**
 * 小六壬占卜類
 */
class XiaoLiuRen {
    /**
     * 三數起卦法
     * @param {number} n1 - 第一個數字 (1-9)
     * @param {number} n2 - 第二個數字 (1-9)
     * @param {number} n3 - 第三個數字 (1-9)
     * @returns {object} 占卜結果
     */
    divine(n1, n2, n3) {
        validateNumber(n1, 'n1');
        validateNumber(n2, 'n2');
        validateNumber(n3, 'n3');

        const startIdx = n1 - 1;
        const start = nineGrid[startIdx];

        let step2Idx = (startIdx + n2 - 1) % 9;
        if (step2Idx < 0) step2Idx += 9;
        const step2 = nineGrid[step2Idx];

        let finalIdx = (step2Idx + n3 - 1) % 9;
        if (finalIdx < 0) finalIdx += 9;
        const final = nineGrid[finalIdx];

        return this._buildResult(final, `${n1} → ${n2} → ${n3}`, start, step2);
    }

    /**
     * 時間起卜法
     * @param {number} month - 農曆月 (1-12)
     * @param {number} day - 農曆日 (1-30)
     * @param {number} hour - 農曆時 (1-12)
     * @returns {object} 占卜結果
     */
    divineByTime(month, day, hour) {
        validateNumber(month, 'month', 1, 12);
        validateNumber(day, 'day', 1, 30);
        validateNumber(hour, 'hour', 1, 12);

        const startIdx = (month - 1) % 6;
        const start = baseSix[startIdx];

        let step2Idx = (startIdx + day - 1) % 6;
        if (step2Idx < 0) step2Idx += 6;
        const step2 = baseSix[step2Idx];

        let finalIdx = (step2Idx + hour - 1) % 6;
        if (finalIdx < 0) finalIdx += 6;
        const final = baseSix[finalIdx];

        return this._buildResult(final, `月=${month}, 日=${day}, 時=${hour}`, start, step2);
    }

    /**
     * 取得方位
     * @param {string} hexagram - 卦名
     * @returns {object} 方位資訊
     */
    getPosition(hexagram) {
        const info = gridByName[hexagram];
        if (!info) {
            return { error: "找不到該卦" };
        }
        return {
            卦名: hexagram,
            方位: info.方位,
            說明: info.尋物
        };
    }

    /**
     * 隨機一卦
     * @returns {object} 占卜結果
     */
    random() {
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        const n3 = Math.floor(Math.random() * 9) + 1;
        return this.divine(n1, n2, n3);
    }

    _buildResult(result, inputStr, start = null, step2 = null) {
        const info = gridByName[result] || {};

        const response = {
            方法: start ? "三數起卦" : "時間起卜",
            input: inputStr,
            結論: {
                卦名: result,
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
            response.steps = { 起點: start, 中點: step2 };
        }

        return response;
    }
}

module.exports = { XiaoLiuRen, grid, nineGrid, baseSix };
