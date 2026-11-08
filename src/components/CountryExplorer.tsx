import { useMemo, useState } from 'react';
import { Globe, Search, Volume2, MapPin, X } from 'lucide-react';
import { countries, regionLabels, type Country } from '@/data/countries';
import { FuriganaText } from '@/components/FuriganaText';
import { useFurigana } from '@/context/FuriganaContext';
import { speakJapanese } from '@/utils/speech';

const regions = Object.entries(regionLabels) as [Country['region'], typeof regionLabels[Country['region']]][];

export function CountryExplorer() {
  const [activeRegion, setActiveRegion] = useState<Country['region'] | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Country | null>(null);
  const { show: showFuri } = useFurigana();

  const filtered = useMemo(() => {
    return countries.filter((c) => {
      const matchRegion = activeRegion === 'all' || c.region === activeRegion;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.nameJp.includes(q) ||
        c.romaji.toLowerCase().includes(q) ||
        c.reading.includes(q);
      return matchRegion && matchSearch;
    });
  }, [activeRegion, search]);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" id="countries">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-matcha-500">世界地図</p>
          <h2 className="mt-0.5 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
            各国の日本語読み方
          </h2>
          <p className="mt-1.5 text-sm text-sumi-400 dark:text-sumi-300">
            點擊國家卡片，聆聽日文發音與假名讀法
          </p>
        </div>
        <span className="hidden h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-washi-300 to-transparent sm:block dark:via-sumi-700" />
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sumi-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋國家、日文或羅馬字…"
            className="w-full rounded-xl border border-washi-200/80 bg-white/80 py-2.5 pl-10 pr-10 text-sm text-sumi-700 placeholder:text-sumi-300 transition-all focus:border-matcha-300 focus:outline-none focus:ring-2 focus:ring-matcha-200/40 dark:border-sumi-700/80 dark:bg-sumi-800/80 dark:text-washi-100 dark:placeholder:text-sumi-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sumi-400 hover:text-sumi-600 dark:hover:text-washi-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {/* Region tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-washi-200/80 bg-white/80 p-1 shadow-soft scrollbar-thin dark:border-sumi-700/80 dark:bg-sumi-800/80">
          <RegionTab label="全部" active={activeRegion === 'all'} onClick={() => setActiveRegion('all')} />
          {regions.map(([key, info]) => (
            <RegionTab
              key={key}
              label={info.zh}
              active={activeRegion === key}
              onClick={() => setActiveRegion(key)}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-washi-300 bg-white/50 p-12 text-center dark:border-sumi-600 dark:bg-sumi-800/50">
          <Globe className="mx-auto h-8 w-8 text-sumi-300 dark:text-sumi-600" />
          <p className="mt-3 text-sm text-sumi-400">找不到結果，試試其他關鍵字</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelected(c)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-washi-200/80 bg-white/80 p-4 shadow-soft backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-matcha-300/60 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80 dark:hover:border-matcha-600/50"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{c.flag}</span>
              <div className="text-center">
                <p className="font-serif text-sm font-semibold text-sumi-800 dark:text-washi-100">
                  {showFuri ? c.nameJp : c.nameJp}
                </p>
                {showFuri && (
                  <p className="mt-0.5 text-[0.65rem] text-matcha-500 dark:text-matcha-400">{c.reading}</p>
                )}
                <p className="mt-0.5 text-[0.65rem] text-sumi-400">{c.romaji}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <CountryDetail country={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function RegionTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-br from-matcha-400 to-matcha-500 text-white shadow-soft'
          : 'text-sumi-400 hover:text-sumi-700 dark:text-sumi-300 dark:hover:text-washi-200'
      }`}
    >
      {label}
    </button>
  );
}

function CountryDetail({ country, onClose }: { country: Country; onClose: () => void }) {
  const [playingCountry, setPlayingCountry] = useState(false);
  const [playingCapital, setPlayingCapital] = useState(false);

  const playCountry = async () => {
    setPlayingCountry(true);
    await speakJapanese(country.nameJp);
    setPlayingCountry(false);
  };
  const playCapital = async () => {
    setPlayingCapital(true);
    await speakJapanese(country.capitalJp);
    setPlayingCapital(false);
  };

  const furiCountry = [{ base: country.nameJp, reading: country.reading }];
  const furiCapital = [{ base: country.capitalJp, reading: country.capitalReading }];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-sumi-900/40 backdrop-blur-sm dark:bg-sumi-900/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-scale-in overflow-hidden rounded-2xl border border-washi-200/80 bg-washi-50 shadow-soft-lg dark:border-sumi-700 dark:bg-sumi-800">
        {/* Flag header */}
        <div className="relative flex flex-col items-center gap-2 bg-gradient-to-br from-matcha-50/80 to-washi-100/80 px-6 py-8 dark:from-matcha-700/20 dark:to-sumi-700/40">
          <button
            onClick={onClose}
            aria-label="關閉"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-sumi-400 transition-all hover:scale-105 hover:bg-white/60 dark:hover:bg-sumi-700"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-5xl">{country.flag}</span>
          <p className="text-sm text-sumi-400">{country.romaji}</p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Country name */}
          <div className="rounded-xl border border-washi-200/80 bg-white/80 p-4 dark:border-sumi-700/60 dark:bg-sumi-700/40">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-sumi-400">国名</p>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="font-serif text-2xl font-bold text-sumi-800 dark:text-washi-100">
                <FuriganaText segments={furiCountry} />
              </p>
              <button
                onClick={playCountry}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-matcha-400 to-matcha-500 text-white shadow-soft transition-transform hover:scale-110"
              >
                <Volume2 className={`h-4 w-4 ${playingCountry ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-sumi-400">
              {country.reading} · {country.romaji} · {country.name}
            </p>
          </div>

          {/* Capital */}
          <div className="rounded-xl border border-washi-200/80 bg-white/80 p-4 dark:border-sumi-700/60 dark:bg-sumi-700/40">
            <p className="flex items-center gap-1 text-[0.65rem] font-medium uppercase tracking-wider text-sumi-400">
              <MapPin className="h-3 w-3" /> 首都
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="font-serif text-2xl font-bold text-sumi-800 dark:text-washi-100">
                <FuriganaText segments={furiCapital} />
              </p>
              <button
                onClick={playCapital}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-wood-400 to-wood-500 text-white shadow-soft transition-transform hover:scale-110"
              >
                <Volume2 className={`h-4 w-4 ${playingCapital ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-sumi-400">
              {country.capitalReading} · {country.capital}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
