package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
)

// 小六壬資料
var grid = map[int]map[string]string{
	1: {"name": "留連", "五行": "水", "方位": "西南", "特質": "停止、反復", "神煞": "玄武", "意義": "延宕", "尋物": "東西藏在某處，需要耐心找", "辦事求職": "事情會卡住", "感情人際": "難以割捨", "疾病身體": "需要長期調養"},
	2: {"name": "大安", "五行": "木", "方位": "正東", "特質": "長期、緩慢、穩定", "神煞": "青龍", "意義": "吉利", "尋物": "東西就在家裡", "辦事求職": "順利穩定", "感情人際": "感情穩定", "疾病身體": "身體無大礙"},
	3: {"name": "桃花", "五行": "土", "方位": "東北", "特質": "欲望、牽絆、異性", "神煞": "紅鸞", "意義": "感情", "尋物": "東西藏在熱鬧場所", "辦事求職": "靠人脈關係", "感情人際": "有戀情機會", "疾病身體": "注意泌尿系統"},
	4: {"name": "速喜", "五行": "火", "方位": "正南", "特質": "驚喜、快速、突然", "神煞": "朱雀", "意義": "喜慶", "尋物": "很快就會找到", "辦事求職": "會非常快得到好消息", "感情人際": "彼此有火花", "疾病身體": "康復快速"},
	5: {"name": "空亡", "五行": "土", "方位": "內", "特質": "失去、虛偽、空想", "神煞": "勾陳", "意義": "虛驚", "尋物": "東西找不到了", "辦事求職": "一場空", "感情人際": "對方心意不明", "疾病身體": "需要多注意"},
	6: {"name": "小吉", "五行": "水", "方位": "正北", "特質": "起步、不多、尚可", "神煞": "六合", "意義": "貴人", "尋物": "會有貴人幫你找到", "辦事求職": "有貴人相助", "感情人際": "有好的發展機會", "疾病身體": "逐漸好轉"},
	7: {"name": "病符", "五行": "金", "方位": "西南", "特質": "病態異常、治療", "神煞": "凶煞", "意義": "疾病", "尋物": "東西可能在醫療院所", "辦事求職": "身體不適", "感情人際": "對方身體有恙", "疾病身體": "需要看醫生"},
	8: {"name": "赤口", "五行": "金", "方位": "正西", "特質": "吵架、打架、鬥爭", "神煞": "白虎", "意義": "口舌糾紛", "尋物": "可能已經遺失", "辦事求職": "容易有口舌是非", "感情人際": "容易吵架", "疾病身體": "可能需要動刀"},
	9: {"name": "天德", "五行": "金", "方位": "西北", "特質": "貴人、上司、高遠", "神煞": "天德貴人", "意義": "吉祥", "尋物": "有貴人幫忙找回", "辦事求職": "紫微降臨", "感情人際": "有長輩撮合", "疾病身體": "有福報"},
}

// 建立 name -> grid 的映射以提高查找效率
var gridByName = func() map[string]map[string]string {
	m := make(map[string]map[string]string)
	for _, v := range grid {
		m[v["name"]] = v
	}
	return m
}()

var nineGrid = []string{"大安", "留連", "桃花", "速喜", "空亡", "小吉", "病符", "赤口", "天德"}
var baseSix = []string{"大安", "留連", "速喜", "赤口", "小吉", "空亡"}

// 驗證數字是否在有效範圍內
func validateNumber(n int, name string, min int, max int) error {
	if n < min || n > max {
		return fmt.Errorf("%s 必須是 %d-%d 的整數", name, min, max)
	}
	return nil
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("小六壬 API 運行中：http://localhost:3007")
	http.ListenAndServe(":3007", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	path := r.URL.Path[1:]
	
	switch path {
	case "divine":
		n1, err1 := strconv.Atoi(r.URL.Query().Get("n1"))
		n2, err2 := strconv.Atoi(r.URL.Query().Get("n2"))
		n3, err3 := strconv.Atoi(r.URL.Query().Get("n3"))
		
		if err1 != nil || err2 != nil || err3 != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": "n1, n2, n3 必須是整數"})
			return
		}
		
		// 輸入驗證
		if err := validateNumber(n1, "n1", 1, 9); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		if err := validateNumber(n2, "n2", 1, 9); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		if err := validateNumber(n3, "n3", 1, 9); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		
		json.NewEncoder(w).Encode(divine(n1, n2, n3))
	case "time":
		month, err1 := strconv.Atoi(r.URL.Query().Get("month"))
		day, err2 := strconv.Atoi(r.URL.Query().Get("day"))
		hour, err3 := strconv.Atoi(r.URL.Query().Get("hour"))
		
		if err1 != nil || err2 != nil || err3 != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": "month, day, hour 必須是整數"})
			return
		}
		
		// 輸入驗證
		if err := validateNumber(month, "month", 1, 12); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		if err := validateNumber(day, "day", 1, 30); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		if err := validateNumber(hour, "hour", 1, 12); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		
		json.NewEncoder(w).Encode(divineByTime(month, day, hour))
	case "random":
		json.NewEncoder(w).Encode(random())
	case "":
		json.NewEncoder(w).Encode(map[string]string{
			"message": "小六壬 API v1.1.0",
			"endpoints": "/divine?n1=1&n2=7&n3=5, /time?month=1&day=17&hour=1, /random",
		})
	default:
		json.NewEncoder(w).Encode(map[string]string{"error": "not found"})
	}
}

func divine(n1, n2, n3 int) map[string]interface{} {
	startIdx := n1 - 1
	start := nineGrid[startIdx]
	step2Idx := (startIdx + n2 - 1) % 9
	if step2Idx < 0 {
		step2Idx += 9
	}
	step2 := nineGrid[step2Idx]
	finalIdx := (step2Idx + n3 - 1) % 9
	if finalIdx < 0 {
		finalIdx += 9
	}
	final := nineGrid[finalIdx]
	
	info := gridByName[final]
	
	return map[string]interface{}{
		"方法": "三數起卦",
		"input": fmt.Sprintf("%d → %d → %d", n1, n2, n3),
		"結論": map[string]string{
			"卦名": final,
			"五行": info["五行"],
			"方位": info["方位"],
			"特質": info["特質"],
			"神煞": info["神煞"],
			"意義": info["意義"],
		},
		"常見用法": map[string]string{
			"尋物":     info["尋物"],
			"辦事求職": info["辦事求職"],
			"感情人際": info["感情人際"],
			"疾病身體": info["疾病身體"],
		},
		"steps": map[string]string{
			"起點": start,
			"中點": step2,
		},
	}
}

func divineByTime(month, day, hour int) map[string]interface{} {
	idx := (month + day + hour - 3) % 6
	if idx < 0 {
		idx += 6
	}
	result := baseSix[idx]
	
	// 使用映射快速查找
	info := gridByName[result]
	
	return map[string]interface{}{
		"方法":   "時間起卜",
		"input": fmt.Sprintf("月=%d, 日=%d, 時=%d", month, day, hour),
		"結論": map[string]string{
			"卦名": result,
			"五行": info["五行"],
			"方位": info["方位"],
			"特質": info["特質"],
			"神煞": info["神煞"],
			"意義": info["意義"],
		},
		"常見用法": map[string]string{
			"尋物":     info["尋物"],
			"辦事求職": info["辦事求職"],
			"感情人際": info["感情人際"],
			"疾病身體": info["疾病身體"],
		},
	}
}

func random() map[string]interface{} {
	n1 := rand.Intn(9) + 1
	n2 := rand.Intn(9) + 1
	n3 := rand.Intn(9) + 1
	return divine(n1, n2, n3)
}
