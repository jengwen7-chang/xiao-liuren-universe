<?php
/**
 * 小六壬預測系統 (Xiao Liu Ren Divination) - v1.2.0
 * PHP 版本
 */

header('Content-Type: application/json');

$sharedDataPath = __DIR__ . '/../shared/data.json';
$sharedData = json_decode(file_get_contents($sharedDataPath), true);

$grid = [];
foreach ($sharedData['grid'] as $k => $v) {
    $grid[(int)$k] = $v;
}
$nineGrid = $sharedData['nineGrid'];
$baseSix = $sharedData['baseSix'];

$gridByName = [];
foreach ($grid as $item) {
    $gridByName[$item['name']] = $item;
}

$path = $_SERVER['PATH_INFO'] ?? '/';

/**
 * 驗證數字是否在有效範圍內
 */
function validateNumber($n, $name, $min = 1, $max = 9) {
    if (!is_int($n) || $n < $min || $n > $max) {
        throw new Exception("{$name} 必須是 {$min}-{$max} 的整數");
    }
}

function divine($n1, $n2, $n3, $gridByName, $nineGrid) {
    // 輸入驗證
    validateNumber($n1, 'n1');
    validateNumber($n2, 'n2');
    validateNumber($n3, 'n3');

    $startIdx = $n1 - 1;
    $start = $nineGrid[$startIdx];
    $step2Idx = ($startIdx + $n2 - 1) % 9;
    if ($step2Idx < 0) $step2Idx += 9;
    $step2 = $nineGrid[$step2Idx];
    $finalIdx = ($step2Idx + $n3 - 1) % 9;
    if ($finalIdx < 0) $finalIdx += 9;
    $final = $nineGrid[$finalIdx];
    $info = $gridByName[$final];
    
    return [
        '方法' => '三數起卦',
        'input' => "$n1 → $n2 → $n3",
        '結論' => [
            '卦名' => $final,
            '五行' => $info['五行'],
            '方位' => $info['方位'],
            '特質' => $info['特質'],
            '神煞' => $info['神煞'],
            '意義' => $info['意義'],
        ],
        '常見用法' => [
            '尋物' => $info['尋物'],
            '辦事求職' => $info['辦事求職'],
            '感情人際' => $info['感情人際'],
            '疾病身體' => $info['疾病身體'],
        ],
        'steps' => [
            '起點' => $start,
            '中點' => $step2,
        ],
    ];
}

function divineByTime($month, $day, $hour, $baseSix, $gridByName) {
    // 輸入驗證
    validateNumber($month, 'month', 1, 12);
    validateNumber($day, 'day', 1, 30);
    validateNumber($hour, 'hour', 1, 12);

    $idx = ($month + $day + $hour - 3) % 6;
    if ($idx < 0) $idx += 6;
    $result = $baseSix[$idx];
    $info = $gridByName[$result];
    
    return [
        '方法' => '時間起卜',
        'input' => "月=$month, 日=$day, 時=$hour",
        '結論' => [
            '卦名' => $result,
            '五行' => $info['五行'],
            '方位' => $info['方位'],
            '特質' => $info['特質'],
            '神煞' => $info['神煞'],
            '意義' => $info['意義'],
        ],
        '常見用法' => [
            '尋物' => $info['尋物'],
            '辦事求職' => $info['辦事求職'],
            '感情人際' => $info['感情人際'],
            '疾病身體' => $info['疾病身體'],
        ],
    ];
}

function random($gridByName, $nineGrid) {
    $n1 = rand(1, 9);
    $n2 = rand(1, 9);
    $n3 = rand(1, 9);
    return divine($n1, $n2, $n3, $gridByName, $nineGrid);
}

// 路由
try {
    if (strpos($path, '/divine') === 0) {
        if (!isset($_GET['n1']) || !isset($_GET['n2']) || !isset($_GET['n3'])) {
            echo json_encode(['error' => '請提供 n1, n2, n3 (1-9 的整數)'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $n1 = (int)$_GET['n1'];
        $n2 = (int)$_GET['n2'];
        $n3 = (int)$_GET['n3'];
        echo json_encode(divine($n1, $n2, $n3, $gridByName, $nineGrid), JSON_UNESCAPED_UNICODE);
    } elseif (strpos($path, '/time') === 0) {
        if (!isset($_GET['month']) || !isset($_GET['day']) || !isset($_GET['hour'])) {
            echo json_encode(['error' => '請提供 month (1-12), day (1-30), hour (1-12)'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $month = (int)$_GET['month'];
        $day = (int)$_GET['day'];
        $hour = (int)$_GET['hour'];
        echo json_encode(divineByTime($month, $day, $hour, $baseSix, $gridByName), JSON_UNESCAPED_UNICODE);
    } elseif ($path === '/random' || $path === '/random/') {
        echo json_encode(random($gridByName, $nineGrid), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'message' => '小六壬 API v1.2.0',
            'endpoints' => [
                '/divine?n1=1&n2=7&n3=5 - 三數起卦',
                '/time?month=1&day=17&hour=1 - 時間起卜',
                '/random - 隨機一卦',
            ]
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
