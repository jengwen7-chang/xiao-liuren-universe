#!/usr/bin/env python3
"""
小六壬預測系統 (Xiao Liu Ren Divination) - v1.1.0
一個簡易的中國傳統占卜工具
"""

__version__ = "1.1.0"
__author__ = "Alex Family"

# ==================== 小六壬完整資料 ====================

class XiaoLiuRen:
    """小六壬占卜"""
    
    # 九宮格對照表
    GRID = {
        1: {"name": "留連", "五行": "水", "方位": "西南", "特質": "停止、反復", "神煞": "玄武", "意義": "延宕",
            "尋物": "東西藏在某處，需要耐心找", "辦事求職": "事情會卡住，對方會一直拖延", "感情人際": "難以割捨", "疾病身體": "需要長期調養"},
        2: {"name": "大安", "五行": "木", "方位": "正東", "特質": "長期、緩慢、穩定", "神煞": "青龍", "意義": "吉利",
            "尋物": "東西就在家裡，或是很安全的地方", "辦事求職": "順利穩定，但需要時間", "感情人際": "感情穩定，對方是真心的", "疾病身體": "身體無大礙，靜養即可"},
        3: {"name": "桃花", "五行": "土", "方位": "東北", "特質": "欲望、牽絆、異性", "神煞": "紅鸞", "意義": "感情",
            "尋物": "東西藏在熱鬧場所或人身邊", "辦事求職": "靠人脈關係", "感情人際": "有戀情機會", "疾病身體": "注意泌尿系統"},
        4: {"name": "速喜", "五行": "火", "方位": "正南", "特質": "驚喜、快速、突然", "神煞": "朱雀", "意義": "喜慶",
            "尋物": "很快就會找到或有消息", "辦事求職": "會非常快得到好消息", "感情人際": "彼此有火花，適合主動聯絡", "疾病身體": "康復快速"},
        5: {"name": "空亡", "五行": "土", "方位": "內", "特質": "失去、虛偽、空想", "神煞": "勾陳", "意義": "虛驚",
            "尋物": "東西找不到了，或是已經損壞", "辦事求職": "一場空，努力可能白費", "感情人際": "對方心意不明或已經放棄", "疾病身體": "比較麻煩，需要多注意"},
        6: {"name": "小吉", "五行": "水", "方位": "正北", "特質": "起步、不多、尚可", "神煞": "六合", "意義": "貴人",
            "尋物": "東西在外面，會有貴人幫你找到", "辦事求職": "有貴人相助，可嘗試", "感情人際": "有好的發展機會", "疾病身體": "逐漸好轉"},
        7: {"name": "病符", "五行": "金", "方位": "西南", "特質": "病態異常、治療", "神煞": "凶煞", "意義": "疾病",
            "尋物": "東西可能在醫療院所", "辦事求職": "身體不適，運勢較弱", "感情人際": "對方身體有恙或心情不好", "疾病身體": "需要看醫生治療"},
        8: {"name": "赤口", "五行": "金", "方位": "正西", "特質": "吵架、打架、鬥爭", "神煞": "白虎", "意義": "口舌糾紛",
            "尋物": "可能已經遺失或被撿走", "辦事求職": "容易有口舌是非", "感情人際": "兩個人現在火氣很大", "疾病身體": "可能需要動刀"},
        9: {"name": "天德", "五行": "金", "方位": "西北", "特質": "貴人、上司、高遠", "神煞": "天德貴人", "意義": "吉祥",
            "尋物": "有貴人幫忙找回", "辦事求職": "紫微降臨，求人辦事，靠人成事", "感情人際": "有長輩或上司撮合", "疾病身體": "有福報，能康復"}
    }
    
    # 基礎六爻
    BASE_SIX = ["大安", "留連", "速喜", "赤口", "小吉", "空亡"]
    
    # 九宮格順序
    NINE_GRID = ["留連", "大安", "桃花", "速喜", "空亡", "小吉", "病符", "赤口", "天德"]
    
    def __init__(self):
        pass
    
    def _validate_number(self, n: int, name: str) -> None:
        """驗證數字是否在 1-9 範圍內"""
        if not isinstance(n, int) or n < 1 or n > 9:
            raise ValueError(f"{name} 必須是 1-9 的整數")
    
    def _validate_time_params(self, month: int, day: int, hour: int) -> None:
        """驗證時間參數"""
        if not isinstance(month, int) or month < 1 or month > 12:
            raise ValueError("月份必須是 1-12 的整數")
        if not isinstance(day, int) or day < 1 or day > 30:
            raise ValueError("日必須是 1-30 的整數")
        if not isinstance(hour, int) or hour < 1 or hour > 12:
            raise ValueError("時必須是 1-12 的整數")
    
    def divine(self, n1: int, n2: int, n3: int) -> dict:
        """
        三數起卦法
        n1: 第一個數字 (1-9)
        n2: 第二個數字 (1-9)
        n3: 第三個數字 (1-9)
        """
        # 輸入驗證
        self._validate_number(n1, "n1")
        self._validate_number(n2, "n2")
        self._validate_number(n3, "n3")
        
        # Step 1: 起點
        start_idx = n1 - 1
        start = self.NINE_GRID[start_idx]
        
        # Step 2: 從起點數 n2 步
        step2_idx = (start_idx + n2) % 9
        step2 = self.NINE_GRID[step2_idx]
        
        # Step 3: 從中點數 n3 步
        final_idx = (step2_idx + n3) % 9
        final = self.NINE_GRID[final_idx]
        
        return self._build_result(final, f"{n1} → {n2} → {n3}", start, step2)
    
    def divine_by_time(self, month: int, day: int, hour: int) -> dict:
        """
        時間起卜法
        month: 農曆月
        day: 農曆日
        hour: 農曆時
        """
        # 輸入驗證
        self._validate_time_params(month, day, hour)
        
        idx = (month + day + hour - 2) % 6
        result = self.BASE_SIX[idx]
        return self._build_result(result, f"月={month}, 日={day}, 時={hour}")
    
    def get_position(self, hexagram: str) -> dict:
        """取得方位"""
        for info in self.GRID.values():
            if info["name"] == hexagram:
                return {
                    "卦名": hexagram,
                    "方位": info.get("方位", ""),
                    "說明": info.get("尋物", "")
                }
        return {"error": "找不到該卦"}
    
    def _build_result(self, result: str, input_str: str, start: str = None, step2: str = None) -> dict:
        """建構結果"""
        info = None
        for g in self.GRID.values():
            if g["name"] == result:
                info = g
                break
        
        if not info:
            return {"error": "無效的結果"}
        
        response = {
            "方法": "三數起卦" if start else "時間起卜",
            "input": input_str,
            "結論": {
                "卦名": result,
                "五行": info.get("五行", ""),
                "方位": info.get("方位", ""),
                "特質": info.get("特質", ""),
                "神煞": info.get("神煞", ""),
                "意義": info.get("意義", "")
            },
            "常見用法": {
                "尋物": info.get("尋物", ""),
                "辦事求職": info.get("辦事求職", ""),
                "感情人際": info.get("感情人際", ""),
                "疾病身體": info.get("疾病身體", "")
            }
        }
        
        if start and step2:
            response["steps"] = {
                "起點": start,
                "中點": step2
            }
        
        return response


