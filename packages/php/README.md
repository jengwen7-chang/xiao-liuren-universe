# 小六壬預測系統 (Xiao Liu Ren Divination)

PHP 版本的中國傳統占卜工具。

## 安裝

```bash
# 直接運行
php -S localhost:3008 index.php
```

或上傳到任何 PHP 伺服器。

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
