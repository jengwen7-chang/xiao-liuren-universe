#!/usr/bin/env python3
"""
FastAPI 服務器 - 小六壬預測系統
"""

from fastapi import FastAPI, Query
from xiao_liu_ren import XiaoLiuRen

app = FastAPI(title="小六壬 API", version="1.0.0")
diviner = XiaoLiuRen()

@app.get("/")
def root():
    return {
        "message": "小六壬 API v1.0",
        "endpoints": [
            "/divine?n1=1&n2=7&n3=5 - 三數起卦",
            "/time?month=1&day=17&hour=1 - 時間起卜",
            "/random - 隨機一卦",
            "/position?hexagram=大安 - 查詢方位"
        ]
    }

@app.get("/divine")
def divine(
    n1: int = Query(..., description="第一個數字 (1-9)", ge=1, le=9),
    n2: int = Query(..., description="第二個數字 (1-9)", ge=1, le=9),
    n3: int = Query(..., description="第三個數字 (1-9)", ge=1, le=9)
):
    """三數起卦"""
    return diviner.divine(n1, n2, n3)

@app.get("/time")
def time_divine(
    month: int = Query(..., description="農曆月", ge=1, le=12),
    day: int = Query(..., description="農曆日", ge=1, le=30),
    hour: int = Query(..., description="農曆時", ge=1, le=12)
):
    """時間起卜"""
    return diviner.divine_by_time(month, day, hour)

@app.get("/random")
def random_divine():
    """隨機一卦"""
    import random
    n1, n2, n3 = random.randint(1, 9), random.randint(1, 9), random.randint(1, 9)
    return diviner.divine(n1, n2, n3)

@app.get("/position")
def position(hexagram: str = Query(..., description="卦名")):
    """查詢方位"""
    return diviner.get_position(hexagram)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3006)
