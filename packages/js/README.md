# 小六壬預測系統 (Xiao Liu Ren Divination)

Node.js 版本的中國傳統占卜工具。

## 安裝

```bash
npm install xiao-liuren
```

## 使用方式

### 命令列

```bash
# 安裝依賴
npm install

# 啟動 API 伺服器
npm start

# 或直接測試
node -e "const {XiaoLiuRen}=require('./xiao_liu_ren'); console.log(new XiaoLiuRen().divine(1,7,5))"
```

### Fastify API

```bash
# 啟動伺服器
npm start

# 三數起卦
curl "http://localhost:3006/divine?n1=1&n2=7&n3=5"

# 時間起卜
curl "http://localhost:3006/time?month=1&day=17&hour=1"

# 隨機一卦
curl "http://localhost:3006/random"

# 查詢方位
curl "http://localhost:3006/position?hexagram=大安"
```

### JavaScript API

```javascript
const { XiaoLiuRen } = require('xiao-liuren');

const diviner = new XiaoLiuRen();

// 三數起卦
const result = diviner.divine(1, 7, 5);
console.log(result);

// 時間起卜
const timeResult = diviner.divineByTime(1, 17, 1);
console.log(timeResult);

// 隨機一卦
const randomResult = diviner.random();
console.log(randomResult);
```

## API 接口

| 方法 | 說明 |
|------|------|
| `/divine?n1=&n2=&n3=` | 三數起卦 |
| `/time?month=&day=&hour=` | 時間起卜 |
| `/random` | 隨機一卦 |
| `/position?hexagram=` | 查詢方位 |

## 小六壬九宮格

```
    食指    中指    無名指
上  留連   速喜   病符
中  大安   空亡   赤口
下  桃花   小吉   天德
```

## License

MIT
