#!/usr/bin/env python3
"""
小六壬預測系統 (Xiao Liu Ren Divination) - v1.2.0
一個簡易的中國傳統占卜工具
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "shared"))
from data import GRID, NINE_GRID, BASE_SIX

__version__ = "1.2.0"
__author__ = "Alex Family"

# ==================== 小六壬完整資料 ====================


class XiaoLiuRen:
    """小六壬占卜"""

    GRID = GRID
    BASE_SIX = BASE_SIX
    NINE_GRID = NINE_GRID

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
        step2_idx = (start_idx + n2 - 1) % 9
        step2 = self.NINE_GRID[step2_idx]

        # Step 3: 從中點數 n3 步
        final_idx = (step2_idx + n3 - 1) % 9
        final = self.NINE_GRID[final_idx]

        return self._build_result(final, f"{n1} → {n2} → {n3}", start, step2)

    def divine_by_time(self, month: int, day: int, hour: int) -> dict:
        """
        時間起卜法
        month: 農曆月
        day: 農曆日
        hour: 農曆時
        """
        self._validate_time_params(month, day, hour)

        start_idx = (month - 1) % 6
        start = self.BASE_SIX[start_idx]

        step2_idx = (start_idx + day - 1) % 6
        step2 = self.BASE_SIX[step2_idx]

        final_idx = (step2_idx + hour - 1) % 6
        final = self.BASE_SIX[final_idx]

        return self._build_result(
            final, f"月={month}, 日={day}, 時={hour}", start, step2
        )

    def get_position(self, hexagram: str) -> dict:
        """取得方位"""
        for info in self.GRID.values():
            if info["name"] == hexagram:
                return {
                    "卦名": hexagram,
                    "方位": info.get("方位", ""),
                    "說明": info.get("尋物", ""),
                }
        return {"error": "找不到該卦"}

    def _build_result(
        self, result: str, input_str: str, start: str = None, step2: str = None
    ) -> dict:
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
                "意義": info.get("意義", ""),
            },
            "常見用法": {
                "尋物": info.get("尋物", ""),
                "辦事求職": info.get("辦事求職", ""),
                "感情人際": info.get("感情人際", ""),
                "疾病身體": info.get("疾病身體", ""),
            },
        }

        if start and step2:
            response["steps"] = {"起點": start, "中點": step2}

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

            n1, n2, n3 = (
                random.randint(1, 9),
                random.randint(1, 9),
                random.randint(1, 9),
            )
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
