import { useState } from 'react';
import { Mic, Volume2, Send, Sparkles, Loader2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { FuriganaText } from '@/components/FuriganaText';
import { speakJapanese } from '@/utils/speech';

interface Scenario {
  label: string;
  jp: string;
  icon: string;
  description: string;
  opener: { segments: { base: string; reading: string }[]; translation: string };
  sampleReplies: { segments: { base: string; reading: string }[]; translation: string; jp: string }[];
}

const scenarios: Record<string, Scenario> = {
  izakaya: {
    label: '居酒屋点餐',
    jp: '居酒屋',
    icon: '🍽',
    description: '在居酒屋向店員點餐的情境',
    opener: {
      segments: [
        { base: 'いらっしゃいませ', reading: '' },
        { base: '！ご', reading: '' },
        { base: '注', reading: 'ちゅう' },
        { base: '文', reading: 'もん' },
        { base: 'はお', reading: '' },
        { base: '決', reading: 'き' },
        { base: 'まりですか', reading: '' },
      ],
      translation: '歡迎光臨！您決定好要點什麼了嗎？',
    },
    sampleReplies: [
      {
        segments: [
          { base: '生', reading: 'なま' },
          { base: 'ビールを', reading: '' },
          { base: '一', reading: 'いっ' },
          { base: '杯', reading: 'ぱい' },
          { base: 'ください', reading: '' },
        ],
        jp: '生ビールを一杯ください',
        translation: '請給我一杯生啤酒',
      },
      {
        segments: [
          { base: 'これとこれを', reading: '' },
          { base: 'お', reading: '' },
          { base: '願', reading: 'ねが' },
          { base: 'いします', reading: '' },
        ],
        jp: 'これとこれをお願いします',
        translation: '請給我這個和這個',
      },
    ],
  },
  convenience: {
    label: '超商結帳',
    jp: 'コンビニ',
    icon: '🏪',
    description: '在便利商店結帳的情境',
    opener: {
      segments: [
        { base: 'いらっしゃいませ', reading: '' },
        { base: '！', reading: '' },
      ],
      translation: '歡迎光臨！',
    },
    sampleReplies: [
      {
        segments: [
          { base: '袋', reading: 'ふくろ' },
          { base: 'は', reading: '' },
          { base: 'いりません', reading: '' },
        ],
        jp: '袋はいりません',
        translation: '我不需要袋子',
      },
      {
        segments: [
          { base: 'あたたかくしてください', reading: '' },
        ],
        jp: 'あたたかくしてください',
        translation: '請幫我加熱',
      },
    ],
  },
  station: {
    label: '車站問路',
    jp: '駅',
    icon: '🚉',
    description: '在車站向站員問路的情境',
    opener: {
      segments: [
        { base: 'こんにちは、いかがなさいましたか', reading: '' },
      ],
      translation: '您好，請問有什麼需要幫忙的嗎？',
    },
    sampleReplies: [
      {
        segments: [
          { base: '東京', reading: 'とうきょう' },
          { base: '駅', reading: 'えき' },
          { base: 'まではどう', reading: '' },
          { base: '行', reading: 'い' },
          { base: 'けばいいですか', reading: '' },
        ],
        jp: '東京駅まではどう行けばいいですか',
        translation: '到東京車站怎麼走？',
      },
      {
        segments: [
          { base: '切符', reading: 'きっぷ' },
          { base: 'を', reading: '' },
          { base: '買', reading: 'か' },
          { base: 'いたいです', reading: '' },
        ],
        jp: '切符を買いたいです',
        translation: '我想買車票',
      },
    ],
  },
  cafe: {
    label: '咖啡閒聊',
    jp: 'カフェ',
    icon: '☕',
    description: '在咖啡廳和朋友輕鬆聊天的情境',
    opener: {
      segments: [
        { base: '最近どう？忙しい？', reading: '' },
      ],
      translation: '最近好嗎？很忙嗎？',
    },
    sampleReplies: [
      {
        segments: [
          { base: 'まあまあかな。', reading: '' },
          { base: '週末', reading: 'しゅうまつ' },
          { base: 'はゆっくりしたよ', reading: '' },
        ],
        jp: 'まあまあかな。週末はゆっくりしたよ',
        translation: '還好吧，週末有好好休息',
      },
      {
        segments: [
          { base: 'この前', reading: 'このあいだ' },
          { base: 'いい映画', reading: 'いいえいが' },
          { base: 'を見たよ', reading: '' },
        ],
        jp: 'この前いい映画を見たよ',
        translation: '之前看了部好電影喔',
      },
    ],
  },
};

interface SpeakingPracticeModalProps {
  open: boolean;
  onClose: () => void;
  scenarioKey: keyof typeof scenarios | null;
}

export function SpeakingPracticeModal({ open, onClose, scenarioKey }: SpeakingPracticeModalProps) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [aiResponding, setAiResponding] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const scenario = scenarioKey ? scenarios[scenarioKey] : null;

  const handlePlay = async (text: string, id: string) => {
    setPlaying(id);
    await speakJapanese(text);
    setPlaying(null);
  };

  const handleSend = () => {
    if (!input.trim() || !scenario) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setAiResponding(true);
    setTimeout(() => {
      const reply = scenario.sampleReplies[Math.floor(Math.random() * scenario.sampleReplies.length)];
      setMessages((m) => [...m, { role: 'ai', text: reply.jp }]);
      setAiResponding(false);
    }, 1000);
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    onClose();
  };

  if (!scenario) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={scenario.label}
      subtitle={scenario.description}
      icon={<span className="text-xl">{scenario.icon}</span>}
    >
      <div className="space-y-4">
        {/* AI opener */}
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-matcha-400 to-matcha-600 text-sm text-white">
            {scenario.icon}
          </span>
          <div className="flex-1 rounded-2xl rounded-tl-sm border border-washi-200/80 bg-white/80 p-3 dark:border-sumi-700/60 dark:bg-sumi-700/40">
            <p className="font-serif text-sm font-medium text-sumi-800 dark:text-washi-100">
              <FuriganaText segments={scenario.opener.segments} />
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => handlePlay(scenario.opener.segments.map((s) => s.base).join(''), 'opener')}
                className="flex items-center gap-1 rounded-full bg-matcha-50 px-2.5 py-1 text-xs font-medium text-matcha-600 transition-colors hover:bg-matcha-100 dark:bg-matcha-700/30 dark:text-matcha-300"
              >
                <Volume2 className={`h-3 w-3 ${playing === 'opener' ? 'animate-pulse' : ''}`} /> 播放
              </button>
              <span className="text-[0.65rem] text-sumi-400">{scenario.opener.translation}</span>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
              msg.role === 'user' ? 'bg-gradient-to-br from-wood-400 to-wood-500 text-white' : 'bg-gradient-to-br from-matcha-400 to-matcha-600 text-white'
            }`}>
              {msg.role === 'user' ? '私' : scenario.icon}
            </span>
            <div className={`rounded-2xl p-3 text-sm ${
              msg.role === 'user'
                ? 'rounded-tr-sm bg-wood-100 text-sumi-700 dark:bg-wood-500/30 dark:text-washi-100'
                : 'rounded-tl-sm border border-washi-200/80 bg-white/80 text-sumi-800 dark:border-sumi-700/60 dark:bg-sumi-700/40 dark:text-washi-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {aiResponding && (
          <div className="flex items-center gap-2 text-sm text-sumi-400">
            <Loader2 className="h-4 w-4 animate-spin" /> AI 正在回覆…
          </div>
        )}

        {/* Suggested replies */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-sumi-400">
            <Sparkles className="h-3 w-3 text-matcha-400" /> 建議回覆
          </p>
          <div className="grid gap-2">
            {scenario.sampleReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handlePlay(reply.jp, `reply-${i}`)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-washi-200/80 bg-white/80 p-3 text-left transition-all hover:border-matcha-300 hover:shadow-soft dark:border-sumi-700/60 dark:bg-sumi-700/40"
              >
                <div>
                  <p className="font-serif text-sm font-medium text-sumi-800 dark:text-washi-100">
                    <FuriganaText segments={reply.segments} />
                  </p>
                  <p className="mt-0.5 text-[0.65rem] text-sumi-400">{reply.translation}</p>
                </div>
                <Volume2 className={`h-4 w-4 shrink-0 text-matcha-500 transition-transform group-hover:scale-110 ${playing === `reply-${i}` ? 'animate-pulse' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 rounded-xl border border-washi-200/80 bg-white/80 p-2 dark:border-sumi-700/60 dark:bg-sumi-700/40">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="用日文輸入你的回覆…"
            className="flex-1 bg-transparent px-2 text-sm text-sumi-700 placeholder:text-sumi-300 focus:outline-none dark:text-washi-100 dark:placeholder:text-sumi-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-matcha-400 to-matcha-500 text-white transition-transform hover:scale-105 disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
