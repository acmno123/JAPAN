export interface Country {
  name: string;
  nameJp: string;
  reading: string;
  romaji: string;
  capital: string;
  capitalJp: string;
  capitalReading: string;
  flag: string;
  region: 'asia' | 'europe' | 'americas' | 'oceania' | 'africa';
}

export const countries: Country[] = [
  // Asia
  { name: '台灣', nameJp: '台湾', reading: 'たいわん', romaji: 'Taiwan', capital: '台北', capitalJp: '台北', capitalReading: 'たいほく', flag: '🇹🇼', region: 'asia' },
  { name: '日本', nameJp: '日本', reading: 'にほん', romaji: 'Nihon', capital: '東京', capitalJp: '東京', capitalReading: 'とうきょう', flag: '🇯🇵', region: 'asia' },
  { name: '韓國', nameJp: '韓国', reading: 'かんこく', romaji: 'Kankoku', capital: '首爾', capitalJp: 'ソウル', capitalReading: 'そうる', flag: '🇰🇷', region: 'asia' },
  { name: '中國', nameJp: '中国', reading: 'ちゅうごく', romaji: 'Chūgoku', capital: '北京', capitalJp: '北京', capitalReading: 'ペキン', flag: '🇨🇳', region: 'asia' },
  { name: '泰國', nameJp: 'タイ', reading: 'たい', romaji: 'Tai', capital: '曼谷', capitalJp: 'バンコク', capitalReading: 'ばんこく', flag: '🇹🇭', region: 'asia' },
  { name: '越南', nameJp: 'ベトナム', reading: 'べとなむ', romaji: 'Betonamu', capital: '河內', capitalJp: 'ハノイ', capitalReading: 'はのい', flag: '🇻🇳', region: 'asia' },
  { name: '印度', nameJp: 'インド', reading: 'いんど', romaji: 'Indo', capital: '新德里', capitalJp: 'ニューデリー', capitalReading: 'にゅーでりー', flag: '🇮🇳', region: 'asia' },
  { name: '菲律賓', nameJp: 'フィリピン', reading: 'ふぃりぴん', romaji: 'Firipin', capital: '馬尼拉', capitalJp: 'マニラ', capitalReading: 'まにら', flag: '🇵🇭', region: 'asia' },

  // Europe
  { name: '英國', nameJp: 'イギリス', reading: 'いぎりす', romaji: 'Igirisu', capital: '倫敦', capitalJp: 'ロンドン', capitalReading: 'ろんどん', flag: '🇬🇧', region: 'europe' },
  { name: '法國', nameJp: 'フランス', reading: 'ふらんす', romaji: 'Furansu', capital: '巴黎', capitalJp: 'パリ', capitalReading: 'ぱり', flag: '🇫🇷', region: 'europe' },
  { name: '德國', nameJp: 'ドイツ', reading: 'どいつ', romaji: 'Doitsu', capital: '柏林', capitalJp: 'ベルリン', capitalReading: 'べるりん', flag: '🇩🇪', region: 'europe' },
  { name: '義大利', nameJp: 'イタリア', reading: 'いたりあ', romaji: 'Itaria', capital: '羅馬', capitalJp: 'ローマ', capitalReading: 'ろーま', flag: '🇮🇹', region: 'europe' },
  { name: '西班牙', nameJp: 'スペイン', reading: 'すぺいん', romaji: 'Supein', capital: '馬德里', capitalJp: 'マドリード', capitalReading: 'まどりーど', flag: '🇪🇸', region: 'europe' },
  { name: '荷蘭', nameJp: 'オランダ', reading: 'おらんだ', romaji: 'Oranda', capital: '阿姆斯特丹', capitalJp: 'アムステルダム', capitalReading: 'あむすてるだむ', flag: '🇳🇱', region: 'europe' },
  { name: '瑞士', nameJp: 'スイス', reading: 'すいす', romaji: 'Suisu', capital: '伯恩', capitalJp: 'ベルン', capitalReading: 'べるん', flag: '🇨🇭', region: 'europe' },

  // Americas
  { name: '美國', nameJp: 'アメリカ', reading: 'あめりか', romaji: 'Amerika', capital: '華盛頓', capitalJp: 'ワシントン', capitalReading: 'わしんとん', flag: '🇺🇸', region: 'americas' },
  { name: '加拿大', nameJp: 'カナダ', reading: 'かなだ', romaji: 'Kanada', capital: '渥太華', capitalJp: 'オタワ', capitalReading: 'おたわ', flag: '🇨🇦', region: 'americas' },
  { name: '巴西', nameJp: 'ブラジル', reading: 'ぶらじる', romaji: 'Burajiru', capital: '巴西利亞', capitalJp: 'ブラジリア', capitalReading: 'ぶらじりあ', flag: '🇧🇷', region: 'americas' },
  { name: '墨西哥', nameJp: 'メキシコ', reading: 'めきしこ', romaji: 'Mekishiko', capital: '墨西哥城', capitalJp: 'メキシコシティ', capitalReading: 'めきしこしてぃ', flag: '🇲🇽', region: 'americas' },
  { name: '阿根廷', nameJp: 'アルゼンチン', reading: 'あるぜんちん', romaji: 'Aruzenchin', capital: '布宜諾斯艾利斯', capitalJp: 'ブエノスアイレス', capitalReading: 'ぶえのすあいれす', flag: '🇦🇷', region: 'americas' },

  // Oceania
  { name: '澳洲', nameJp: 'オーストラリア', reading: 'おーすとらりあ', romaji: 'Ōsutoraria', capital: '坎培拉', capitalJp: 'キャンベラ', capitalReading: 'きゃんべら', flag: '🇦🇺', region: 'oceania' },
  { name: '紐西蘭', nameJp: 'ニュージーランド', reading: 'にゅーじーらんど', romaji: 'Nyūjīrando', capital: '威靈頓', capitalJp: 'ウェリントン', capitalReading: 'うぇりんとん', flag: '🇳🇿', region: 'oceania' },

  // Africa
  { name: '埃及', nameJp: 'エジプト', reading: 'えじぷと', romaji: 'Ejiputo', capital: '開羅', capitalJp: 'カイロ', capitalReading: 'かいろ', flag: '🇪🇬', region: 'africa' },
  { name: '南非', nameJp: '南アフリカ', reading: 'みなみあふりか', romaji: 'Minami Afurika', capital: '普利托利亞', capitalJp: 'プレトリア', capitalReading: 'ぷれとりあ', flag: '🇿🇦', region: 'africa' },
  { name: '肯亞', nameJp: 'ケニア', reading: 'けにあ', romaji: 'Kenia', capital: '奈洛比', capitalJp: 'ナイロビ', capitalReading: 'ないろび', flag: '🇰🇪', region: 'africa' },
  { name: '摩洛哥', nameJp: 'モロッコ', reading: 'もろっこ', romaji: 'Morokko', capital: '拉巴特', capitalJp: 'ラバト', capitalReading: 'らばと', flag: '🇲🇦', region: 'africa' },
];

export const regionLabels: Record<Country['region'], { jp: string; zh: string; icon: string }> = {
  asia: { jp: 'アジア', zh: '亞洲', icon: '🏔' },
  europe: { jp: 'ヨーロッパ', zh: '歐洲', icon: '🏰' },
  americas: { jp: 'アメリカ大陸', zh: '美洲', icon: '🗽' },
  oceania: { jp: 'オセアニア', zh: '大洋洲', icon: '🌊' },
  africa: { jp: 'アフリカ', zh: '非洲', icon: '🦁' },
};
