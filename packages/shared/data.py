#!/usr/bin/env python3
"""
小六壬共享資料
統一存放九宮格和 baseSix 資料
"""

import json
import os


def get_shared_data():
    data_path = os.path.join(os.path.dirname(__file__), "data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


data = get_shared_data()

GRID = {int(k): v for k, v in data["grid"].items()}
NINE_GRID = data["nineGrid"]
BASE_SIX = data["baseSix"]
