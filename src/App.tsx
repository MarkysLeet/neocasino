import { useEffect, useMemo, useState } from 'react';
import BackgroundStars from './components/BackgroundStars';
import RocketExperience from './features/rocket/RocketExperience';

interface GameCard {
  id: string;
  name: string;
  rating: number;
  description: string;
  art?: string;
  status: 'playable' | 'upcoming';
}

type GameCategory = 'online' | 'offline';

const onlineGames: GameCard[] = [
  {
    id: 'roulette-online',
    name: 'Онлайн Рулетка',
    rating: 4.8,
    description: 'Живые дилеры, мгновенные ставки и честная статистика в реальном времени.',
    art: 'https://i.imgur.com/jXl2rG7.jpeg',
    status: 'playable'
  },
  {
    id: 'fruit-spin',
    name: 'Fruit Spin',
    rating: 4.5,
    description: 'Неоновые слоты с миссиями и прогрессивным джекпотом.',
    art: 'https://images.unsplash.com/photo-1619474446860-0e53e13d9a9f?auto=format&fit=crop&w=400&q=80',
    status: 'upcoming'
  },
  {
    id: 'turbo-poker',
    name: 'Turbo Poker',
    rating: 4.6,
    description: 'Хедз-ап турниры и рейтинговые столы для любителей покера.',
    art: 'https://images.unsplash.com/photo-1533237264985-ee7a4c0873c1?auto=format&fit=crop&w=400&q=80',
    status: 'upcoming'
  }
];

const offlineGames: GameCard[] = [
  {
    id: 'rocket-crash',
    name: 'Crash «Rocket»',
    rating: 4.9,
    description: 'Демо-симуляция оффлайн краш-игры с честной математикой и авто-кэшаутом.',
    status: 'playable'
  },
  {
    id: 'blackjack-offline',
    name: 'Оффлайн Блэкджэк',
    rating: 4.7,
    description: 'Статистика карт, советы по стратегии и реалистичный стол.',
    art: 'https://i.imgur.com/txlCdxO.png',
    status: 'upcoming'
  },
  {
    id: 'lucky-wheel',
    name: 'Lucky Wheel',
    rating: 4.2,
    description: 'Вращай колесо фортуны и собирай множители в демо-режиме.',
    art: 'https://images.unsplash.com/photo-1526682847805-7214b00af12c?auto=format&fit=crop&w=400&q=80',
    status: 'upcoming'
  }
];

const tickerMessages = [
  '🎉 LuckyFox выиграл 1 200₽ в Fruit Spin!',
  '🔥 NeoQueen забрала x3.2 в Crash «Rocket».',
  '🏆 DiamondKing поднял банкролл на 800₽ в Блэкджэке.',
  '🚀 StarRunner поймал авто-кэшаут на x2.5.'
];

