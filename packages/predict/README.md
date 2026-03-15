# 小六壬預測系統 (Xiao Liu Ren Divination)

一個簡易的中國傳統占卜工具，基於小六壬算法。

## 功能

- 🔮 三數起卦法（心中默念問題，給出三個數字）
- ⏰ 時間起卜法（農曆月日時）
- 🧧 九宮格對照表
- 📍 尋人尋物方位查詢
- 🎯 常見用法解說

## 安裝

```bash
pip install xiao-liuren-predict
```

## 使用方式

### 命令列

```bash
# 三數起卦
xiao-liuren --n1 1 --n2 7 --n3 5

# 時間起卜
xiao-liuren --month 1 --day 17 --hour 1

# 隨機一卦
xiao-liuren --random
```

### Python API

```python
from xiao_liu_ren import XiaoLiuRen

# 建立實例
diviner = XiaoLiuRen()

# 三數起卦
result = diviner.divine(1, 7, 5)
print(result)

# 時間起卜
result = diviner.divine_by_time(1, 17, 1)
print(result)
```

## API 接口

| 方法 | 說明 |
|------|------|
| `divine(n1, n2, n3)` | 三數起卦 |
| `divine_by_time(month, day, hour)` | 時間起卜 |
| `get_position(hexagram)` | 取得方位 |

## 小六壬九宮格

```
    食指    中指    無名指
上  留連   速喜   病符
中  大安   空亡   赤口
下  桃花   小吉   天德
```

## 常見用法

| 類型 | 適用卦象 | 結論 |
|------|----------|------|
| 尋物/尋人 | 看結論方位 | 東/南/西/北/室內 |
| 辦事求職 | 速喜=快成功 | 留連=拖延 |
| 感情 | 大安=穩定 | 赤口=會吵架 |
| 疾病 | 大安=無礙 | 赤口=需動刀 |

## License

MIT License
