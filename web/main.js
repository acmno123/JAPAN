import './styles.css';
import './course.css';
import './auth.css';
import { loginLocal, logoutLocal, progressKey, registerLocal, getSessionUser, hasLocalAccounts, cloudEnabled, fetchCloudProgress, saveCloudProgress } from './auth.js';
const HIRA = [
  ['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],
  ['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],
  ['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],
  ['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],['や','ya'],['ゆ','yu'],['よ','yo'],['ら','ra'],['り','ri'],
  ['る','ru'],['れ','re'],['ろ','ro'],['わ','wa'],['を','o'],['ん','n'],
];
const KATA = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'];
const LEGACY_WORDS = [
  {id:'komorebi',kanji:'木漏れ日',kana:'こもれび',romaji:'komorebi',meaning:'陽光從樹葉縫隙灑落的光影',level:'N2',tag:'自然',example:'木漏れ日の中を、ゆっくり歩いた。',translation:'在斑駁的樹影裡，慢慢地走著。'},
  {id:'natsukashii',kanji:'懐かしい',kana:'なつかしい',romaji:'natsukashii',meaning:'令人懷念的；令人想起往事的',level:'N4',tag:'感受',example:'この歌を聞くと、懐かしい気持ちになる。',translation:'聽到這首歌，就有種懷念的感覺。'},
  {id:'otsukare',kanji:'お疲れ様',kana:'おつかれさま',romaji:'otsukaresama',meaning:'辛苦了；做得好',level:'N5',tag:'日常',example:'今日も一日、お疲れ様でした。',translation:'今天一整天也辛苦了。'},
  {id:'itadakimasu',kanji:'いただきます',kana:'いただきます',romaji:'itadakimasu',meaning:'我開動了（飯前用語）',level:'N5',tag:'日常',example:'それでは、いただきます。',translation:'那麼，我開動了。'},
  {id:'yoroshiku',kanji:'よろしくお願いします',kana:'よろしくおねがいします',romaji:'yoroshiku onegaishimasu',meaning:'請多多指教；麻煩你了',level:'N5',tag:'日常',example:'これからよろしくお願いします。',translation:'今後也請多多指教。'},
  {id:'daijoubu',kanji:'大丈夫',kana:'だいじょうぶ',romaji:'daijōbu',meaning:'沒關係；沒問題；還好嗎？',level:'N5',tag:'日常',example:'手伝いましょうか。— 大丈夫です。',translation:'要我幫忙嗎？— 沒關係。'},
  {id:'yoru',kanji:'夜',kana:'よる',romaji:'yoru',meaning:'夜晚',level:'N5',tag:'時間',example:'夜は静かな音楽を聴きます。',translation:'晚上我會聽安靜的音樂。'},
  {id:'asa',kanji:'朝',kana:'あさ',romaji:'asa',meaning:'早晨',level:'N5',tag:'時間',example:'朝、コーヒーを飲みます。',translation:'早上我會喝咖啡。'},
  {id:'taberu',kanji:'食べる',kana:'たべる',romaji:'taberu',meaning:'吃',level:'N5',tag:'動詞',example:'友達とラーメンを食べた。',translation:'和朋友一起吃了拉麵。'},
  {id:'kiku',kanji:'聴く',kana:'きく',romaji:'kiku',meaning:'聽；傾聽',level:'N5',tag:'動詞',example:'通学中に日本語を聴きます。',translation:'通勤上學時會聽日文。'},
  {id:'yasashii',kanji:'優しい',kana:'やさしい',romaji:'yasashii',meaning:'溫柔的；和善的',level:'N5',tag:'感受',example:'先生はとても優しい人です。',translation:'老師是非常溫柔的人。'},
  {id:'utsukushii',kanji:'美しい',kana:'うつくしい',romaji:'utsukushii',meaning:'美麗的；優美的',level:'N4',tag:'感受',example:'美しい海を見に行きたい。',translation:'我想去看看美麗的大海。'},
  {id:'shizuka',kanji:'静か',kana:'しずか',romaji:'shizuka',meaning:'安靜的；平靜的',level:'N5',tag:'形容詞',example:'図書館は静かです。',translation:'圖書館很安靜。'},
  {id:'suki',kanji:'好き',kana:'すき',romaji:'suki',meaning:'喜歡；中意',level:'N5',tag:'感受',example:'日本の映画が好きです。',translation:'我喜歡日本電影。'},
  {id:'kotoba',kanji:'言葉',kana:'ことば',romaji:'kotoba',meaning:'語言；詞語',level:'N5',tag:'名詞',example:'新しい言葉を覚えました。',translation:'我記住了一個新單字。'},
  {id:'yuuki',kanji:'勇気',kana:'ゆうき',romaji:'yūki',meaning:'勇氣',level:'N3',tag:'感受',example:'一歩踏み出す勇気がほしい。',translation:'我想要踏出一步的勇氣。'},
  {id:'shiawase',kanji:'幸せ',kana:'しあわせ',romaji:'shiawase',meaning:'幸福；幸福的',level:'N5',tag:'感受',example:'小さなことに幸せを感じる。',translation:'從小事中感受到幸福。'},
  {id:'mottainai',kanji:'もったいない',kana:'もったいない',romaji:'mottainai',meaning:'可惜；浪費了',level:'N4',tag:'表達',example:'食べ物を残すのはもったいない。',translation:'把食物剩下很可惜。'},
  {id:'otsukisama',kanji:'お月様',kana:'おつきさま',romaji:'otsukisama',meaning:'月亮（親暱的說法）',level:'—',tag:'自然',example:'今夜のお月様はきれいだね。',translation:'今晚的月亮真漂亮呢。'},
  {id:'arigatou',kanji:'ありがとう',kana:'ありがとう',romaji:'arigatō',meaning:'謝謝',level:'N5',tag:'日常',example:'いつもありがとう。',translation:'一直以來都謝謝你。'},
  {id:'ohayou',kanji:'おはよう',kana:'おはよう',romaji:'ohayō',meaning:'早安（非正式）',level:'N5',tag:'日常',example:'おはよう！よく眠れた？',translation:'早安！睡得好嗎？'},
  {id:'mata',kanji:'またね',kana:'またね',romaji:'matane',meaning:'再見啦；回頭見',level:'N5',tag:'日常',example:'じゃあ、またね。',translation:'那就回頭見啦。'},
];
const N5_WORDS = [
  {
    "id": "watashi",
    "kanji": "私",
    "kana": "わたし",
    "romaji": "watashi",
    "meaning": "我",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "anata",
    "kanji": "あなた",
    "kana": "あなた",
    "romaji": "anata",
    "meaning": "你；您",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "hito",
    "kanji": "人",
    "kana": "ひと",
    "romaji": "hito",
    "meaning": "人",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "otoko",
    "kanji": "男",
    "kana": "おとこ",
    "romaji": "otoko",
    "meaning": "男人",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "onna",
    "kanji": "女",
    "kana": "おんな",
    "romaji": "onna",
    "meaning": "女人",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ko",
    "kanji": "子",
    "kana": "こ",
    "romaji": "ko",
    "meaning": "孩子",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "otokonoko",
    "kanji": "男の子",
    "kana": "おとこのこ",
    "romaji": "otokonoko",
    "meaning": "男孩",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "onna_no_ko",
    "kanji": "女の子",
    "kana": "おんなのこ",
    "romaji": "onnanoko",
    "meaning": "女孩",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "sensei",
    "kanji": "先生",
    "kana": "せんせい",
    "romaji": "sensei",
    "meaning": "老師；先生",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "gakusei",
    "kanji": "学生",
    "kana": "がくせい",
    "romaji": "gakusei",
    "meaning": "學生",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "tomodachi",
    "kanji": "友達",
    "kana": "ともだち",
    "romaji": "tomodachi",
    "meaning": "朋友",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "kazoku",
    "kanji": "家族",
    "kana": "かぞく",
    "romaji": "kazoku",
    "meaning": "家人",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "chichi",
    "kanji": "父",
    "kana": "ちち",
    "romaji": "chichi",
    "meaning": "父親（自己的）",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "haha",
    "kanji": "母",
    "kana": "はは",
    "romaji": "haha",
    "meaning": "母親（自己的）",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ani",
    "kanji": "兄",
    "kana": "あに",
    "romaji": "ani",
    "meaning": "哥哥（自己的）",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ane",
    "kanji": "姉",
    "kana": "あね",
    "romaji": "ane",
    "meaning": "姊姊（自己的）",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "otouto",
    "kanji": "弟",
    "kana": "おとうと",
    "romaji": "otouto",
    "meaning": "弟弟",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "imouto",
    "kanji": "妹",
    "kana": "いもうと",
    "romaji": "imouto",
    "meaning": "妹妹",
    "level": "N5",
    "tag": "人物",
    "example": "",
    "translation": ""
  },
  {
    "id": "inu",
    "kanji": "犬",
    "kana": "いぬ",
    "romaji": "inu",
    "meaning": "狗",
    "level": "N5",
    "tag": "動物",
    "example": "",
    "translation": ""
  },
  {
    "id": "neko",
    "kanji": "猫",
    "kana": "ねこ",
    "romaji": "neko",
    "meaning": "貓",
    "level": "N5",
    "tag": "動物",
    "example": "",
    "translation": ""
  },
  {
    "id": "tori",
    "kanji": "鳥",
    "kana": "とり",
    "romaji": "tori",
    "meaning": "鳥",
    "level": "N5",
    "tag": "動物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ima",
    "kanji": "今",
    "kana": "いま",
    "romaji": "ima",
    "meaning": "現在",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kyou",
    "kanji": "今日",
    "kana": "きょう",
    "romaji": "kyou",
    "meaning": "今天",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "ashita",
    "kanji": "明日",
    "kana": "あした",
    "romaji": "ashita",
    "meaning": "明天",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kinou",
    "kanji": "昨日",
    "kana": "きのう",
    "romaji": "kinou",
    "meaning": "昨天",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "asa",
    "kanji": "朝",
    "kana": "あさ",
    "romaji": "asa",
    "meaning": "早上",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "hiru",
    "kanji": "昼",
    "kana": "ひる",
    "romaji": "hiru",
    "meaning": "中午；白天",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "yoru",
    "kanji": "夜",
    "kana": "よる",
    "romaji": "yoru",
    "meaning": "晚上",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "ban",
    "kanji": "晩",
    "kana": "ばん",
    "romaji": "ban",
    "meaning": "夜晚",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "mainichi",
    "kanji": "毎日",
    "kana": "まいにち",
    "romaji": "mainichi",
    "meaning": "每天",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "maiasa",
    "kanji": "毎朝",
    "kana": "まいあさ",
    "romaji": "maiasa",
    "meaning": "每天早上",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "getsuyoubi",
    "kanji": "月曜日",
    "kana": "げつようび",
    "romaji": "getsuyoubi",
    "meaning": "星期一",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kayoubi",
    "kanji": "火曜日",
    "kana": "かようび",
    "romaji": "kayoubi",
    "meaning": "星期二",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "suiyoubi",
    "kanji": "水曜日",
    "kana": "すいようび",
    "romaji": "suiyoubi",
    "meaning": "星期三",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "mokuyoubi",
    "kanji": "木曜日",
    "kana": "もくようび",
    "romaji": "mokuyoubi",
    "meaning": "星期四",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kinyoubi",
    "kanji": "金曜日",
    "kana": "きんようび",
    "romaji": "kinyoubi",
    "meaning": "星期五",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "doyoubi",
    "kanji": "土曜日",
    "kana": "どようび",
    "romaji": "土曜日",
    "meaning": "星期六",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "nichiyoubi",
    "kanji": "日曜日",
    "kana": "にちようび",
    "romaji": "nichiyoubi",
    "meaning": "星期日",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "getsuyou",
    "kanji": "月",
    "kana": "げつよう",
    "romaji": "getsuyou",
    "meaning": "月份；月亮",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "ichi",
    "kanji": "日",
    "kana": "ひ",
    "romaji": "hi",
    "meaning": "日子；太陽",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "toshi",
    "kanji": "年",
    "kana": "とし",
    "romaji": "toshi",
    "meaning": "年",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "ji",
    "kanji": "時",
    "kana": "じ",
    "romaji": "ji",
    "meaning": "點鐘",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "fun",
    "kanji": "分",
    "kana": "ふん",
    "romaji": "fun",
    "meaning": "分鐘",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "han",
    "kanji": "半",
    "kana": "はん",
    "romaji": "han",
    "meaning": "一半；半點",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kyonen",
    "kanji": "去年",
    "kana": "きょねん",
    "romaji": "kyonen",
    "meaning": "去年",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "kotoshi",
    "kanji": "今年",
    "kana": "ことし",
    "romaji": "kotoshi",
    "meaning": "今年",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "rainen",
    "kanji": "来年",
    "kana": "らいねん",
    "romaji": "rainen",
    "meaning": "明年",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "asa_go",
    "kanji": "午前",
    "kana": "ごぜん",
    "romaji": "gozen",
    "meaning": "上午",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "gogo",
    "kanji": "午後",
    "kana": "ごご",
    "romaji": "gogo",
    "meaning": "下午",
    "level": "N5",
    "tag": "時間",
    "example": "",
    "translation": ""
  },
  {
    "id": "ue",
    "kanji": "上",
    "kana": "うえ",
    "romaji": "ue",
    "meaning": "上面",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "shita",
    "kanji": "下",
    "kana": "した",
    "romaji": "shita",
    "meaning": "下面",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "mae",
    "kanji": "前",
    "kana": "まえ",
    "romaji": "mae",
    "meaning": "前面；以前",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "ushiro",
    "kanji": "後ろ",
    "kana": "うしろ",
    "romaji": "ushiro",
    "meaning": "後面",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "naka",
    "kanji": "中",
    "kana": "なか",
    "romaji": "naka",
    "meaning": "裡面；中間",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "soto",
    "kanji": "外",
    "kana": "そと",
    "romaji": "soto",
    "meaning": "外面",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "migi",
    "kanji": "右",
    "kana": "みぎ",
    "romaji": "migi",
    "meaning": "右邊",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "hidari",
    "kanji": "左",
    "kana": "ひだり",
    "romaji": "hidari",
    "meaning": "左邊",
    "level": "N5",
    "tag": "位置",
    "example": "",
    "translation": ""
  },
  {
    "id": "ueki",
    "kanji": "駅",
    "kana": "えき",
    "romaji": "eki",
    "meaning": "車站",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "gakkou",
    "kanji": "学校",
    "kana": "がっこう",
    "romaji": "gakkou",
    "meaning": "學校",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "byouin",
    "kanji": "病院",
    "kana": "びょういん",
    "romaji": "byouin",
    "meaning": "醫院",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "toshokan",
    "kanji": "図書館",
    "kana": "としょかん",
    "romaji": "toshokan",
    "meaning": "圖書館",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "kaisha",
    "kanji": "会社",
    "kana": "かいしゃ",
    "romaji": "kaisha",
    "meaning": "公司",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "uchi",
    "kanji": "家",
    "kana": "うち",
    "romaji": "uchi",
    "meaning": "家",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "heya",
    "kanji": "部屋",
    "kana": "へや",
    "romaji": "heya",
    "meaning": "房間",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "kuni",
    "kanji": "国",
    "kana": "くに",
    "romaji": "kuni",
    "meaning": "國家",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "nihon",
    "kanji": "日本",
    "kana": "にほん",
    "romaji": "nihon",
    "meaning": "日本",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "mise",
    "kanji": "店",
    "kana": "みせ",
    "romaji": "mise",
    "meaning": "店",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "resutoran",
    "kanji": "レストラン",
    "kana": "れすとらん",
    "romaji": "resutoran",
    "meaning": "餐廳",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "kissaten",
    "kanji": "喫茶店",
    "kana": "きっさてん",
    "romaji": "kissaten",
    "meaning": "咖啡店",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "kouen",
    "kanji": "公園",
    "kana": "こうえん",
    "romaji": "kouen",
    "meaning": "公園",
    "level": "N5",
    "tag": "地點",
    "example": "",
    "translation": ""
  },
  {
    "id": "yama",
    "kanji": "山",
    "kana": "やま",
    "romaji": "yama",
    "meaning": "山",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "kawa",
    "kanji": "川",
    "kana": "かわ",
    "romaji": "kawa",
    "meaning": "河流",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "umi",
    "kanji": "海",
    "kana": "うみ",
    "romaji": "umi",
    "meaning": "海",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "tenki",
    "kanji": "天気",
    "kana": "てんき",
    "romaji": "tenki",
    "meaning": "天氣",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "ame",
    "kanji": "雨",
    "kana": "あめ",
    "romaji": "ame",
    "meaning": "雨",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "yuki",
    "kanji": "雪",
    "kana": "ゆき",
    "romaji": "yuki",
    "meaning": "雪",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "hana",
    "kanji": "花",
    "kana": "はな",
    "romaji": "hana",
    "meaning": "花",
    "level": "N5",
    "tag": "自然",
    "example": "",
    "translation": ""
  },
  {
    "id": "mizu",
    "kanji": "水",
    "kana": "みず",
    "romaji": "mizu",
    "meaning": "水",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ocha",
    "kanji": "お茶",
    "kana": "おちゃ",
    "romaji": "ocha",
    "meaning": "茶",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "koohii",
    "kanji": "コーヒー",
    "kana": "こーひー",
    "romaji": "koohii",
    "meaning": "咖啡",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "gohan",
    "kanji": "ご飯",
    "kana": "ごはん",
    "romaji": "gohan",
    "meaning": "飯；米飯",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "pan",
    "kanji": "パン",
    "kana": "ぱん",
    "romaji": "pan",
    "meaning": "麵包",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "tamago",
    "kanji": "卵",
    "kana": "たまご",
    "romaji": "tamago",
    "meaning": "雞蛋",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "niku",
    "kanji": "肉",
    "kana": "にく",
    "romaji": "niku",
    "meaning": "肉",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "sakana",
    "kanji": "魚",
    "kana": "さかな",
    "romaji": "sakana",
    "meaning": "魚",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "yasai",
    "kanji": "野菜",
    "kana": "やさい",
    "romaji": "yasai",
    "meaning": "蔬菜",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "kudamono",
    "kanji": "果物",
    "kana": "くだもの",
    "romaji": "kudamono",
    "meaning": "水果",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "ringo",
    "kanji": "りんご",
    "kana": "りんご",
    "romaji": "ringo",
    "meaning": "蘋果",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "banana",
    "kanji": "バナナ",
    "kana": "ばなな",
    "romaji": "banana",
    "meaning": "香蕉",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "hon",
    "kanji": "本",
    "kana": "ほん",
    "romaji": "hon",
    "meaning": "書",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "shinbun",
    "kanji": "新聞",
    "kana": "しんぶん",
    "romaji": "shinbun",
    "meaning": "報紙",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "zasshi",
    "kanji": "雑誌",
    "kana": "ざっし",
    "romaji": "zasshi",
    "meaning": "雜誌",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "okane",
    "kanji": "お金",
    "kana": "おかね",
    "romaji": "okane",
    "meaning": "錢",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "denwa",
    "kanji": "電話",
    "kana": "でんわ",
    "romaji": "denwa",
    "meaning": "電話",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "tokei",
    "kanji": "時計",
    "kana": "とけい",
    "romaji": "tokei",
    "meaning": "鐘；手錶",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "kuruma",
    "kanji": "車",
    "kana": "くるま",
    "romaji": "kuruma",
    "meaning": "汽車",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "jitensha",
    "kanji": "自転車",
    "kana": "じてんしゃ",
    "romaji": "jitensha",
    "meaning": "腳踏車",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "kutsu",
    "kanji": "靴",
    "kana": "くつ",
    "romaji": "kutsu",
    "meaning": "鞋子",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "kaban",
    "kanji": "鞄",
    "kana": "かばん",
    "romaji": "kaban",
    "meaning": "包包",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "kasa",
    "kanji": "傘",
    "kana": "かさ",
    "romaji": "kasa",
    "meaning": "雨傘",
    "level": "N5",
    "tag": "物品",
    "example": "",
    "translation": ""
  },
  {
    "id": "tenisu",
    "kanji": "テニス",
    "kana": "てにす",
    "romaji": "tenisu",
    "meaning": "網球",
    "level": "N5",
    "tag": "活動",
    "example": "",
    "translation": ""
  },
  {
    "id": "eiga",
    "kanji": "映画",
    "kana": "えいが",
    "romaji": "eiga",
    "meaning": "電影",
    "level": "N5",
    "tag": "活動",
    "example": "",
    "translation": ""
  },
  {
    "id": "ongaku",
    "kanji": "音楽",
    "kana": "おんがく",
    "romaji": "ongaku",
    "meaning": "音樂",
    "level": "N5",
    "tag": "活動",
    "example": "",
    "translation": ""
  },
  {
    "id": "tabemono",
    "kanji": "食べ物",
    "kana": "たべもの",
    "romaji": "tabemono",
    "meaning": "食物",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "nomimono",
    "kanji": "飲み物",
    "kana": "のみもの",
    "romaji": "nomimono",
    "meaning": "飲料",
    "level": "N5",
    "tag": "食物",
    "example": "",
    "translation": ""
  },
  {
    "id": "hayai",
    "kanji": "早い",
    "kana": "はやい",
    "romaji": "hayai",
    "meaning": "早；快",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "osoi",
    "kanji": "遅い",
    "kana": "おそい",
    "romaji": "osoi",
    "meaning": "晚；慢",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "ooi",
    "kanji": "多い",
    "kana": "おおい",
    "romaji": "ooi",
    "meaning": "多",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "sukunai",
    "kanji": "少ない",
    "kana": "すくない",
    "romaji": "sukunai",
    "meaning": "少",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "takai",
    "kanji": "高い",
    "kana": "たかい",
    "romaji": "takai",
    "meaning": "高；貴",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "yasui",
    "kanji": "安い",
    "kana": "やすい",
    "romaji": "yasui",
    "meaning": "便宜",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "ookii",
    "kanji": "大きい",
    "kana": "おおきい",
    "romaji": "ookii",
    "meaning": "大",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "chiisai",
    "kanji": "小さい",
    "kana": "ちいさい",
    "romaji": "chiisai",
    "meaning": "小",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "atui",
    "kanji": "暑い",
    "kana": "あつい",
    "romaji": "atsui",
    "meaning": "熱（天氣）",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "samui",
    "kanji": "寒い",
    "kana": "さむい",
    "romaji": "samui",
    "meaning": "冷（天氣）",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "atsui2",
    "kanji": "熱い",
    "kana": "あつい",
    "romaji": "atsui",
    "meaning": "燙；熱（物體）",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "tsumetai",
    "kanji": "冷たい",
    "kana": "つめたい",
    "romaji": "tsumetai",
    "meaning": "冰冷",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "omoshiroi",
    "kanji": "面白い",
    "kana": "おもしろい",
    "romaji": "omoshiroi",
    "meaning": "有趣",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "tanoshii",
    "kanji": "楽しい",
    "kana": "たのしい",
    "romaji": "tanoshii",
    "meaning": "快樂；愉快",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "isogashii",
    "kanji": "忙しい",
    "kana": "いそがしい",
    "romaji": "isogashii",
    "meaning": "忙碌",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "atarashii",
    "kanji": "新しい",
    "kana": "あたらしい",
    "romaji": "atarashii",
    "meaning": "新",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "furui",
    "kanji": "古い",
    "kana": "ふるい",
    "romaji": "furui",
    "meaning": "舊",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "i",
    "kanji": "いい",
    "kana": "いい",
    "romaji": "ii",
    "meaning": "好",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "warui",
    "kanji": "悪い",
    "kana": "わるい",
    "romaji": "warui",
    "meaning": "不好",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "shiroi",
    "kanji": "白い",
    "kana": "しろい",
    "romaji": "shiroi",
    "meaning": "白色",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kuroi",
    "kanji": "黒い",
    "kana": "くろい",
    "romaji": "kuroi",
    "meaning": "黑色",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "akai",
    "kanji": "赤い",
    "kana": "あかい",
    "romaji": "akai",
    "meaning": "紅色",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "aoi",
    "kanji": "青い",
    "kana": "あおい",
    "romaji": "aoi",
    "meaning": "藍色；綠色",
    "level": "N5",
    "tag": "形容詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "taberu",
    "kanji": "食べる",
    "kana": "たべる",
    "romaji": "taberu",
    "meaning": "吃",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "nomu",
    "kanji": "飲む",
    "kana": "のむ",
    "romaji": "nomu",
    "meaning": "喝",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "ikiru",
    "kanji": "行く",
    "kana": "いく",
    "romaji": "iku",
    "meaning": "去",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kuru",
    "kanji": "来る",
    "kana": "くる",
    "romaji": "kuru",
    "meaning": "來",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kaeru",
    "kanji": "帰る",
    "kana": "かえる",
    "romaji": "kaeru",
    "meaning": "回去",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "miru",
    "kanji": "見る",
    "kana": "みる",
    "romaji": "miru",
    "meaning": "看",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kiku",
    "kanji": "聞く",
    "kana": "きく",
    "romaji": "kiku",
    "meaning": "聽；問",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "yomu",
    "kanji": "読む",
    "kana": "よむ",
    "romaji": "yomu",
    "meaning": "讀",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kaku",
    "kanji": "書く",
    "kana": "かく",
    "romaji": "kaku",
    "meaning": "寫",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "hanasu",
    "kanji": "話す",
    "kana": "はなす",
    "romaji": "hanasu",
    "meaning": "說話",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "hanasu",
    "kanji": "話す",
    "kana": "はなす",
    "romaji": "hanasu",
    "meaning": "說話",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kau",
    "kanji": "買う",
    "kana": "かう",
    "romaji": "kau",
    "meaning": "買",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "au",
    "kanji": "会う",
    "kana": "あう",
    "romaji": "au",
    "meaning": "見面",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "okiru",
    "kanji": "起きる",
    "kana": "おきる",
    "romaji": "okiru",
    "meaning": "起床",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "neru",
    "kanji": "寝る",
    "kana": "ねる",
    "romaji": "neru",
    "meaning": "睡覺",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "hataraku",
    "kanji": "働く",
    "kana": "はたらく",
    "romaji": "hataraku",
    "meaning": "工作",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "yasumu",
    "kanji": "休む",
    "kana": "やすむ",
    "romaji": "yasumu",
    "meaning": "休息",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "benkyou",
    "kanji": "勉強",
    "kana": "べんきょう",
    "romaji": "benkyou",
    "meaning": "學習",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "wakaru",
    "kanji": "分かる",
    "kana": "わかる",
    "romaji": "wakaru",
    "meaning": "明白；懂",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "suru",
    "kanji": "する",
    "kana": "する",
    "romaji": "suru",
    "meaning": "做",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "arimasu",
    "kanji": "あります",
    "kana": "あります",
    "romaji": "arimasu",
    "meaning": "有（物品）",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "imasu",
    "kanji": "います",
    "kana": "います",
    "romaji": "imasu",
    "meaning": "有（人或動物）",
    "level": "N5",
    "tag": "動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "suki",
    "kanji": "好き",
    "kana": "すき",
    "romaji": "suki",
    "meaning": "喜歡",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kirai",
    "kanji": "嫌い",
    "kana": "きらい",
    "romaji": "kirai",
    "meaning": "討厭；不喜歡",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "genkidesu",
    "kanji": "元気",
    "kana": "げんき",
    "romaji": "genki",
    "meaning": "精神好；健康",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "shizuka",
    "kanji": "静か",
    "kana": "しずか",
    "romaji": "shizuka",
    "meaning": "安靜",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "kirei",
    "kanji": "きれい",
    "kana": "きれい",
    "romaji": "kirei",
    "meaning": "漂亮；乾淨",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "benri",
    "kanji": "便利",
    "kana": "べんり",
    "romaji": "benri",
    "meaning": "方便",
    "level": "N5",
    "tag": "形容動詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "desune",
    "kanji": "ですね",
    "kana": "ですね",
    "romaji": "desu ne",
    "meaning": "是呢",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "arigatou",
    "kanji": "ありがとう",
    "kana": "ありがとう",
    "romaji": "arigatou",
    "meaning": "謝謝",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "sumimasen",
    "kanji": "すみません",
    "kana": "すみません",
    "romaji": "sumimasen",
    "meaning": "不好意思；對不起",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "ohayou",
    "kanji": "おはよう",
    "kana": "おはよう",
    "romaji": "ohayou",
    "meaning": "早安",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "konnichiwa",
    "kanji": "こんにちは",
    "kana": "こんにちは",
    "romaji": "konnichiwa",
    "meaning": "你好；午安",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "konbanwa",
    "kanji": "こんばんは",
    "kana": "こんばんは",
    "romaji": "konbanwa",
    "meaning": "晚安；晚上好",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "sayounara",
    "kanji": "さようなら",
    "kana": "さようなら",
    "romaji": "sayounara",
    "meaning": "再見",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "hai",
    "kanji": "はい",
    "kana": "はい",
    "romaji": "hai",
    "meaning": "是；好的",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "iie",
    "kanji": "いいえ",
    "kana": "いいえ",
    "romaji": "iie",
    "meaning": "不是；不",
    "level": "N5",
    "tag": "表達",
    "example": "",
    "translation": ""
  },
  {
    "id": "doko",
    "kanji": "どこ",
    "kana": "どこ",
    "romaji": "doko",
    "meaning": "哪裡",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "nani",
    "kanji": "何",
    "kana": "なに",
    "romaji": "nani",
    "meaning": "什麼",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "dare",
    "kanji": "誰",
    "kana": "だれ",
    "romaji": "dare",
    "meaning": "誰",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "itsu",
    "kanji": "いつ",
    "kana": "いつ",
    "romaji": "itsu",
    "meaning": "什麼時候",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "nanji",
    "kanji": "何時",
    "kana": "なんじ",
    "romaji": "nanji",
    "meaning": "幾點",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "ikura",
    "kanji": "いくら",
    "kana": "いくら",
    "romaji": "ikura",
    "meaning": "多少錢",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "doushite",
    "kanji": "どうして",
    "kana": "どうして",
    "romaji": "doushite",
    "meaning": "為什麼",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  },
  {
    "id": "dou",
    "kanji": "どう",
    "kana": "どう",
    "romaji": "dou",
    "meaning": "如何",
    "level": "N5",
    "tag": "疑問詞",
    "example": "",
    "translation": ""
  }
];
const WORDS = Array.from(new Map([...LEGACY_WORDS.filter(word=>word.level==='N5'),...N5_WORDS].map(word=>[word.id,word])).values());
const KANA_EXTRA = [
 ['が','ga','ガ'],['ぎ','gi','ギ'],['ぐ','gu','グ'],['げ','ge','ゲ'],['ご','go','ゴ'],['ざ','za','ザ'],['じ','ji','ジ'],['ず','zu','ズ'],['ぜ','ze','ゼ'],['ぞ','zo','ゾ'],['だ','da','ダ'],['ぢ','ji','ヂ'],['づ','zu','ヅ'],['で','de','デ'],['ど','do','ド'],['ば','ba','バ'],['び','bi','ビ'],['ぶ','bu','ブ'],['べ','be','ベ'],['ぼ','bo','ボ'],['ぱ','pa','パ'],['ぴ','pi','ピ'],['ぷ','pu','プ'],['ぺ','pe','ペ'],['ぽ','po','ポ'],
 ['きゃ','kya','キャ'],['きゅ','kyu','キュ'],['きょ','kyo','キョ'],['しゃ','sha','シャ'],['しゅ','shu','シュ'],['しょ','sho','ショ'],['ちゃ','cha','チャ'],['ちゅ','chu','チュ'],['ちょ','cho','チョ'],['にゃ','nya','ニャ'],['にゅ','nyu','ニュ'],['にょ','nyo','ニョ'],['ひゃ','hya','ヒャ'],['ひゅ','hyu','ヒュ'],['ひょ','hyo','ヒョ'],['みゃ','mya','ミャ'],['みゅ','myu','ミュ'],['みょ','myo','ミョ'],['りゃ','rya','リャ'],['りゅ','ryu','リュ'],['りょ','ryo','リョ'],['ぎゃ','gya','ギャ'],['ぎゅ','gyu','ギュ'],['ぎょ','gyo','ギョ'],['じゃ','ja','ジャ'],['じゅ','ju','ジュ'],['じょ','jo','ジョ'],['びゃ','bya','ビャ'],['びゅ','byu','ビュ'],['びょ','byo','ビョ'],['ぴゃ','pya','ピャ'],['ぴゅ','pyu','ピュ'],['ぴょ','pyo','ピョ']
];
const KANA_BANK=[...HIRA.map(([kana,romaji],i)=>({id:`hira-${kana}`,kana,romaji,script:'平假名'})),...HIRA.map(([kana,romaji],i)=>({id:`kata-${KATA[i]}`,kana:KATA[i],romaji,script:'片假名'})),...KANA_EXTRA.flatMap(([h,romaji,k])=>[{id:`hira-${h}`,kana:h,romaji,script:'平假名'},{id:`kata-${k}`,kana:k,romaji,script:'片假名'}])];
const BASE_GRAMMAR = [
  {id:'wa',title:'主題助詞 は',label:'は',level:'N5',pattern:'名詞 + は + 說明',example:'私は学生です。',translation:'我是學生。',note:'用 は 標示句子的主題。雖然寫作 は，但作助詞時讀作 wa。',prompt:'句子「私は学生です」裡，哪個助詞標示主題？',options:['は','を','に','が'],answer:'は'},
  {id:'wo',title:'受詞助詞 を',label:'を',level:'N5',pattern:'名詞 + を + 動詞',example:'水を飲みます。',translation:'喝水。',note:'用 を 標示動作的直接對象。現代日語中通常讀作 o。',prompt:'「本を読みます」的動作對象是哪個？',options:['本','読みます','は','に'],answer:'本'},
  {id:'desu',title:'禮貌句尾 です',label:'です',level:'N5',pattern:'名詞 + です',example:'これは本です。',translation:'這是書。',note:'です 放在名詞或形容動詞後，形成禮貌語氣的判斷句。',prompt:'「這是書」要用哪個句尾？',options:['です','ます','でしたら','たい'],answer:'です'},
  {id:'ni',title:'時間助詞 に',label:'に',level:'N5',pattern:'時間 + に + 動詞',example:'七時に起きます。',translation:'七點起床。',note:'に 常用來標示明確的時間點，也可以標記移動目的地。',prompt:'明確的時間點後通常接哪個助詞？',options:['に','で','と','も'],answer:'に'},
  {id:'de',title:'場所助詞 で',label:'で',level:'N5',pattern:'場所 + で + 動作',example:'図書館で勉強します。',translation:'在圖書館讀書。',note:'在某個場所進行動作時，場所後面使用 で。',prompt:'在咖啡店喝咖啡，場所後接？',options:['で','へ','が','の'],answer:'で'},
  {id:'ga',title:'主語助詞 が',label:'が',level:'N5',pattern:'主語 + が + 動詞',example:'猫がいます。',translation:'有一隻貓。',note:'が 常標示新資訊、存在的事物，也用於強調主語。',prompt:'「有一隻貓」裡標示存在主語的是？',options:['が','に','を','から'],answer:'が'},
  {id:'masu',title:'動詞禮貌形 ます',label:'ます',level:'N5',pattern:'動詞連用形 + ます',example:'毎日、日本語を勉強します。',translation:'每天學日文。',note:'ます 接在動詞連用形後，表達禮貌的現在或未來動作。',prompt:'「每天學習」的禮貌動詞句尾是？',options:['ます','です','だ','た'],answer:'ます'},
  {id:'te',title:'て形連接',label:'て',level:'N5',pattern:'動詞て形 + ください',example:'ちょっと待ってください。',translation:'請稍等一下。',note:'動詞て形可以連接動作，也能和 ください 組成禮貌請求。',prompt:'禮貌地說「請等一下」，て形後接？',options:['ください','でした','ましょう','たい'],answer:'ください'},
];
const N5_GRAMMAR = [
 ['desu-negative','ではありません','禮貌否定','名詞 + ではありません','私は先生ではありません。','我不是老師。','名詞句的否定形式是？',['ではありません','でした','ます','たい'],'ではありません'],
 ['desu-past','でした','禮貌過去','名詞 + でした','昨日は休みでした。','昨天是休假。','「昨天是休假」應使用哪個句尾？',['でした','です','ません','たい'],'でした'],
 ['desu-past-negative','ではありませんでした','禮貌過去否定','名詞 + ではありませんでした','昨日は日曜日ではありませんでした。','昨天不是星期日。','名詞句「不是……（過去）」的句尾？',['ではありませんでした','ではありません','でした','ます'],'ではありませんでした'],
 ['question-ka','か','疑問句','句子 + か','これは本ですか。','這是書嗎？','句尾加什麼可形成禮貌疑問句？',['か','ね','よ','を'],'か'],
 ['particle-mo','も','也','名詞 + も','私も学生です。','我也是學生。','「我也是學生」中「也」用哪個助詞？',['も','は','を','で'],'も'],
 ['particle-no','の','所屬','名詞 + の + 名詞','これは私の本です。','這是我的書。','表示「我的書」中連接所屬的助詞？',['の','に','が','へ'],'の'],
 ['particle-e','へ','移動方向','地點 + へ + 移動動詞','学校へ行きます。','去學校。','表示移動方向「去學校」用哪個助詞？',['へ','で','を','も'],'へ'],
 ['particle-to','と','和；引用','名詞 + と','友達と映画を見ます。','和朋友看電影。','「和朋友」用哪個助詞？',['と','に','が','を'],'と'],
 ['particle-kara-made','から／まで','起點與終點','時間／地點 + から + まで','九時から五時まで働きます。','從九點工作到五點。','「從九點到五點」的起點助詞？',['から','まで','へ','で'],'から'],
 ['particle-ya','や','不完全列舉','名詞 + や + 名詞','りんごやバナナを買いました。','買了蘋果、香蕉等。','列舉「蘋果、香蕉等」用哪個助詞？',['や','と','も','は'],'や'],
 ['particle-ne','ね','確認語氣','句子 + ね','今日は暑いですね。','今天很熱呢。','句尾「ね」主要帶有什麼語氣？',['確認、共感','過去','否定','命令'],'確認、共感'],
 ['particle-yo','よ','告知強調','句子 + よ','駅はあそこですよ。','車站就在那裡喔。','句尾「よ」常用來做什麼？',['告知、提醒','表示所屬','表示過去','表示否定'],'告知、提醒'],
 ['masu-negative','ません','禮貌否定','動詞ます形去ます + ません','今日は働きません。','今天不工作。','「今天不工作」動詞句尾？',['ません','ました','です','でした'],'ません'],
 ['masu-past','ました','禮貌過去','動詞ます形去ます + ました','昨日、本を読みました。','昨天讀了書。','「昨天讀了書」使用哪種動詞句尾？',['ました','ます','ません','です'],'ました'],
 ['masu-past-negative','ませんでした','禮貌過去否定','動詞ます形去ます + ませんでした','昨日は勉強しませんでした。','昨天沒有讀書。','「昨天沒有讀書」應使用？',['ませんでした','ました','ません','でした'],'ませんでした'],
 ['te-kudasai','てください','請求','動詞て形 + ください','名前を書いてください。','請寫下名字。','禮貌請求「請寫」使用什麼？',['てください','ています','てもいい','たい'],'てください'],
 ['te-iru','ています','正在進行','動詞て形 + います','今、ご飯を食べています。','現在正在吃飯。','「正在吃飯」的句型？',['ています','てください','ません','でした'],'ています'],
 ['te-mo-ii','てもいい','許可','動詞て形 + もいいです','ここに座ってもいいです。','可以坐在這裡。','表示「可以坐」的句型？',['てもいい','てはいけない','てください','ません'],'てもいい'],
 ['te-wa-ikenai','てはいけない','禁止','動詞て形 + はいけません','ここで写真を撮ってはいけません。','不能在這裡拍照。','表示「不可以拍照」的句型？',['てはいけません','てもいいです','てください','ています'],'てはいけません'],
 ['tai','たい','想做','動詞ます形去ます + たい','日本へ行きたいです。','我想去日本。','表示「想去」的句型？',['たい','ません','でした','ながら'],'たい'],
 ['mashou','ましょう','一起做吧','動詞ます形去ます + ましょう','一緒に帰りましょう。','一起回去吧。','邀請對方「一起回去吧」使用？',['ましょう','ませんでした','たい','でした'],'ましょう'],
 ['masenka','ませんか','邀請','動詞ます形去ます + ませんか','コーヒーを飲みませんか。','要不要喝咖啡？','委婉邀請「要不要喝」使用？',['ませんか','ません','ました','でしょう'],'ませんか'],
 ['adjective-i-negative','くない','い形容詞否定','い形容詞去い + くない','この本は高くないです。','這本書不貴。','い形容詞「不貴」的變化？',['高くない','高いじゃない','高かった','高くでした'],'高くない'],
 ['adjective-i-past','かった','い形容詞過去','い形容詞去い + かった','昨日は暑かったです。','昨天很熱。','い形容詞「很熱（過去）」的變化？',['暑かった','暑いでした','暑くない','暑かったですか'],'暑かった'],
 ['adjective-na','な形容詞','な形容詞修飾名詞','な形容詞 + な + 名詞','静かな町です。','是安靜的城鎮。','な形容詞修飾名詞時中間要加？',['な','の','に','を'],'な'],
 ['adjective-na-negative','じゃありません','な形容詞否定','な形容詞 + じゃありません','この町は静かじゃありません。','這個城鎮不安靜。','「不安靜」的禮貌否定？',['じゃありません','くない','でした','ません'],'じゃありません'],
 ['desire-noun-ga','がほしい','想要物品','名詞 + がほしい','新しい車がほしいです。','我想要新車。','表示想要一件物品使用？',['がほしい','をたい','がます','をください'],'がほしい'],
 ['purpose-ni','に行く','去做某事','動詞ます形去ます + に行く','本を買いに行きます。','去買書。','「去買書」的目的助詞？',['に','で','を','と'],'に'],
 ['because-kara','から理由','因為','句子 + から','忙しいですから、行きません。','因為很忙，所以不去。','表示原因「因為」常用？',['から','まで','しか','でも'],'から'],
 ['counter-tsu','つ','一般物品數量','ひとつ、ふたつ、みっつ…','りんごを二つください。','請給我兩顆蘋果。','一般物品數量「兩個」讀作？',['ふたつ','にこ','ふたり','にまい'],'ふたつ'],
 ['counter-people','人','人數','ひとり、ふたり、さんにん…','家族は三人です。','家裡有三個人。','三個人使用哪個量詞？',['三人','三つ','三枚','三台'],'三人'],
 ['counter-time','時間','時間長度','數字 + 時間','二時間勉強しました。','讀了兩個小時。','「兩個小時」應使用？',['二時間','二時','二分','二年'],'二時間'],
 ['comparison-yori','より','比較','A は B より + 形容詞','電車はバスより速いです。','電車比公車快。','表示「比公車快」使用？',['より','ほど','しか','まで'],'より'],
 ['comparison-hou','のほうが','比較中較…','A より B のほうが + 形容詞','バスより電車のほうが速いです。','比起公車，電車比較快。','「電車比較快」的標記？',['のほうが','のこと','のため','のあと'],'のほうが'],
];
const GRAMMAR = [...BASE_GRAMMAR, ...N5_GRAMMAR.map(([id,label,title,pattern,example,translation,prompt,options,answer])=>({id,label,title,pattern,example,translation,prompt,options,answer,level:'N5',note:`${title}：${pattern}`}))];
const NAV = [
  ['today','⌂','課程路徑'],['study','あ','練習室'],['words','文','單字本'],['grammar','文','文法'],['review','↻','複習'],
];
const todayKey = () => new Date().toLocaleDateString('en-CA');
const fresh = () => ({version:4,xp:0,streak:0,lastStudy:'',date:todayKey(),daily:{kana:0,words:0,grammar:0,review:0,focus:0,lessons:0,xp:0},learnedKana:[],learnedWords:[],bookmarks:[],reviews:{},studyDays:[],goal:20,focusSessions:0,completedLessons:[],learnedGrammar:[],reviewFilter:'all'});
const N5_UNITS = [
 {unit:1,title:'平假名起步',goal:'學會看懂最基本的平假名字形與讀音。'},
 {unit:2,title:'片假名入門',goal:'讀懂外來語和常見片假名。'},
 {unit:3,title:'人物與問候',goal:'認識家人、朋友，開始簡單自我介紹。'},
 {unit:4,title:'數字與時間',goal:'日期、星期、時間與數量表達。'},
 {unit:5,title:'助詞與句子',goal:'用助詞把名詞、地點和動作連在一起。'},
 {unit:6,title:'日常動詞',goal:'學習常用動作、禮貌形與存在句。'},
 {unit:7,title:'描述與邀請',goal:'表達特徵、喜好、願望與簡單請求。'},
 {unit:8,title:'閱讀與聽力',goal:'看懂生活短文、公告並聽取重要資訊。'},
];
const COURSE = [
 {id:'hira-vowels',title:'あ行母音',description:'認識五個基本母音。',kind:'kana',unit:1,badge:'あ',kanaGroup:'vowels',teaching:'日文母音只有五個，發音清楚而穩定。先把 あ・い・う・え・お 唸熟，其他音節都是由這些母音延伸。',example:'あ・い・う・え・お',translation:'a・i・u・e・o'},
 {id:'hira-ka-sa',title:'か行與さ行',description:'練習 k、s 音節。',kind:'kana',unit:1,badge:'か',kanaGroup:'ks',teaching:'假名每一列大多共用同一個子音，再依序接五個母音。注意 し 唸作 shi。',example:'か・き・く・け・こ ／ さ・し・す・せ・そ',translation:'ka・ki・ku・ke・ko ／ sa・shi・su・se・so'},
 {id:'hira-ta-na',title:'た行與な行',description:'分辨容易混淆的音。',kind:'kana',unit:1,badge:'た',kanaGroup:'tn',teaching:'熟悉た行和な行。ち 唸作 chi、つ 唸作 tsu，不照字母直讀。',example:'た・ち・つ・て・と ／ な・に・ぬ・ね・の',translation:'ta・chi・tsu・te・to ／ na・ni・nu・ne・no'},
 {id:'hira-ha-ma',title:'は行與ま行',description:'讀出生活常見音節。',kind:'kana',unit:1,badge:'は',kanaGroup:'hm',teaching:'ふ 的發音接近 fu。助詞 は 寫作 ha，但當主題助詞時讀 wa。',example:'は・ひ・ふ・へ・ほ ／ ま・み・む・め・も',translation:'ha・hi・fu・he・ho ／ ma・mi・mu・me・mo'},
 {id:'hira-y-r-w',title:'や行、ら行與ん',description:'完成基本五十音。',kind:'kana',unit:1,badge:'や',kanaGroup:'yrw',teaching:'や行只有三個音。日文 r 音介於 r、l 之間；ん 是唯一獨立的鼻音假名。',example:'や・ゆ・よ ／ ら・り・る・れ・ろ ／ わ・を・ん',translation:'ya・yu・yo ／ ra・ri・ru・re・ro ／ wa・o・n'},
 {id:'hira-dakuten',title:'濁音與半濁音',description:'把清音變成濁音。',kind:'kana',unit:1,badge:'が',kanaGroup:'voiced',teaching:'兩點濁點會改變聲音：か行變 ga 行，さ行變 za 行等；圓圈則把 h 行變成 p 行。',example:'が・ざ・だ・ば・ぱ',translation:'ga・za・da・ba・pa'},
 {id:'hira-combos',title:'拗音與小ゃゅょ',description:'練習合併音節。',kind:'kana',unit:1,badge:'きゃ',kanaGroup:'combo',teaching:'i 段假名後接小寫 ゃ・ゅ・ょ 會合成一拍，例如 き + 小ゃ = きゃ。',example:'きゃ・しゅ・ちょ・りゅ',translation:'kya・shu・cho・ryu'},
 {id:'kata-vowels',title:'片假名母音',description:'認識片假名字形。',kind:'kana',unit:2,badge:'ア',kanaGroup:'vowels',script:'kata',teaching:'片假名主要用在外來語、外國人名和擬聲詞。先記住與平假名對應的五個母音。',example:'ア・イ・ウ・エ・オ',translation:'a・i・u・e・o'},
 {id:'kata-core',title:'片假名主要音節',description:'讀出外來語的基本拼法。',kind:'kana',unit:2,badge:'カ',kanaGroup:'core-kata',script:'kata',teaching:'片假名的讀音和對應平假名相同，形狀不同。日文外來語常由片假名書寫。',example:'コーヒー ／ テレビ ／ バス',translation:'咖啡 ／ 電視 ／ 公車'},
 {id:'kata-voiced',title:'片假名濁音與拗音',description:'練習外來語中的特殊音。',kind:'kana',unit:2,badge:'ギ',kanaGroup:'voiced-combo-kata',script:'kata',teaching:'片假名也有濁音、半濁音和拗音；長音符號 ー 會延長前一個母音。',example:'ギター ／ チョコレート ／ スーパー',translation:'吉他 ／ 巧克力 ／ 超市'},
 {id:'greet-basics',title:'基本問候語',description:'在一天不同時段打招呼。',kind:'words',unit:3,badge:'こんにちは',wordTags:['表達'],wordIds:['ohayou','konnichiwa','konbanwa','sayounara','arigatou','sumimasen'],teaching:'問候語會隨時段改變。おはよう 常用於早上，こんにちは 用於白天，こんばんは 用於晚上。',example:'こんにちは。お元気ですか。',translation:'你好，你好嗎？'},
 {id:'self-intro',title:'自我介紹',description:'介紹姓名、身分和國籍。',kind:'grammar',unit:3,badge:'わたし',grammarIds:['wa','desu','question-ka','particle-no'],teaching:'基本介紹句是「名詞 + は + 名詞 + です」。は 標記談論主題，です 放在句尾保持禮貌。',example:'私は学生です。',translation:'我是學生。'},
 {id:'people-family',title:'家人與朋友',description:'說出身邊的人物關係。',kind:'words',unit:3,badge:'かぞく',wordTags:['人物'],teaching:'家人稱呼會依對話對象改變。這裡先熟悉自己家人的稱呼和一般人物名稱。',example:'家族は四人です。',translation:'我家有四個人。'},
 {id:'demonstratives',title:'這個、那個、哪一個',description:'用指示詞指認身邊物品。',kind:'grammar',unit:3,badge:'これ',grammarIds:['particle-no','particle-mo','wo'],teaching:'これ 指靠近說話者的物品，それ 指靠近聽者的物品，あれ 指兩人都較遠的物品。',example:'これは私の本です。',translation:'這是我的書。'},
 {id:'n5-counters',title:'數字與量詞',description:'練習人數、時數和物品數量。',kind:'grammar',unit:3,badge:'ひとつ',grammarIds:['counter-tsu','counter-people','counter-time'],teaching:'數量詞依計算對象改變。一般物品可先記 ひとつ、ふたつ；人數有 ひとり、ふたり 等特殊讀法。',example:'りんごを二つください。',translation:'請給我兩顆蘋果。'},
 {id:'weekdays',title:'星期與日期',description:'討論今天、明天和星期幾。',kind:'words',unit:4,badge:'きょう',wordTags:['時間'],teaching:'星期名稱以曜日結尾。日期表達常用今日、明日、昨日等基本詞。',example:'今日は月曜日です。',translation:'今天是星期一。'},
 {id:'clock',title:'時間與作息',description:'問時間並描述一天。',kind:'grammar',unit:4,badge:'なんじ',grammarIds:['ni','masu','masu-past'],teaching:'說明明確時刻時，時間後面加 に。時間長度則使用「數字 + 時間」，不加に。',example:'七時に起きます。',translation:'我七點起床。'},
 {id:'daily-schedule',title:'日常行程',description:'描述每天做的事。',kind:'words',unit:4,badge:'まいにち',wordTags:['時間','動詞'],teaching:'用 毎日（まいにち）描述習慣，動詞使用禮貌形 ます。',example:'毎日、日本語を勉強します。',translation:'我每天學日文。'},
 {id:'particle-wa-ga',title:'主題 は 與主語 が',description:'理解句子的核心助詞。',kind:'grammar',unit:5,badge:'は・が',grammarIds:['wa','ga','particle-mo'],teaching:'は 標記談話主題；が 常標記新出現的主語或存在的事物。初學時先留意句子正在介紹什麼。',example:'猫がいます。',translation:'有一隻貓。'},
 {id:'particle-no',title:'所屬與名詞 の',description:'把兩個名詞連起來。',kind:'grammar',unit:5,badge:'の',grammarIds:['particle-no'],teaching:'の 連接名詞，表示所屬或分類。',example:'これは先生の本です。',translation:'這是老師的書。'},
 {id:'particle-time-place',title:'時間に、場所で',description:'說明時間點與動作地點。',kind:'grammar',unit:5,badge:'に・で',grammarIds:['ni','de','particle-e'],teaching:'に 可標記明確時間或移動目的地；で 標記動作發生的場所或使用的工具。',example:'図書館で勉強します。',translation:'我在圖書館讀書。'},
 {id:'particle-objects',title:'受詞を與並列と',description:'表達動作對象和一起做事的人。',kind:'grammar',unit:5,badge:'を・と',grammarIds:['wo','particle-to','particle-ya'],teaching:'を 標記動作直接對象。と 可表示一起行動的對象，也能完整列舉名詞。',example:'友達と映画を見ます。',translation:'我和朋友看電影。'},
 {id:'particle-kara',title:'從…到…',description:'表達時間和地點範圍。',kind:'grammar',unit:5,badge:'から',grammarIds:['particle-kara-made','because-kara'],teaching:'から 表示起點，也可以接在句子後表示原因；まで 表示終點。',example:'九時から五時まで働きます。',translation:'我從九點工作到五點。'},
 {id:'verb-masu',title:'動詞禮貌形',description:'建立日常動詞句。',kind:'grammar',unit:6,badge:'ます',grammarIds:['masu','masu-negative'],teaching:'動詞ます形用於禮貌表達。否定現在式把 ます 換成 ません。',example:'毎日、本を読みます。',translation:'我每天讀書。'},
 {id:'verb-past',title:'過去式與否定過去',description:'描述昨天做過或沒做的事。',kind:'grammar',unit:6,badge:'ました',grammarIds:['masu-past','masu-past-negative','desu-past'],teaching:'禮貌過去式使用 ました；過去否定使用 ませんでした。',example:'昨日、映画を見ました。',translation:'昨天看了電影。'},
 {id:'verb-movement',title:'去、來與回家',description:'描述移動方向。',kind:'words',unit:6,badge:'いく',wordTags:['動詞','地點'],teaching:'行く 表示去、来る 表示來、帰る 表示回去。目的地後可接 へ 或 に。',example:'学校へ行きます。',translation:'我去學校。'},
 {id:'verb-existence',title:'あります 與 います',description:'描述物品、人物和動物的位置。',kind:'words',unit:6,badge:'あります',wordIds:['arimasu','imasu','inu','neko','hon'],teaching:'あります 用於物品、植物等；います 用於人和動物。存在場所後常接 に。',example:'部屋に猫がいます。',translation:'房間裡有一隻貓。'},
 {id:'i-adjectives',title:'い形容詞',description:'描述大小、價格與感受。',kind:'grammar',unit:7,badge:'おおきい',grammarIds:['adjective-i-negative','adjective-i-past'],teaching:'い形容詞直接修飾名詞。否定形將 い 改成 くない，過去形改成 かった。',example:'この本はおもしろいです。',translation:'這本書很有趣。'},
 {id:'na-adjectives',title:'な形容詞',description:'描述個性、地方和狀態。',kind:'grammar',unit:7,badge:'しずか',grammarIds:['adjective-na','adjective-na-negative'],teaching:'な形容詞放在名詞前要加 な；句尾使用 です。',example:'静かな町です。',translation:'這是一座安靜的城鎮。'},
 {id:'likes-wants',title:'喜好與願望',description:'表達喜歡、討厭和想要。',kind:'grammar',unit:7,badge:'すき',grammarIds:['suki','tai','desire-noun-ga'],teaching:'喜好常用「名詞が好きです」。想做某事用動詞ます形去掉ます，再加たい。',example:'日本の映画が好きです。',translation:'我喜歡日本電影。'},
 {id:'requests-invites',title:'請求與邀請',description:'禮貌地提出請求或邀請。',kind:'grammar',unit:7,badge:'ください',grammarIds:['te-kudasai','te-mo-ii','te-wa-ikenai','mashou','masenka'],teaching:'動詞て形加 ください 是請求；ましょう 和 ませんか 可用來邀請對方。',example:'一緒に行きませんか。',translation:'要不要一起去？'},
 {id:'reading-short',title:'生活短文閱讀',description:'從短文找出時間、人物和事件。',kind:'reading',unit:8,badge:'読',teaching:'閱讀時先找疑問詞，再回文中定位答案。何時找時間、どこ找地點、だれ找人物。',example:'朝ご飯を食べて、七時半に家を出ます。',translation:'吃過早餐後，七點半出門。'},
 {id:'text-flow',title:'文章脈絡與連接詞',description:'理解句子之間的順序與原因。',kind:'text-grammar',unit:8,badge:'文',teaching:'それから 表示接續事件，ですから 表示理由結果。閱讀時留意時間詞和連接詞。',example:'雨ですから、うちにいます。',translation:'因為下雨，所以待在家裡。'},
 {id:'info-reading',title:'公告與資訊查找',description:'閱讀營業時間、約會訊息和簡單告示。',kind:'information',unit:8,badge:'案内',teaching:'先找日期、時刻、地點等關鍵詞，再把題目問的資訊和告示內容對起來。',example:'営業時間：午前九時から午後六時まで。',translation:'營業時間：上午九點到下午六點。'},
 {id:'listening-core',title:'日常聽力理解',description:'聽取簡單對話中的時間、地點與物品。',kind:'listening',unit:8,badge:'聴',teaching:'聽力題會用裝置的日語語音合成朗讀。按播放按鈕後，抓住數字、地點和動作等關鍵字。',example:'駅の前で午後三時に会いましょう。',translation:'下午三點在車站前見面吧。'},
 {id:'n5-check',title:'N5 綜合挑戰',description:'混合假名、單字、文法、閱讀與聽力。',kind:'n5',unit:8,badge:'N5',teaching:'完成最後的綜合練習，確認五十音、詞彙、文法、閱讀和聽力的基礎能力。',example:'焦點不在速度，先讀懂題目再回答。',translation:'每天一點點就能持續進步。'},
];

let state = {...fresh(), page:'today', user:null, lessonIntro:false, script:'hira', studyMode:'kana', quiz:null, session:null, lessonComplete:null, pendingAnswer:null, selectedAnswer:null, selectedGrammar:0, wordFilter:'', wordCategory:'全部', wordSearch:'', reviewCard:null, reveal:false, focusLeft:0, focusRunning:false};
let deferredInstall = null;
let currentUser=null;
let migrateLegacyOnNextLogin=false;
let saveTimer;
let cloudSaveTimer;
let cloudProgressReady=false;
let toastTimer;
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const esc = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xpToLevel = xp => ({level:Math.floor(xp/250)+1,into:xp%250});
const isTauri = () => !!window.__TAURI__?.core?.invoke;
const invoke = (...args) => window.__TAURI__.core.invoke(...args);
const shuffle = list => [...list].sort(() => Math.random() - .5);
const currentDay = () => new Date().toLocaleDateString('en-CA');
const reviewFilters=[['all','全部 N5'],['word','單字'],['kana','假名'],['grammar','文法']];
function getReviewItems(filter='all'){ 
  const words=WORDS.map(w=>({reviewId:`word:${w.id}`,type:'word',front:w.kanji,reading:w.kana,romaji:w.romaji,meaning:w.meaning,level:'N5',tag:w.tag,speak:w.kanji,example:w.example,translation:w.translation,word:w}));
  const kana=KANA_BANK.map(k=>({reviewId:`kana:${k.id}`,type:'kana',script:k.script,front:k.kana,reading:k.romaji,romaji:k.script,meaning:`${k.script}「${k.kana}」讀作 ${k.romaji}`,level:'N5',tag:'假名',speak:k.kana}));
  const grammar=GRAMMAR.map(g=>({reviewId:`grammar:${g.id}`,type:'grammar',front:g.example,reading:g.label,meaning:`${g.title}：${g.note}`,level:'N5',tag:'文法',speak:g.example,example:g.example,translation:g.translation}));
  const all=[...words,...kana,...grammar];return filter==='all'?all:all.filter(item=>item.type===filter);
}
const reviewDue = (filter='all') => getReviewItems(filter).filter(item=>!state.reviews[item.reviewId]||state.reviews[item.reviewId].due<=Date.now()).sort((a,b)=>(state.reviews[a.reviewId]?.due||0)-(state.reviews[b.reviewId]?.due||0));
function migrateReviewKeys(reviews={}){const migrated={...reviews};for(const word of WORDS)if(migrated[word.id]&&!migrated[`word:${word.id}`])migrated[`word:${word.id}`]=migrated[word.id];return migrated;}

async function loadState(migrateLegacy=false){
  let cloudOkay=true;
  try{
    let saved=null;
    if(cloudEnabled)try{saved=await fetchCloudProgress(currentUser.id);}catch(error){cloudOkay=false;console.warn('Could not load cloud progress',error);toast('雲端進度暫時無法載入；目前資料保留在這部裝置。');}
    if(saved)localStorage.setItem(progressKey(currentUser.id),JSON.stringify(saved));
    if(!saved)saved=JSON.parse(localStorage.getItem(progressKey(currentUser.id))||'null');
    if(!saved&&migrateLegacy){saved=JSON.parse(localStorage.getItem('kotori-progress')||'null');if(!saved&&isTauri())saved=await invoke('load_progress');if(saved)localStorage.setItem(progressKey(currentUser.id),JSON.stringify(saved));}
    if(saved&&[2,3,4].includes(saved.version)){const legacyCourse={'kana-1':'hira-vowels','greet-1':'greet-basics','kana-2':'hira-ka-sa','grammar-1':'self-intro','food-1':'daily-schedule','kana-3':'hira-ta-na','grammar-2':'likes-wants','daily-1':'daily-schedule','grammar-3':'clock','city-1':'info-reading','kana-4':'kata-core','final-1':'n5-check'};const completed=[...new Set((saved.completedLessons||[]).map(id=>legacyCourse[id]||id).filter(id=>COURSE.some(node=>node.id===id)))];state={...state,...saved,user:currentUser,page:'today',daily:{...fresh().daily,...saved.daily},reviews:migrateReviewKeys(saved.reviews||{}),completedLessons:completed,learnedGrammar:saved.learnedGrammar||[],reviewFilter:'all'};}
  }catch(error){console.warn('Could not load progress',error);}
  state.user=currentUser;cloudProgressReady=cloudOkay;rollDay();
}
function progressSnapshot(){return {version:4,xp:state.xp,streak:state.streak,lastStudy:state.lastStudy,date:state.date,daily:state.daily,learnedKana:state.learnedKana,learnedWords:state.learnedWords,bookmarks:state.bookmarks,reviews:state.reviews,studyDays:state.studyDays,goal:state.goal,focusSessions:state.focusSessions,completedLessons:state.completedLessons,learnedGrammar:state.learnedGrammar||[]};}
function persist(){
  if(!currentUser)return;
  const data=progressSnapshot();
  try{localStorage.setItem(progressKey(currentUser.id),JSON.stringify(data));}catch(error){console.warn('Could not save progress',error);}
  if(cloudEnabled&&cloudProgressReady){const userId=currentUser.id;clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(()=>saveCloudProgress(userId,data).catch(error=>console.warn('Could not sync progress',error)),700);}
}
function rollDay(){
  const today=currentDay();
  if(state.date!==today){state.date=today;state.daily={...fresh().daily};}
  if(state.lastStudy){
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    if(state.lastStudy!==today&&state.lastStudy!==yesterday.toLocaleDateString('en-CA'))state.streak=0;
  }
  persist();
}
function recordStudy(kind,xp=0){
  rollDay();
  if(state.lastStudy!==currentDay()){
    const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
    state.streak=state.lastStudy===yesterday.toLocaleDateString('en-CA')?state.streak+1:1;
    state.lastStudy=currentDay();
  }
  state.daily[kind]=(state.daily[kind]||0)+1;
  state.xp+=xp;
  state.daily.xp=(state.daily.xp||0)+xp;
  state.studyDays=[...new Set([...(state.studyDays||[]),currentDay()])].slice(-7);
  persist();renderChrome();
}
async function answerMatches(answer,expected){
  if(isTauri())try{return await invoke('check_answer',{answer,expected});}catch{}
  return answer.trim().toLocaleLowerCase()===expected.trim().toLocaleLowerCase();
}
function speak(text){
  if(!('speechSynthesis' in window)){toast('此裝置目前沒有日語語音');return;}
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ja-JP';utterance.rate=Number(localStorage.getItem('kotori-voice-rate')||.88);speechSynthesis.speak(utterance);
}
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2100);}
function renderChrome(){
  $('#page-label').textContent=(NAV.find(n=>n[0]===state.page)||['today','','今天'])[2];
  $('#streak-value').textContent=state.streak;
  const due=reviewDue().length;
  const navHtml=NAV.map(([id,icon,label])=>`<button class="nav-link ${state.page===id?'active':''}" data-page="${id}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>${id==='review'&&due?`<span class="nav-count">${due}</span>`:''}</button>`).join('');
  $('#side-nav').innerHTML=navHtml;
  $('#mobile-nav').innerHTML=NAV.map(([id,icon,label])=>`<button class="mobile-link ${state.page===id?'active':''}" data-page="${id}"><span>${icon}</span><small>${label}</small></button>`).join('');
  const days=['一','二','三','四','五','六','日'];
  const now=new Date();const monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const dots=days.map((day,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);const key=date.toLocaleDateString('en-CA');return `<span class="week-dot ${(state.studyDays||[]).includes(key)?'done':''}" title="${key}">${(state.studyDays||[]).includes(key)?'✦':day}</span>`;}).join('');
  $('#sidebar-progress').innerHTML=`<div class="week-top"><small>本週學習</small><strong>${(state.studyDays||[]).length} / 7 天</strong></div><div class="week-dots">${dots}</div><div class="week-foot"><span>這週來種一朵花吧</span><span>✿</span></div>`;
  $('#profile-name').textContent=currentUser?.name||'我的日文旅程';const {level,into}=xpToLevel(state.xp);$('#profile-level').textContent=`Lv. ${level}  ·  ${250-into} XP 升級`;
}
function pageHead(kicker,title,desc,extra=''){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p class="page-desc">${desc}</p></div>${extra?`<div class="tool-row">${extra}</div>`:''}</div>`;}
function render(){renderChrome();const root=$('#content');
  if(state.page==='today')root.innerHTML=renderToday();
  else if(state.page==='study')root.innerHTML=renderStudy();
  else if(state.page==='words')root.innerHTML=renderWords();
  else if(state.page==='grammar')root.innerHTML=renderGrammar();
  else if(state.page==='review')root.innerHTML=renderReview();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderToday(){
  const nextIndex=COURSE.findIndex(node=>!state.completedLessons.includes(node.id));
  const activeIndex=nextIndex<0?COURSE.length:nextIndex;
  const groups=N5_UNITS;
  const map=groups.map(group=>{
    const lessons=COURSE.filter(n=>n.unit===group.unit);
    const done=lessons.filter(n=>state.completedLessons.includes(n.id)).length;
    const sectionLocked=lessons[0]&&COURSE.indexOf(lessons[0])>activeIndex;
    const rows=lessons.map((node,j)=>{
      const index=COURSE.indexOf(node),completed=state.completedLessons.includes(node.id),unlocked=index<=activeIndex,current=index===activeIndex;
      const icon=completed?'✓':current?node.badge:'🔒';
      return `<div class="path-row path-offset-${j%4}"><button class="path-node ${completed?'is-complete':''} ${current?'is-current':''} ${unlocked?'':'is-locked'}" ${unlocked?`data-lesson="${index}"`:''} ${unlocked?'':'disabled'} aria-label="${unlocked?'開始':'尚未解鎖'}：${node.title}"><span class="path-node-icon">${icon}</span></button><div class="path-node-copy"><b>${node.title}</b><small>${completed?'已完成 · 再練一次':current?`現在進行 · ${node.kind==='n5'?10:5} 題`:node.description}</small></div>${current?`<button class="btn btn-start-node" data-lesson="${index}">開始課程 →</button>`:''}</div>${j<lessons.length-1?'<div class="path-connector"></div>':''}`;
    }).join('');
    return `<section class="unit-card ${sectionLocked?'unit-locked':''}"><header class="unit-header"><div><span>第 ${group.unit} 單元</span><h2>${group.title}</h2><p>${group.goal}</p></div><span class="unit-count">${done} / ${lessons.length}</span></header><div class="path-track">${rows}</div>${group.unit<N5_UNITS.length?`<div class="checkpoint ${sectionLocked?'checkpoint-locked':''}"><span class="checkpoint-icon">▣</span><span><b>單元檢查點</b><small>完成本單元，解鎖下一段旅程</small></span><span class="checkpoint-state">${done===lessons.length?'✓':'🔒'}</span></div>`:''}</section>`;
  }).join('');
  const word=WORDS[new Date().getDate()%WORDS.length],quests=[['🎯','完成一堂課',state.daily.lessons||0,1],['⚡','獲得 30 XP',state.daily.xp||0,30],['↻','複習 3 張卡片',state.daily.review||0,3]],level=xpToLevel(state.xp);
  return `${pageHead('日本語コース · JAPANESE','日文課程','循著學習路徑，一課一課累積你的日文能力。','<button class="btn btn-primary" data-mode="n5" data-page="study">開始 N5 混合練習 →</button>')}<div class="journey-layout"><div class="journey-main"><div class="course-summary"><div class="course-flag">日</div><div class="course-summary-copy"><small>目前課程 · JAPANESE FOR TRADITIONAL CHINESE</small><b>日文入門旅程</b><span>等級 ${level.level}　·　${state.completedLessons.length} 堂課已完成</span></div><button class="round-icon course-more" aria-label="課程資訊">···</button></div>${map}</div><aside class="journey-aside"><section class="card daily-quests"><div class="card-head"><div><span class="section-kicker">每日任務</span><h2 class="card-title" style="margin-top:5px">今天的小目標</h2></div><span class="quest-chest">✦</span></div>${quests.map(([icon,title,value,total])=>`<div class="daily-quest"><span class="daily-quest-icon">${icon}</span><span class="daily-quest-copy"><b>${title}</b><span class="quest-meter"><i style="width:${Math.min(100,value/total*100)}%"></i></span></span><small>${Math.min(value,total)} / ${total}</small></div>`).join('')}<div class="quest-reward">全部課程免費開放，慢慢學也可以 ✨</div></section><section class="card free-card"><div class="free-badge">∞</div><b>全部課程免費</b><small>無愛心限制，錯了也能繼續練習。</small></section><section class="card word-spotlight"><div class="card-head"><span class="section-kicker">今日單字</span><button class="round-icon" data-speak="${esc(word.kanji)}" aria-label="播放單字發音">◖</button></div><div class="word-day-kanji">${word.kanji}</div><span class="word-reading">${word.kana}</span><p class="word-meaning">${word.meaning}</p><button class="text-link" data-page="words">打開單字本 →</button></section><section class="card league-card"><span class="league-badge">✦</span><span><small>本週學習</small><b>${state.studyDays.length} 天連續前進</b></span><button class="round-icon" data-page="review">→</button></section></aside></div>`;
}
function weekChart(){const labels=['一','二','三','四','五','六','日'];const now=new Date();const monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));return `<div class="week-chart">${labels.map((d,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);const done=state.studyDays.includes(date.toLocaleDateString('en-CA'));return `<div class="week-col"><span class="week-bar ${done?'active':''}" style="height:${done?42:13}px"></span><small class="week-day">${d}</small></div>`;}).join('')}</div>`;}
function formatTime(seconds){const mins=String(Math.floor(seconds/60)).padStart(2,'0');const secs=String(seconds%60).padStart(2,'0');return `${mins}:${secs}`;}
const N5_READING = [
 {text:'わたしは毎朝六時に起きます。朝ご飯を食べて、七時半に家を出ます。学校まで電車で三十分かかります。',question:'この人は何時に家を出ますか。',answer:'七時半',options:['七時半','六時','八時','六時半'],hint:'文章中に「七時半に家を出ます」とあります。'},
 {text:'田中さんは土曜日に友達とデパートへ行きました。シャツを一枚買って、レストランで昼ご飯を食べました。',question:'田中さんは何を買いましたか。',answer:'シャツ',options:['本','シャツ','靴','かばん'],hint:'「シャツを一枚買って」とあります。'},
 {text:'きのうは雨でしたから、わたしはうちで本を読みました。午後、母といっしょにケーキを作りました。',question:'きのう、午後に何をしましたか。',answer:'母とケーキを作りました',options:['友達と映画を見ました','母とケーキを作りました','学校へ行きました','公園を散歩しました'],hint:'午後の文に「母といっしょにケーキを作りました」とあります。'},
 {text:'この店は駅の前にあります。月曜日から金曜日までは朝九時から午後六時までです。土曜日と日曜日は休みです。',question:'この店は日曜日に開いていますか。',answer:'いいえ、休みです',options:['はい、朝から開いています','いいえ、休みです','午後だけ開いています','分かりません'],hint:'最後に「土曜日と日曜日は休みです」とあります。'},
 {text:'わたしの家族は四人です。父と母と兄とわたしです。兄は大学生で、毎日電車で大学へ行きます。',question:'大学生はだれですか。',answer:'兄',options:['父','母','兄','わたし'],hint:'「兄は大学生です」とあります。'},
];
const N5_LISTENING = [
 {audio:'すみません、駅はどこですか。',question:'男の人は何を探していますか。',answer:'車站',options:['車站','學校','醫院','圖書館'],hint:'「駅はどこですか」是在問車站的位置。'},
 {audio:'コーヒーを一つと、ケーキを二つください。',question:'客人點了什麼？',answer:'一杯咖啡和兩個蛋糕',options:['兩杯咖啡和一個蛋糕','一杯咖啡和兩個蛋糕','一杯茶和兩個蛋糕','兩杯茶和一個蛋糕'],hint:'聽「コーヒーを一つ」「ケーキを二つ」。'},
 {audio:'あした、七時に駅の前で会いましょう。',question:'他們在哪裡見面？',answer:'車站前',options:['學校裡','車站前','公園裡','家裡'],hint:'「駅の前で会いましょう」表示在車站前見面。'},
 {audio:'今日は寒いですね。窓を閉めてもいいですか。',question:'說話的人想做什麼？',answer:'關窗戶',options:['打開門','關窗戶','喝熱茶','回家'],hint:'「窓を閉めてもいいですか」是在詢問能否關窗。'},
 {audio:'日曜日は何をしましたか。友達と映画を見ました。',question:'日曜日に何をしましたか。',answer:'和朋友看電影',options:['和家人吃飯','和朋友看電影','在家讀書','去公園散步'],hint:'回答說「友達と映画を見ました」。'},
];
const N5_SENTENCE = [
 {sentence:'わたしは毎日、日本語を（　）。',answer:'勉強します',options:['勉強します','勉強でした','勉強です','勉強たい'],hint:'「毎日」搭配動作，使用動詞禮貌形。'},
 {sentence:'日曜日に友達（　）映画を見ました。',answer:'と',options:['と','を','へ','が'],hint:'一起做某事的對象用 と。'},
 {sentence:'この部屋は静か（　）きれいです。',answer:'で',options:['で','を','に','へ'],hint:'な形容詞用 で 連接並列描述。'},
 {sentence:'駅までバス（　）行きます。',answer:'で',options:['で','を','が','の'],hint:'交通工具後使用 で。'},
 {sentence:'朝ご飯を食べて（　）学校へ行きます。',answer:'から',options:['から','まで','しか','でも'],hint:'「做完……之後」可用 てから。'},
 {sentence:'教室で写真を撮って（　）。',answer:'はいけません',options:['はいけません','もいいです','ください','います'],hint:'教室禁止拍照，使用禁止表達。'},
];
const N5_TEXT_GRAMMAR = [
 {text:'わたしは日本語を勉強しています。毎日、学校のあとで図書館へ行きます。（　）で本を読みます。',question:'文章の流れに合う場所はどこですか。',answer:'図書館',options:['図書館','レストラン','病院','駅'],hint:'前文已說明放學後去圖書館，接著在那裡讀書。'},
 {text:'日曜日、山田さんは友達のうちへ行きました。二人で昼ご飯を作りました。（　）を食べてから、公園を散歩しました。',question:'空格放入哪個內容最合適？',answer:'ご飯',options:['ご飯','切手','新聞','電車'],hint:'前文提到一起做午餐，之後吃飯再散步。'},
 {text:'きのうはとても寒かったです。わたしは朝からうちにいました。午後、母とケーキを作りました。（　）、父が帰ってきました。',question:'哪個詞最適合表示接下來發生的事？',answer:'それから',options:['それから','しかし','でも','だから'],hint:'文章依時間順序敘述，使用「然後」。'},
 {text:'この店は月曜日から金曜日まで開いています。土曜日と日曜日は休みです。（　）、今日は日曜日ですから、店へ行きません。',question:'空格最適合放入哪個連接詞？',answer:'ですから',options:['ですから','それでは','でも','そして'],hint:'前句說星期日休息，後句是因此不去，表示原因結果。'},
];
const N5_INFORMATION = [
 {text:'さくらレストラン\n営業時間 11:00〜20:00\n休み：水曜日\n電話 03-1234-5678',question:'星期三下午一點可以在這裡吃飯嗎？',answer:'不行，星期三休息',options:['可以，下午一點營業','不行，星期三休息','不行，下午兩點才開','資料沒有寫'],hint:'營業時間雖涵蓋下午一點，但店家星期三公休。'},
 {text:'図書館のお知らせ\n月〜金 9:00〜18:00\n土 10:00〜16:00\n日曜日は休みです',question:'星期六圖書館幾點關門？',answer:'下午四點',options:['下午四點','下午六點','上午十點','星期六休息'],hint:'星期六開放時間是 10:00 到 16:00。'},
 {text:'田中さんへ\nあした、駅の前で午後三時に会いましょう。\n山田',question:'他們約在幾點？',answer:'下午三點',options:['上午三點','中午十二點','下午三點','下午五點'],hint:'訊息寫著「午後三時」。'},
 {text:'バスの時間\n駅 → 学校\n8:10 / 8:30 / 8:50\n学校まで 15分',question:'從車站搭 8:30 的公車，幾點到學校？',answer:'8:45',options:['8:15','8:30','8:45','8:50'],hint:'公車 8:30 出發，車程 15 分鐘。'},
];
const N5_COMPOSITION = [
 {question:'將詞語排成正確句子：わたし／学生／です',answer:'わたしは学生です。',options:['わたしは学生です。','学生はわたしですか。','ですわたし学生。','わたしを学生です。'],hint:'主題「わたし」後接 は，再接名詞和 です。'},
 {question:'將詞語排成正確句子：きのう／映画／見ました',answer:'きのう映画を見ました。',options:['きのう映画を見ました。','映画きのうを見ました。','見ました映画きのう。','きのう映画が見ます。'],hint:'受詞「映画」後接 を，再接過去式動詞。'},
 {question:'將詞語排成正確句子：友達／いっしょに／行きます',answer:'友達といっしょに行きます。',options:['友達といっしょに行きます。','いっしょに友達を行きます。','友達がいっしょを行きます。','行きます友達といっしょ。'],hint:'共同前往的對象後接 と。'},
 {question:'將詞語排成正確句子：七時／起きます',answer:'七時に起きます。',options:['七時に起きます。','起きます七時を。','七時で起きます。','七時が起きます。'],hint:'明確時間點後使用 に。'},
 {question:'將詞語排成正確句子：日本語／勉強したい',answer:'日本語を勉強したいです。',options:['日本語を勉強したいです。','日本語が勉強します。','勉強日本語たい。','日本語を勉強でした。'],hint:'動作對象用 を，願望用動詞ます形去ます加 たい。'},
];
const N5_PARAPHRASE = [
 {phrase:'とても',answer:'たいへん',options:['たいへん','ぜんぜん','たぶん','少し']},
 {phrase:'もう一度',answer:'もう一回',options:['もう一回','初めて','すぐに','ゆっくり']},
 {phrase:'すぐ',answer:'まもなく',options:['まもなく','いつも','ときどき','たくさん']},
 {phrase:'たくさん',answer:'多く',options:['多く','少し','全部','一つ']},
 {phrase:'ここ',answer:'この場所',options:['この場所','あの人','その時','どの本']},
];
const N5_ORTHOGRAPHY = [
 {kana:'がくせい',answer:'学生',options:['学生','先生','学校','生徒']},{kana:'としょかん',answer:'図書館',options:['図書館','病院','会社','喫茶店']},{kana:'でんしゃ',answer:'電車',options:['電車','電話','自転車','時計']},{kana:'びょういん',answer:'病院',options:['病院','美容院','図書館','大学']},{kana:'しんぶん',answer:'新聞',options:['新聞','雑誌','辞書','写真']},
];
const N5_CONTEXT = [
 {sentence:'毎朝、七時に（　）。',answer:'起きます',options:['起きます','寝ます','帰ります','買います'],hint:'早上七點開始一天，最合理的動作是起床。'},
 {sentence:'のどがかわきました。水を（　）。',answer:'飲みます',options:['飲みます','読みます','見ます','書きます'],hint:'口渴時會喝水。'},
 {sentence:'このかばんは三千円です。とても（　）です。',answer:'高い',options:['高い','寒い','広い','暗い'],hint:'三千日圓的包包在這個例句中價格很貴。'},
 {sentence:'駅まで遠いですから、バス（　）行きます。',answer:'で',options:['で','を','が','の'],hint:'搭乘交通工具前往時使用 で。'},
];
function makeQuestion(mode=state.studyMode,scope=null){
  if(mode==='n5')mode=['kana','words','orthography','context','paraphrase','grammar','sentence','composition','reading','text-grammar','information','listening'][Math.floor(Math.random()*11)];
  if(mode==='reading'){const item=N5_READING[Math.floor(Math.random()*N5_READING.length)];return {type:'reading',char:item.text,prompt:item.question,answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='listening'){const item=N5_LISTENING[Math.floor(Math.random()*N5_LISTENING.length)];return {type:'listening',char:'聞',prompt:item.question,audioText:item.audio,answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='sentence'||mode==='context'){const item=mode==='sentence'?N5_SENTENCE[Math.floor(Math.random()*N5_SENTENCE.length)]:N5_CONTEXT[Math.floor(Math.random()*N5_CONTEXT.length)];return {type:'sentence',char:item.sentence,prompt:mode==='context'?'依照句子情境選出最適合的詞語':'選出最適合填入空格的答案',answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='paraphrase'){const item=N5_PARAPHRASE[Math.floor(Math.random()*N5_PARAPHRASE.length)];return {type:'words',char:item.phrase,prompt:'選出意思相同或最接近的說法',answer:item.answer,options:shuffle(item.options),hint:`「${item.phrase}」可以換成「${item.answer}」。`,showReading:false};}
  if(mode==='orthography'){const item=N5_ORTHOGRAPHY[Math.floor(Math.random()*N5_ORTHOGRAPHY.length)];return {type:'words',char:item.kana,prompt:'選出這個平假名單字的正確漢字寫法',answer:item.answer,options:shuffle(item.options),hint:`${item.kana} 寫作「${item.answer}」。`,showReading:false};}
  if(mode==='composition'){const item=N5_COMPOSITION[Math.floor(Math.random()*N5_COMPOSITION.length)];return {type:'sentence',char:'文を作ろう',prompt:item.question,answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='text-grammar'){const item=N5_TEXT_GRAMMAR[Math.floor(Math.random()*N5_TEXT_GRAMMAR.length)];return {type:'reading',char:item.text,prompt:item.question,answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='information'){const item=N5_INFORMATION[Math.floor(Math.random()*N5_INFORMATION.length)];return {type:'reading',char:item.text,prompt:item.question,answer:item.answer,options:shuffle(item.options),hint:item.hint};}
  if(mode==='kana'){
    let kanaPool=KANA_BANK.filter(item=>item.script===(scope?.script==='kata'?'片假名':state.script==='hira'?'平假名':'片假名'));if(scope?.kanaGroup){const indices={'core-kata':[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],vowels:[0,1,2,3,4],ks:[5,6,7,8,9,10,11,12,13,14],tn:[15,16,17,18,19,20,21,22,23,24],hm:[25,26,27,28,29,30,31,32,33,34],yrw:[35,36,37,38,39,40,41,42,43,44,45]};kanaPool=kanaPool.filter(item=>{if(['voiced','combo','voiced-combo-kata'].includes(scope.kanaGroup)){if(scope.kanaGroup==='voiced-combo-kata')return extra>=0;const extra=KANA_EXTRA.findIndex(row=>row[0]===item.kana||row[2]===item.kana);return scope.kanaGroup==='voiced'?extra>=0&&extra<25:extra>=25;}const base=HIRA.findIndex(row=>row[0]===item.kana||KATA[HIRA.findIndex(x=>x[0]===row[0])]===item.kana);return (indices[scope.kanaGroup]||[]).includes(base);});}const data=kanaPool.map(item=>[item.kana,item.romaji]);
    const pool=data.filter(([char])=>!state.learnedKana.includes(`${state.script}:${char}`));const item=(pool.length?pool:data)[Math.floor(Math.random()*(pool.length?pool.length:data.length))];
    return {type:'kana',char:item[0],answer:item[1],options:shuffle([item[1],...shuffle(data.filter(x=>x[1]!==item[1]).map(x=>x[1])).slice(0,3)]),hint:`${scope?.script==='kata'?'片假名':state.script==='hira'?'平假名':'片假名'}「${item[0]}」讀作 ${item[1]}`};
  }
  if(mode==='words'){
    const pool=scope?.wordIds?WORDS.filter(w=>scope.wordIds.includes(w.id)):scope?.wordTags?WORDS.filter(w=>scope.wordTags.includes(w.tag)):WORDS;const wordsPool=pool.length?pool:WORDS;const word=wordsPool[Math.floor(Math.random()*wordsPool.length)],variant=Math.floor(Math.random()*3);
    if(variant===1)return {type:'words',char:word.meaning,prompt:'選出符合這個意思的日文單字',answer:word.kanji,options:shuffle([word.kanji,...shuffle(wordsPool.filter(w=>w.id!==word.id).map(w=>w.kanji)).slice(0,3)]),hint:`${word.kanji}（${word.kana}）：${word.meaning}`,word,showReading:false};
    if(variant===2)return {type:'words',char:word.kanji,prompt:'選出這個漢字單字的正確讀音',answer:word.kana,options:shuffle([word.kana,...shuffle(wordsPool.filter(w=>w.id!==word.id).map(w=>w.kana)).slice(0,3)]),hint:`${word.kanji} 讀作 ${word.kana}：${word.meaning}`,word,showReading:false};
    return {type:'words',char:word.kanji,prompt:'這個日文詞語是什麼意思？',answer:word.meaning,options:shuffle([word.meaning,...shuffle(wordsPool.filter(w=>w.id!==word.id).map(w=>w.meaning)).slice(0,3)]),hint:`${word.kana} · ${word.romaji}：${word.meaning}`,word,showReading:true};
  }
  const grammarPool=scope?.grammarIds?GRAMMAR.filter(g=>scope.grammarIds.includes(g.id)):GRAMMAR;const lessonPool=grammarPool.length?grammarPool:GRAMMAR;const lesson=lessonPool[Math.floor(Math.random()*lessonPool.length)];
  return {type:'grammar',char:lesson.example,answer:lesson.answer,options:shuffle(lesson.options),hint:`${lesson.title}：${lesson.note}`,lesson};
}
function startLesson(index,mode=null){
  if(!mode){const next=COURSE.findIndex(node=>!state.completedLessons.includes(node.id));if(index>next){toast('完成前一課就能解鎖這裡喔');return;}}
  const node=mode?{title:mode==='n5'?'N5 綜合練習':'自由練習',kind:mode,id:'free',teaching:'本練習完全免費，可以不限次數重做。'}:COURSE[index];
  state.studyMode=node.kind;state.session={node,index:index??-1,step:0,total:mode==='n5'||node.kind==='n5'?10:5,correct:0,wrong:0};state.lessonIntro=!mode;state.quiz=makeQuestion(node.kind,node);state.selectedAnswer=null;state.pendingAnswer=null;state.lessonComplete=null;state.page='study';render();
}
function startFreePractice(mode='kana'){startLesson(-1,mode);}
function renderStudy(){
  if(state.lessonComplete){const done=state.lessonComplete;return `<section class="lesson-complete"><div class="complete-spark">✦</div><span class="eyebrow">LESSON COMPLETE</span><h1>太棒了！課程完成</h1><p>${esc(done.title)}，今天的日文又前進了一步。</p><div class="complete-rewards"><span>⚡ <b>+${done.xp} XP</b></span><span>✓ <b>${done.correct} / ${done.total} 答對</b></span></div><div class="complete-actions"><button class="btn btn-primary" data-action="finish-lesson">回到課程路徑</button><button class="btn btn-secondary" data-action="continue-free">再練一堂</button></div></section>`;}
  if(!state.session)startFreePractice(state.studyMode);
  const session=state.session,node=session.node;
  if(state.lessonIntro)return `<section class="lesson-intro"><button class="round-icon intro-exit" data-action="quit-lesson" aria-label="返回課程路徑">←</button><div class="intro-kicker">N5 COURSE · UNIT ${String(node.unit).padStart(2,'0')}</div><div class="intro-badge">${esc(node.badge)}</div><h1>${esc(node.title)}</h1><p class="intro-description">${esc(node.teaching||node.description)}</p><div class="intro-example"><span>例句與重點</span><strong>${esc(node.example||'')}</strong><small>${esc(node.translation||'')}</small></div><div class="intro-steps"><span>✦ 簡短教學</span><span>✦ ${session.total} 題練習</span><span>✦ 答錯可繼續</span></div><button class="btn btn-primary intro-start" data-action="begin-lesson">開始本課練習 →</button></section>`;
  const q=state.quiz,progress=session.step/session.total*100;
  const prompt=q.prompt||(q.type==='kana'?'選出這個假名的羅馬拼音':q.type==='words'?'這個日文詞語是什麼意思？':q.lesson.prompt);
  return `<section class="lesson-screen"><header class="lesson-top"><button class="round-icon" data-action="quit-lesson" aria-label="離開課程">✕</button><div class="lesson-progress"><i style="width:${progress}%"></i></div></header><div class="lesson-question"><span class="eyebrow">${esc(node.title)}　·　第 ${session.step+1} 題 / ${session.total}</span><h1>${esc(prompt)}</h1><div class="challenge-main ${['grammar','reading','sentence'].includes(q.type)?'japanese-sentence':''} ${q.type==='reading'?'reading-passage':''}">${esc(q.char)}</div>${q.type==='words'&&q.showReading?`<div class="challenge-reading">${q.word.kana}　·　${q.word.romaji}</div>`:''}${q.type==='listening'?`<button class="challenge-audio" data-speak="${esc(q.audioText)}">◖　播放聽力題</button>`:q.type==='kana'||q.type==='words'&&q.showReading?`<button class="challenge-audio" data-speak="${esc(q.type==='kana'?q.char:q.word.kanji)}">◖　聽日文發音</button>`:''}<div class="choice-grid lesson-choices">${q.options.map((option,i)=>`<button class="choice-btn ${state.selectedAnswer===option?'selected':''}" data-answer="${esc(option)}"><span class="choice-letter">${String.fromCharCode(65+i)}</span>${esc(option)}</button>`).join('')}</div></div><footer class="lesson-footer ${state.pendingAnswer?(state.pendingAnswer.correct?'feedback-success':'feedback-error'):''}">${state.pendingAnswer?`<div class="answer-dock"><b>${state.pendingAnswer.correct?'答對了！':'正確答案：'+esc(q.answer)}</b><small>${esc(q.hint)}</small><button class="btn btn-primary" data-action="continue-lesson">繼續 →</button></div>`:`<button class="btn btn-primary btn-check" data-action="check-answer" ${state.selectedAnswer===null?'disabled':''}>檢查答案</button>`}</footer></section>`;
}
function getFilteredWords(){const query=state.wordSearch.trim().toLocaleLowerCase();return WORDS.filter(w=>{const text=[w.kanji,w.kana,w.romaji,w.meaning,w.tag].join(' ').toLocaleLowerCase();return (!query||text.includes(query))&&(state.wordCategory==='全部'||(state.wordCategory==='收藏'&&state.bookmarks.includes(w.id))||w.tag===state.wordCategory);});}
function renderWords(){const categories=['全部','收藏',...new Set(WORDS.map(w=>w.tag))],words=getFilteredWords();return `${pageHead('N5 VOCABULARY','N5 口袋單字',`整理 ${WORDS.length} 個 N5 核心詞，含讀音、解釋、發音與收藏。`,`<button class="btn btn-primary" data-mode="words" data-page="study">練習單字 →</button>`)}<div class="library-tools"><label class="search-box" style="width:min(340px,100%)"><span>⌕</span><input id="word-search" value="${esc(state.wordSearch)}" placeholder="搜尋日文、讀音、意思…" /></label><div class="filter-row">${categories.map(c=>`<button class="filter-chip ${state.wordCategory===c?'active':''}" data-category="${esc(c)}">${c}</button>`).join('')}</div></div><div class="word-grid">${words.map(w=>`<article class="word-card" data-word="${w.id}" tabindex="0"><button class="bookmark ${state.bookmarks.includes(w.id)?'saved':''}" data-bookmark="${w.id}" aria-label="收藏 ${esc(w.kanji)}">${state.bookmarks.includes(w.id)?'♥':'♡'}</button><span class="word-tag">N5　·　${esc(w.tag)}</span><div class="word-day-kanji">${esc(w.kanji)}</div><span class="word-reading">${esc(w.kana)}　·　${esc(w.romaji)}</span><p class="word-meaning">${esc(w.meaning)}</p></article>`).join('')}</div>`;}
function renderGrammar(){return `${pageHead('N5 GRAMMAR','N5 文法課堂',`由例句開始，逐張學習 ${GRAMMAR.length} 個核心句型。`)}<div class="grammar-grid">${GRAMMAR.map((g,i)=>`<button class="grammar-card" data-grammar="${i}"><span class="section-kicker">N5　·　LESSON ${String(i+1).padStart(2,'0')}</span><h3>${esc(g.title)}</h3><span class="grammar-example">${esc(g.example)}</span><p>${esc(g.translation)}<br/>${esc(g.note)}</p><span class="pill lilac" style="margin-top:14px">${esc(g.pattern)}</span></button>`).join('')}</div><section class="focus-panel" style="margin-top:16px"><span class="focus-left"><span class="focus-icon">✧</span><span><b>練習整套 N5 題型</b><small>不限次數，答案會即時解說。</small></span></span><button class="btn btn-primary" data-mode="n5" data-page="study">開始 N5 混合練習 →</button></section>`;}
function getNextReview(){const due=reviewDue(state.reviewFilter);return due.length?due[0]:null;}
function renderReview(){
 const card=state.reviewCard||getNextReview();state.reviewCard=card;const due=reviewDue(state.reviewFilter),waiting=getReviewItems(state.reviewFilter).length-due.length;
 const filters=reviewFilters.map(([id,label])=>`<button class="filter-chip ${state.reviewFilter===id?'active':''}" data-review-filter="${id}">${label}${id==='all'?` · ${getReviewItems().length}`:''}</button>`).join('');
 const answer=card?.type==='word'?`${esc(card.reading)}　·　${esc(card.romaji)}<br/><b>${esc(card.meaning)}</b>`:card?.type==='kana'?`<b>${esc(card.reading)}</b><br/>${esc(card.meaning)}`:`<b>${esc(card.reading||'')}</b><br/>${esc(card.meaning)}`;
 const example=card?.example?`<div class="example"><div class="example-jp">${esc(card.example)}</div><div class="example-zh">${esc(card.translation||'')}</div></div>`:'';
 return `${pageHead('N5 SPACED REPETITION','N5 完整複習','複習 N5 核心詞彙、假名（含濁音與拗音）、文法和例句。所有卡片均可免費不限次練習。')}<div class="filter-row review-filters">${filters}</div><section class="flash-wrap">${card?`<div class="card-head"><span class="pill lilac">${esc(card.tag)}　·　${due.length} 張待複習</span><button class="round-icon" data-speak="${esc(card.speak||card.front)}" aria-label="播放日文讀音">◖</button></div><div class="flash-card"><div class="flash-content"><div class="section-kicker">JLPT N5　·　${card.type==='word'?'單字':card.type==='kana'?'假名':'文法'}</div><div class="flash-word">${esc(card.front)}</div>${state.reveal?`<div class="flash-reading">${answer}</div>${example}`:`<button class="btn btn-primary" data-action="reveal" style="margin-top:25px">想好答案後翻卡</button>`}</div></div>${state.reveal?`<div class="flash-actions"><button class="btn btn-danger" data-srs="again">不熟　·　10 分鐘後</button><button class="btn btn-soft" data-srs="hard">有點印象</button><button class="btn btn-primary" data-srs="good">記住了　·　+10 XP</button></div>`:''}<div class="srs-summary"><span class="pill">✿ 目前卡組 ${getReviewItems(state.reviewFilter).length} 張</span><span class="pill">◷ 稍後複習 ${waiting} 張</span><span class="pill">✓ 今日完成 ${state.daily.review||0} 張</span></div>`:`<div class="empty-state"><b>這個卡組的待複習卡片完成了！</b>稍後回來，卡片會依照熟悉程度再次出現。<br/><button class="btn btn-secondary" data-action="review-all" style="margin-top:15px">重設此卡組，再複習一次</button></div>`}</section>`;
}
function openWord(id){const w=WORDS.find(item=>item.id===id);if(!w)return;$('#modal-layer').innerHTML=`<article class="modal"><div class="modal-head"><span class="pill lilac">N5　·　${esc(w.tag)}</span><button class="modal-close" data-action="close-modal">✕</button></div><div class="word-day-kanji" style="font-size:38px">${esc(w.kanji)}</div><div class="word-reading">${esc(w.kana)}　·　${esc(w.romaji)}</div><p class="word-meaning" style="font-size:14px;margin-top:14px">${esc(w.meaning)}</p>${w.example?`<div class="example"><div class="example-jp">${esc(w.example)}</div><div class="example-zh">${esc(w.translation||'')}</div></div>`:''}<div class="tool-row" style="margin-top:17px"><button class="btn btn-secondary" data-speak="${esc(w.kanji)}">◖　聽發音</button><button class="btn btn-secondary" data-bookmark="${w.id}">${state.bookmarks.includes(w.id)?'♥　已收藏':'♡　收藏單字'}</button><button class="btn btn-primary" data-learn-word="${w.id}">${state.learnedWords.includes(w.id)?'✓ 已學會':'標記已學會　+5 XP'}</button></div></article>`;}
function openGrammar(index){const g=GRAMMAR[index];if(!g)return;$('#modal-layer').innerHTML=`<article class="modal"><div class="modal-head"><span class="pill lilac">N5　·　句型小課</span><button class="modal-close" data-action="close-modal">✕</button></div><div class="section-kicker">${esc(g.pattern)}</div><h2 style="font-size:24px;margin:9px 0">${esc(g.title)}</h2><div class="flash-card" style="min-height:175px"><div><div class="grammar-example" style="font-size:26px">${esc(g.example)}</div><div class="page-desc" style="margin-top:9px">${esc(g.translation)}</div></div></div><p class="page-desc" style="margin:14px 0">${esc(g.note)}</p><div class="focus-panel"><span class="focus-left"><span class="focus-icon">?</span><span><b>${esc(g.prompt)}</b><small>選出正確答案完成本課</small></span></span></div><div class="choice-grid" style="margin:13px 0 0">${g.options.map(option=>`<button class="choice-btn" data-grammar-answer="${esc(option)}" data-grammar-index="${index}">${esc(option)}</button>`).join('')}</div><div class="answer-feedback" id="grammar-feedback"></div></article>`;}
function openSettings(){const old=Number(localStorage.getItem('kotori-voice-rate')||.88);$('#modal-layer').innerHTML=`<section class="modal"><div class="modal-head"><h2>帳號與學習設定</h2><button class="modal-close" data-action="close-modal">✕</button></div><div class="settings-grid"><div class="setting"><b>每日練習目標</b><p>為自己留一點學習時間。</p><select id="goal-select">${[10,15,20,25,30].map(n=>`<option value="${n}" ${state.goal===n?'selected':''}>每天 ${n} 分鐘</option>`).join('')}</select></div><div class="setting"><b>日語語音速度</b><p>播放例句時的朗讀速度。</p><select id="voice-rate"><option value="0.72" ${old===.72?'selected':''}>慢速</option><option value="0.88" ${old===.88?'selected':''}>自然</option><option value="1" ${old===1?'selected':''}>標準</option></select></div><div class="setting"><b>匯出學習紀錄</b><p>下載備份，之後可在其他裝置匯入。</p><button class="btn btn-secondary" data-action="export">下載備份 JSON</button></div><div class="setting"><b>匯入學習紀錄</b><p>還原另一台裝置的進度。</p><button class="btn btn-secondary" data-action="import">選擇備份檔案</button><input type="file" id="import-file" accept="application/json" hidden /></div></div><div class="tool-row account-tools"><span class="card-meta">${cloudEnabled?'☁️ 雲端同步已啟用':'登入帳號：'+esc(currentUser?.email||'')+' · 帳號和進度保存在本機'}</span><button class="btn btn-secondary" data-action="logout">登出</button><button class="btn btn-quiet" data-action="reset-confirm">清除學習進度</button></div></section>`;}
function startFocus(){if(state.focusRunning){state.focusRunning=false;toast('專注計時已暫停');}else{if(!state.focusLeft)state.focusLeft=state.goal*60;state.focusRunning=true;toast('開始專注  ·  你可以的');}render();}
setInterval(()=>{if(!state.focusRunning)return;state.focusLeft=Math.max(0,state.focusLeft-1);const display=$('#focus-display');if(display)display.textContent=formatTime(state.focusLeft);if(!state.focusLeft){state.focusRunning=false;state.focusSessions++;recordStudy('focus',10);toast('專注時間完成，辛苦了！獲得 10 XP');persist();render();}},1000);
function navigate(page){if(!NAV.some(n=>n[0]===page))return;if(page==='study'){startFreePractice(state.studyMode);return;}state.page=page;state.reveal=false;state.reviewCard=null;$('#modal-layer').innerHTML='';render();}
function newQuestion(){state.quiz=makeQuestion();render();}
async function submitChoice(){if(!state.session||state.pendingAnswer||state.selectedAnswer===null)return;const q=state.quiz,correct=await answerMatches(state.selectedAnswer,q.answer);state.pendingAnswer={correct};if(correct){state.session.correct++;if(q.type==='kana'){const kanaScript=state.session.node.script==='kata'?'kata':state.script,id=`${kanaScript}:${q.char}`;if(!state.learnedKana.includes(id))state.learnedKana.push(id);}else if(q.type==='words'&&q.word&&!state.learnedWords.includes(q.word.id))state.learnedWords.push(q.word.id);const kind=q.type==='listening'?'words':q.type==='reading'||q.type==='sentence'?'grammar':q.type;recordStudy(kind,10);}else{state.session.wrong++;persist();}render();}
function continueLesson(){const session=state.session;if(!session)return;if(session.step+1>=session.total){if(session.index>=0){const node=session.node;if(!state.completedLessons.includes(node.id))state.completedLessons.push(node.id);state.daily.lessons=(state.daily.lessons||0)+1;recordStudy(node.kind,15);state.lessonComplete={title:node.title,xp:session.correct*10+15,correct:session.correct,total:session.total};}else{toast('練習完成，繼續保持！');state.page='today';state.session=null;state.quiz=null;}state.pendingAnswer=null;persist();render();return;}session.step++;state.quiz=makeQuestion(session.node.kind,session.node);state.selectedAnswer=null;state.pendingAnswer=null;render();}
function closeModal(){ $('#modal-layer').innerHTML=''; }
document.addEventListener('click',async event=>{
  const lesson=event.target.closest('[data-lesson]');if(lesson){startLesson(Number(lesson.dataset.lesson));return;}
  const page=event.target.closest('[data-page]');if(page){event.preventDefault();const mode=page.dataset.mode;if(mode){state.studyMode=mode;}navigate(page.dataset.page);return;}
  const mode=event.target.closest('[data-mode]');if(mode){state.studyMode=mode.dataset.mode;state.quiz=makeQuestion();if(state.page!=='study'){state.page='study';render();}else render();return;}
  const script=event.target.closest('[data-script]');if(script){state.script=script.dataset.script;state.quiz=makeQuestion();render();return;}
  const category=event.target.closest('[data-category]');if(category){state.wordCategory=category.dataset.category;render();return;}
  const reviewFilter=event.target.closest('[data-review-filter]');if(reviewFilter){state.reviewFilter=reviewFilter.dataset.reviewFilter;state.reviewCard=null;state.reveal=false;render();return;}
  const grammar=event.target.closest('[data-grammar]');if(grammar){openGrammar(Number(grammar.dataset.grammar));return;}
  const grammarAnswer=event.target.closest('[data-grammar-answer]');if(grammarAnswer){const g=GRAMMAR[Number(grammarAnswer.dataset.grammarIndex)];const correct=await answerMatches(grammarAnswer.dataset.grammarAnswer,g.answer);const fb=$('#grammar-feedback');if(correct){grammarAnswer.classList.add('correct');$$('[data-grammar-answer]').forEach(b=>b.disabled=true);fb.textContent=`答對了！${g.answer}　·　+15 XP`;fb.style.color='var(--green)';recordStudy('grammar',15);}else{grammarAnswer.classList.add('wrong');fb.textContent='再讀一次例句，試著找出文法標記。';fb.style.color='var(--pink)';}return;}
  const choice=event.target.closest('[data-answer]');if(choice){state.selectedAnswer=choice.dataset.answer;render();return;}
  const speakButton=event.target.closest('[data-speak]');if(speakButton){speak(speakButton.dataset.speak);return;}
  const bookmark=event.target.closest('[data-bookmark]');if(bookmark){const id=bookmark.dataset.bookmark;state.bookmarks=state.bookmarks.includes(id)?state.bookmarks.filter(x=>x!==id):[...state.bookmarks,id];persist();if($('#modal-layer').innerHTML)openWord(id);else render();return;}
  const learn=event.target.closest('[data-learn-word]');if(learn){const id=learn.dataset.learnWord;if(!state.learnedWords.includes(id)){state.learnedWords.push(id);recordStudy('words',5);}openWord(id);return;}
  const article=event.target.closest('[data-word]');if(article){openWord(article.dataset.word);return;}
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='start-study'){startLesson(Math.max(0,COURSE.findIndex(n=>!state.completedLessons.includes(n.id))));}
  else if(action==='begin-lesson'){state.lessonIntro=false;render();}
  else if(action==='logout'){persist();if(cloudEnabled&&currentUser){clearTimeout(cloudSaveTimer);await saveCloudProgress(currentUser.id,progressSnapshot()).catch(error=>console.warn('Could not sync progress before logout',error));}await logoutLocal();cloudProgressReady=false;currentUser=null;state={...fresh(),page:'today',user:null,script:'hira',studyMode:'kana',quiz:null,session:null,lessonIntro:false,lessonComplete:null,selectedAnswer:null,pendingAnswer:null,selectedGrammar:0,wordCategory:'全部',wordSearch:'',reviewCard:null,reveal:false,focusLeft:0,focusRunning:false};$('#modal-layer').innerHTML='';showAuth('login');}
  else if(action==='check-answer')submitChoice();
  else if(action==='continue-lesson')continueLesson();
  else if(action==='quit-lesson'){state.session=null;state.quiz=null;state.pendingAnswer=null;state.page='today';render();}
  else if(action==='finish-lesson'){state.lessonComplete=null;state.session=null;state.quiz=null;state.page='today';render();}
  else if(action==='continue-free'){state.lessonComplete=null;startFreePractice(state.studyMode);}
  else if(action==='skip')newQuestion();
  else if(action==='focus')startFocus();
  else if(action==='reveal'){state.reveal=true;render();}
  else if(action==='close-modal')closeModal();
  else if(action==='export')exportProgress();
  else if(action==='import')$('#import-file')?.click();
  else if(action==='reset-confirm')confirmReset();
  else if(action==='review-all'){for(const card of getReviewItems(state.reviewFilter))delete state.reviews[card.reviewId];state.reviewCard=null;state.reveal=false;persist();render();}
  const srs=event.target.closest('[data-srs]')?.dataset.srs;if(srs){const card=state.reviewCard;if(card){const now=Date.now();const previous=state.reviews[card.reviewId]?.interval||0;const interval=srs==='again'?10*60*1000:srs==='hard'?Math.max(12*60*60*1000,previous*1.5):Math.max(24*60*60*1000,previous?previous*2:24*60*60*1000);state.reviews[card.reviewId]={due:now+interval,interval,repetitions:(state.reviews[card.reviewId]?.repetitions||0)+(srs==='good'?1:0)};if(srs==='good'&&card.type==='word'&&!state.learnedWords.includes(card.word.id))state.learnedWords.push(card.word.id);if(srs==='good'&&card.type==='kana'){const script=card.script==='片假名'?'kata':'hira',id=`${script}:${card.front}`;if(!state.learnedKana.includes(id))state.learnedKana.push(id);}if(srs==='good'&&card.type==='grammar'&&!state.learnedGrammar.includes(card.reviewId))state.learnedGrammar.push(card.reviewId);recordStudy('review',srs==='good'?10:0);state.reveal=false;state.reviewCard=null;render();}}
});
$('#content').addEventListener('input',event=>{if(event.target.id==='word-search'){const value=event.target.value;state.wordSearch=value;const cursor=event.target.selectionStart;render();const input=$('#word-search');input.focus();input.setSelectionRange(cursor,cursor);} });
$('#global-search').addEventListener('input',event=>{state.wordSearch=event.target.value;state.page='words';render();});
$('#settings-open').addEventListener('click',openSettings);$('#top-settings').addEventListener('click',openSettings);$('#streak-chip').addEventListener('click',()=>toast(state.lastStudy===currentDay()?'今天已經留下學習足跡 ✿':'完成一小段練習，點亮今天的花瓣'));
$('#install-btn').addEventListener('click',installApp);$('#mobile-install').addEventListener('click',installApp);
$('#modal-layer').addEventListener('change',event=>{if(event.target.id==='goal-select'){state.goal=Number(event.target.value);persist();toast(`每日目標已調整為 ${state.goal} 分鐘`);}if(event.target.id==='voice-rate'){localStorage.setItem('kotori-voice-rate',event.target.value);toast('語音速度已更新');}if(event.target.id==='import-file'&&event.target.files[0])importProgress(event.target.files[0]);});
$('#modal-layer').addEventListener('click',event=>{if(event.target.id==='import-file'&&event.target.files[0])importProgress(event.target.files[0]);});
function exportProgress(){const data={...fresh(),xp:state.xp,streak:state.streak,lastStudy:state.lastStudy,date:state.date,daily:state.daily,learnedKana:state.learnedKana,learnedWords:state.learnedWords,bookmarks:state.bookmarks,reviews:state.reviews,studyDays:state.studyDays,goal:state.goal,focusSessions:state.focusSessions,learnedGrammar:state.learnedGrammar||[]};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`kotori-progress-${currentDay()}.json`;link.click();URL.revokeObjectURL(link.href);toast('學習紀錄備份已下載');}
function importProgress(file){const reader=new FileReader();reader.onload=()=>{try{const imported=JSON.parse(reader.result);if(!imported||![2,3,4].includes(imported.version))throw new Error('版本不相容');state={...state,...imported,reviews:migrateReviewKeys(imported.reviews||{})};rollDay();persist();closeModal();render();toast('學習紀錄已匯入');}catch{toast('備份檔案格式不正確');}};reader.readAsText(file);}
function confirmReset(){const modal=$('#modal-layer');modal.innerHTML=`<section class="modal" style="max-width:420px"><div class="modal-head"><h2>清除這部裝置上的學習紀錄？</h2><button class="modal-close" data-action="close-modal">✕</button></div><p class="page-desc">這會移除 XP、已學內容、收藏和複習進度，無法復原。你可以先下載備份。</p><div class="tool-row" style="justify-content:flex-end;margin-top:19px"><button class="btn btn-quiet" data-action="close-modal">先不要</button><button class="btn btn-danger" data-action="reset-all">清除進度</button></div></section>`;}
document.addEventListener('click',event=>{if(event.target.closest('[data-action]')?.dataset.action==='reset-all'){if(currentUser)localStorage.removeItem(progressKey(currentUser.id));state={...fresh(),page:'today',user:currentUser,script:'hira',studyMode:'kana',quiz:null,session:null,lessonIntro:false,lessonComplete:null,selectedAnswer:null,pendingAnswer:null,selectedGrammar:0,wordCategory:'全部',wordSearch:'',reviewCard:null,reveal:false,focusLeft:0,focusRunning:false};persist();closeModal();render();toast('學習紀錄已清除');}});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;});
async function installApp(){if(deferredInstall){deferredInstall.prompt();const result=await deferredInstall.userChoice;toast(result.outcome==='accepted'?'安裝完成，歡迎回來！':'你可以稍後再安裝');deferredInstall=null;return;}if(window.matchMedia('(display-mode: standalone)').matches){toast('ことり已安裝在這部裝置');return;}toast(/iphone|ipad|ipod/i.test(navigator.userAgent)?'在 Safari 點「分享」→「加入主畫面」即可安裝':'使用瀏覽器選單中的「安裝應用程式」或「加入主畫面」');}
window.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(innerWidth>620)$('#global-search').focus();else{state.page='words';render();$('#word-search')?.focus();}}if(event.key==='Escape')closeModal();if(event.key==='Enter'&&state.page==='study'&&state.quiz){if(state.pendingAnswer)continueLesson();else submitChoice();}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register(new URL('sw.js',import.meta.env.BASE_URL).href).catch(()=>{});
function showAuth(mode='register',message=''){
  const layer=$('#auth-layer');document.body.classList.add('needs-auth');layer.hidden=false;
  const register=mode==='register';
  layer.innerHTML=`<main class="auth-card"><div class="auth-brand"><span class="brand-mark"><span>こ</span></span><span><b>ことり</b><small>FREE JAPANESE LEARNING</small></span></div><div class="auth-kicker">每天一點點，慢慢學會日文</div><h1>${register?'建立你的學習帳號':'歡迎回來'}</h1><p class="auth-description">${register?'註冊後保存你的課程、單字和複習進度。':'登入後繼續你的 N5 學習旅程。'}</p><form id="auth-form" class="auth-form">${register?`<label>暱稱<input name="name" type="text" autocomplete="name" maxlength="24" placeholder="怎麼稱呼你？" required /></label>`:''}<label>電子郵件<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></label><label>密碼<input name="password" type="password" autocomplete="${register?'new-password':'current-password'}" minlength="8" placeholder="至少 8 個字元" required /></label>${register?`<label>確認密碼<input name="confirm" type="password" autocomplete="new-password" minlength="8" placeholder="再次輸入密碼" required /></label>`:''}<p class="auth-error" id="auth-error" role="alert">${esc(message)}</p><button class="btn btn-primary auth-submit" type="submit">${register?'免費建立帳號':'登入 ことり'}</button></form><div class="auth-toggle">${register?'已經有帳號？':'還沒有帳號？'} <button type="button" data-auth-mode="${register?'login':'register'}">${register?'登入':'免費註冊'}</button></div><div class="auth-local-note"><span>🔒</span> ${cloudEnabled?'使用 Supabase 安全登入，學習進度同步至你的帳號。':'此預覽使用本機帳號資料；設定 Supabase 後即可跨裝置登入與同步。'}</div></main>`;
}
async function enterApp(user,migrateLegacy=false){currentUser=user;cloudProgressReady=false;state={...fresh(),user,page:'today',script:'hira',studyMode:'kana',quiz:null,session:null,lessonIntro:false,lessonComplete:null,pendingAnswer:null,selectedAnswer:null,selectedGrammar:0,wordCategory:'全部',wordSearch:'',reviewCard:null,reveal:false,focusLeft:0,focusRunning:false};await loadState(migrateLegacy);$('#auth-layer').hidden=true;document.body.classList.remove('needs-auth');render();}
async function bootstrap(){currentUser=await getSessionUser();if(currentUser){await enterApp(currentUser,false);return;}showAuth(hasLocalAccounts()?'login':'register');}
$('#auth-layer').addEventListener('click',event=>{const toggle=event.target.closest('[data-auth-mode]');if(toggle)showAuth(toggle.dataset.authMode);});
$('#auth-layer').addEventListener('submit',async event=>{
  if(event.target.id!=='auth-form')return;event.preventDefault();const form=new FormData(event.target),error=$('#auth-error');error.textContent='';
  try{
    let result;if(form.has('name')){if(form.get('password')!==form.get('confirm'))throw new Error('兩次輸入的密碼不一致。');result=await registerLocal({name:String(form.get('name')),email:String(form.get('email')),password:String(form.get('password'))});if(result.user)await enterApp(result.user,result.firstAccount);else showAuth('login','註冊完成！請先到信箱點選 Supabase 寄出的驗證連結，再回來登入。');}else{const user=await loginLocal({email:String(form.get('email')),password:String(form.get('password'))});await enterApp(user,false);}
  }catch(problem){error.textContent=problem?.message||'登入失敗，請再試一次。';}
});
bootstrap().catch(error=>{console.error('Could not initialize Kotori',error);showAuth('register',error.message||'無法載入帳號資料');});