const formatRating = (rating: number) => rating.toFixed(1);

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [category, setCategory] = useState<GameCategory>('offline');
  const [activeOfflineGame, setActiveOfflineGame] = useState<string>('rocket-crash');
  const [tickerPaused, setTickerPaused] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (category !== 'offline') {
      setTickerPaused(false);
    }
  }, [category]);

  const games = useMemo(() => (category === 'online' ? onlineGames : offlineGames), [category]);

  const showRocket = category === 'offline' && activeOfflineGame === 'rocket-crash';

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#050914] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#10192f] via-[#151c3b] to-[#050914] opacity-90 dark:opacity-100" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-lavender/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full bg-neon/20 blur-3xl" />
      <BackgroundStars className="opacity-50" />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl transition-colors dark:bg-[#050914]/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl font-semibold tracking-[0.22em] text-neon"
            >
              NEO<span className="text-white">CASINO</span>
            </button>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/70 sm:block">
              Demo-режим
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              className={`rounded-full px-4 py-2 transition ${
                category === 'online' ? 'bg-neon/20 text-neon' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setCategory('online')}
            >
              Онлайн игры
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 transition ${
                category === 'offline' ? 'bg-neon/20 text-neon' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setCategory('offline')}
            >
              Оффлайн игры
            </button>
            <button
              type="button"
              className="rounded-full px-4 py-2 text-white/70 transition hover:text-white"
              onClick={() => setTheme((mode) => (mode === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 md:px-8">
        <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-white shadow-card backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Modern Luxury Arcade</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Почувствуй азарт нового поколения в NeoCasino
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Единая платформа, где сочетаются онлайн-шоу, оффлайн демо-режимы и продвинутый краш-симулятор. Сохраняй
              прогресс, выполняй миссии и изучай честную математику ставок.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-[#050914] transition hover:shadow-glow"
                onClick={() => setCategory('offline')}
              >
                Играть в Crash «Rocket»
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-neon/80 hover:text-neon"
                onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Смотреть игры
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-card backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Дневные миссии</h2>
            <ul className="mt-6 space-y-5 text-sm text-white/70">
              <li>
                <p className="font-medium text-white">Сделай 3 ставки — получи бонус</p>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-2/3 rounded-full bg-neon" />
                </div>
              </li>
              <li>
                <p className="font-medium text-white">Выиграй в слотах 5 раз</p>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-1/5 rounded-full bg-lavender" />
                </div>
              </li>
              <li>
                <p className="font-medium text-white">Запусти оффлайн игру</p>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-3/4 rounded-full bg-white/60" />
                </div>
              </li>
            </ul>
            <div className="mt-8 rounded-2xl bg-[#101626] p-5 text-sm text-white/70">
              <p className="font-semibold text-white">Demo-режим. Без реальных денег.</p>
              <p className="mt-2">Отслеживаем баланс, миссии и историю ставок прямо в браузере.</p>
            </div>
          </div>
        </section>

        <section id="games" className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Категории</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Подборка игр</h2>
            </div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1">
              <button
                type="button"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  category === 'online' ? 'bg-neon text-[#050914]' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setCategory('online')}
              >
                Онлайн
              </button>
              <button
                type="button"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  category === 'offline' ? 'bg-neon text-[#050914]' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setCategory('offline')}
              >
                Оффлайн
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => {
              const isRocket = game.id === 'rocket-crash';
              const playable = game.status === 'playable';

              return (
                <article
                  key={game.id}
                  className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card transition hover:border-neon/40 ${
                    playable ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (category === 'offline' && isRocket) {
                      setActiveOfflineGame('rocket-crash');
                    }
                  }}
                >
                  <div className="absolute inset-0 -z-10 opacity-40 transition group-hover:opacity-60">
                    {game.art ? (
                      <img src={game.art} alt={game.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <BackgroundStars mode="section" className="opacity-60" />
                    )}
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                        {playable ? 'Доступно' : 'Скоро'}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">{game.name}</h3>
                      <p className="mt-2 text-sm text-white/70">{game.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>★ {formatRating(game.rating)}</span>
                      {category === 'offline' && isRocket ? (
                        <button
                          type="button"
                          className="rounded-full bg-neon px-4 py-2 text-xs font-semibold text-[#050914] transition hover:shadow-glow"
                          onClick={() => setActiveOfflineGame('rocket-crash')}
                        >
                          Играть
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/50"
                        >
                          {playable ? 'Играть' : 'Скоро'}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {showRocket && (
          <section id="offline-rocket" className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Оффлайн демо</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Crash «Rocket»</h2>
                <p className="mt-3 max-w-2xl text-base text-white/70">
                  Совмещаем плавную WebGL-анимацию ракеты, живой график коэффициента и полноценный игровой цикл. Можно
                  задавать авто-кэшаут, фиксировать выигрыш и изучать провайли-фэйр хэши каждого раунда.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white/70">
                <span className="rounded-full border border-white/20 px-4 py-2">60 FPS</span>
                <span className="rounded-full border border-white/20 px-4 py-2">Auto Cashout</span>
                <span className="rounded-full border border-white/20 px-4 py-2">RU/TR/EN</span>
                <span className="rounded-full border border-white/20 px-4 py-2">Provably Fair</span>
              </div>
            </div>
            <RocketExperience />
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-card">
            <h3 className="text-xl font-semibold">Ответственная игра</h3>
            <p className="mt-3 text-sm text-white/70">
              Мы напоминаем: это демонстрационный режим без денежных операций. Контролируйте время и ставьте личные
              лимиты.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-neon/80 hover:text-neon"
            >
              Сбросить демо-баланс
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-card">
            <h3 className="text-xl font-semibold">Программа лояльности</h3>
            <p className="mt-3 text-sm text-white/70">
              Собирай опыт в играх, открывай уровни Silver, Gold и Diamond. Каждый уровень — эксклюзивные бонусы и
              персональные миссии.
            </p>
            <div className="mt-6 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-2/3 rounded-full bg-neon" />
            </div>
            <p className="mt-2 text-xs text-white/60">До уровня Gold осталось 320 XP</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-card">
            <h3 className="text-xl font-semibold">Лента активностей</h3>
            <p className="mt-3 text-sm text-white/70">
              Следи за выигрышами сообщества, получай мгновенные уведомления о краш-поинтах и новых турнирах.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {tickerMessages.slice(0, 3).map((message) => (
                <li key={message} className="flex items-center gap-2">
                  <span className="text-neon">●</span>
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-900/40 backdrop-blur-xl dark:bg-[#050914]/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/60">© {new Date().getFullYear()} NeoCasino. Demo-режим. Обучающие цели.</p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span>Политика конфиденциальности</span>
            <span>Условия использования</span>
            <span>Поддержка 24/7</span>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          className="rounded-full bg-neon px-4 py-3 text-sm font-semibold text-[#050914] shadow-glow transition hover:shadow-glow"
        >
          💬 Чат-поддержка
        </button>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-white/10 bg-[#050914]/90 backdrop-blur-xl transition ${
          tickerPaused ? 'opacity-70' : 'opacity-100'
        }`}
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3 md:px-8">
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/60">Live</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              className={`ticker-track ${tickerPaused ? 'paused' : ''}`}
              style={{ animationPlayState: tickerPaused ? 'paused' : 'running' }}
            >
              {tickerMessages.concat(tickerMessages).map((message, index) => (
                <span key={`${message}-${index}`} className="text-sm text-white/70">
                  {message}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
