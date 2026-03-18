<?php
/**
 * 小六壬預測系統 (Xiao Liu Ren Divination) - v1.1.0
 * PHP 版本
 */

header('Content-Type: application/json');

$grid = [
    1 => ['name' => '大安', '五行' => '木', '方位' => '正東', '特質' => '長期、緩慢、穩定', '神煞' => '青龍', '意義' => '吉利', '尋物' => '東西就在家裡', '辦事求職' => '順利穩定', '感情人際' => '感情穩定', '疾病身體' => '身體無大礙'],
    2 => ['name' => '留連', '五行' => '水', '方位' => '西南', '特質' => '停止、反復', '神煞' => '玄武', '意義' => '延宕', '尋物' => '東西藏在某處，需要耐心找', '辦事求職' => '事情會卡住', '感情人際' => '難以割捨', '疾病身體' => '需要長期調養'],
    3 => ['name' => '速喜', '五行' => '火', '方位' => '正南', '特質' => '驚喜、快速、突然', '神煞' => '朱雀', '意義' => '喜慶', '尋物' => '很快就會找到', '辦事求職' => '會非常快得到好消息', '感情人際' => '彼此有火花', '疾病身體' => '康復快速'],
    4 => ['name' => '赤口', '五行' => '金', '方位' => '正西', '特質' => '吵架、打架、鬥爭', '神煞' => '白虎', '意義' => '口舌糾紛', '尋物' => '可能已經遺失', '辦事求職' => '容易有口舌是非', '感情人際' => '容易吵架', '疾病身體' => '可能需要動刀'],
    5 => ['name' => '小吉', '五行' => '木', '方位' => '正北', '特質' => '起步、不多、尚可', '神煞' => '六合', '意義' => '貴人', '尋物' => '會有貴人幫你找到', '辦事求職' => '有貴人相助', '感情人際' => '有好的發展機會', '疾病身體' => '逐漸好轉'],
    6 => ['name' => '空亡', '五行' => '土', '方位' => '內', '特質' => '失去、虛偽、空想', '神煞' => '勾陳', '意義' => '虛驚', '尋物' => '東西找不到了', '辦事求職' => '一場空', '感情人際' => '對方心意不明', '疾病身體' => '需要多注意'],
];

// 建立 name -> grid 的映射以提高查找效率
$gridByName = [];
foreach ($grid as $item) {
    $gridByName[$item['name']] = $item;
}

$baseSix = ['大安', '留連', '速喜', '赤口', '小吉', '空亡'];

$path = $_SERVER['PATH_INFO'] ?? '/';

/**
 * 驗證數字是否在有效範圍內
 */
function validateNumber($n, $name, $min = 1, $max = 999) {
    if (!is_int($n) || $n < $min || $n > $max) {
        throw new Exception("{$name} 必須是 {$min}-{$max} 的整數");
    }
}

function divine($n1, $n2, $n3, $gridByName, $baseSix) {
    // 輸入驗證
    validateNumber($n1, 'n1');
    validateNumber($n2, 'n2');
    validateNumber($n3, 'n3');

    $startIdx = ($n1 - 1) % 6;
    $start = $baseSix[$startIdx];
    $step2Idx = ($startIdx + $n2 - 1) % 6;
    if ($step2Idx < 0) $step2Idx += 6;
    $step2 = $baseSix[$step2Idx];
    $finalIdx = ($step2Idx + $n3 - 1) % 6;
    if ($finalIdx < 0) $finalIdx += 6;
    $final = $baseSix[$finalIdx];
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

function random($gridByName, $baseSix) {
    $n1 = rand(1, 6);
    $n2 = rand(1, 6);
    $n3 = rand(1, 6);
    return divine($n1, $n2, $n3, $gridByName, $baseSix);
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
        echo json_encode(divine($n1, $n2, $n3, $gridByName, $baseSix), JSON_UNESCAPED_UNICODE);
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
        echo json_encode(random($gridByName, $baseSix), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'message' => '小六壬 API v1.1.0',
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
