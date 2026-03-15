# 小六壬預測系統 (Xiao Liu Ren Divination)

Go 版本的中國傳統占卜工具。

## 安裝

```bash
go run main.go
```

## 使用方式

```bash
# 編譯
go build -o xiao-liuren main.go

# 執行
./xiao-liuren
```

## API 接口

```bash
# 三數起卦
curl "http://localhost:3007/divine?n1=1&n2=7&n3=5"

# 時間起卜
curl "http://localhost:3007/time?month=1&day=17&hour=1"

# 隨機一卦
curl "http://localhost:3007/random"
```

## License

MIT