def main():
    """命令列介面"""
    import argparse
    
    parser = argparse.ArgumentParser(description="小六壬占卜")
    parser.add_argument("--n1", type=int, help="第一個數字 (1-9)")
    parser.add_argument("--n2", type=int, help="第二個數字 (1-9)")
    parser.add_argument("--n3", type=int, help="第三個數字 (1-9)")
    parser.add_argument("--month", type=int, help="農曆月 (1-12)")
    parser.add_argument("--day", type=int, help="農曆日 (1-30)")
    parser.add_argument("--hour", type=int, help="農曆時 (1-12)")
    parser.add_argument("--random", action="store_true", help="隨機一卦")
    
    args = parser.parse_args()
    
    diviner = XiaoLiuRen()
    
    try:
        if args.random:
            import random
            n1, n2, n3 = random.randint(1, 9), random.randint(1, 9), random.randint(1, 9)
            result = diviner.divine(n1, n2, n3)
        elif args.n1 is not None and args.n2 is not None and args.n3 is not None:
            result = diviner.divine(args.n1, args.n2, args.n3)
        elif args.month is not None and args.day is not None and args.hour is not None:
            result = diviner.divine_by_time(args.month, args.day, args.hour)
        else:
            print("請輸入參數：")
            print("  三數起卦: --n1 1 --n2 7 --n3 5")
            print("  時間起卜: --month 1 --day 17 --hour 1")
            print("  隨機: --random")
            return
        
        import json
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except ValueError as e:
        print(f"錯誤: {e}")
        return


if __name__ == "__main__":
    main()
