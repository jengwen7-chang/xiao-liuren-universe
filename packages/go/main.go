package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

func loadSharedData() (map[string]map[string]string, []string, []string) {
	exePath, _ := os.Executable()
	sharedPath := filepath.Join(filepath.Dir(exePath), "..", "shared", "data.json")
	if _, err := os.Stat(sharedPath); os.IsNotExist(err) {
		sharedPath = filepath.Join("packages", "shared", "data.json")
	}

	data, err := os.ReadFile(sharedPath)
	if err != nil {
		panic("無法讀取 shared data: " + err.Error())
	}

	var shared map[string]interface{}
	if err := json.Unmarshal(data, &shared); err != nil {
		panic("無法解析 shared data: " + err.Error())
	}

	grid := make(map[int]map[string]string)
	for k, v := range shared["grid"].(map[string]interface{}) {
		key, _ := strconv.Atoi(k)
		val := make(map[string]string)
		for kk, vv := range v.(map[string]interface{}) {
			val[kk] = vv.(string)
		}
		grid[key] = val
	}

	nineGrid := make([]string, len(shared["nineGrid"].([]interface{})))
	for i, v := range shared["nineGrid"].([]interface{}) {
		nineGrid[i] = v.(string)
	}

	baseSix := make([]string, len(shared["baseSix"].([]interface{})))
	for i, v := range shared["baseSix"].([]interface{}) {
		baseSix[i] = v.(string)
	}

	gridByName := make(map[string]map[string]string)
	for _, v := range grid {
		gridByName[v["name"]] = v
	}

	return gridByName, nineGrid, baseSix
}

var gridByName, nineGrid, baseSix = loadSharedData()

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
			"message":   "小六壬 API v1.2.0",
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
		"方法":    "三數起卦",
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
			"尋物":   info["尋物"],
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
		"方法":    "時間起卜",
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
			"尋物":   info["尋物"],
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
