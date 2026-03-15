# 小六壬預測系統 (Xiao Liu Ren Divination)

TypeScript 版本的中國傳統占卜工具。

## 安裝

```bash
npm install
```

## 使用方式

```bash
# 啟動開發伺服器
npm run dev

# 編譯
npm run build

# 啟動生產伺服器
npm start
```

## API 接口

```bash
# 三數起卦
curl "http://localhost:3008/divine?n1=1&n2=7&n3=5"

# 時間起卜
curl "http://localhost:3008/time?month=1&day=17&hour=1"

# 隨機一卦
curl "http://localhost:3008/random"
```

## License

MIT
