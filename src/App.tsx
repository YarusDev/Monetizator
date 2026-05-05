import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, ArrowRight, Check, X, Timer, TrendingUp, Users, Target, ShieldCheck, 
  ChevronRight, ArrowDown, Award, BarChart3, Rocket, Handshake, ExternalLink, Send, Share2
} from 'lucide-react';
import { leadService } from './lib/leadService';

// --- Types ---
interface QuizStep {
  question: string;
  options: string[];
  insight: string;
}

// --- Content Data ---
const QUIZ_STEPS: QuizStep[] = [
  {
    question: "В какой роли вы сейчас создаете ценность?",
    options: [
      "Я эксперт / Частный специалист (продаю свои знания)",
      "Я собственник бизнеса (у меня есть команда и продукт)",
      "Я организатор / Лидер сообщества (вокруг меня много людей)"
    ],
    insight: "Важно: У каждой роли — своя 'золотая жила'. Эксперты часто сидят на нераспакованной базе, а собственники — на недооцененных коллаборациях. Мы настроим ваш аудит именно под вашу специфику."
  },
  {
    question: "Какой актив у вас сейчас самый объемный, но приносит меньше всего денег?",
    options: [
      "Клиентская база (старые контакты, переписки)",
      "Социальный капитал (связи, окружение, нетворкинг)",
      "Личный бренд / Доверие (меня знают, но покупают мало)",
      "Продукт / Экспертность (много даю бесплатно, не упаковано)"
    ],
    insight: "Знаете ли вы? По статистике, работа со 'старой' базой в 5-7 раз дешевле, чем привлечение новых лидов. Вы прямо сейчас платите 'налог на бездействие', оставляя эти деньги конкурентам."
  },
  {
    question: "Что сейчас больше всего мешает вам вырасти в 2-3 раза?",
    options: [
      "Сжигаю бюджет на рекламу, а лиды 'холодные' или дорогие",
      "Живу на 'сарафанке' — то густо, то пусто",
      "Не знаю, как продавать дорого, не 'впаривая'",
      "Нет системы: всё держится на моих личных усилиях"
    ],
    insight: "Главная ловушка: Реклама не исправляет хаос, она его усиливает. Если система 'дырявая', новый трафик просто быстрее сожжет ваши деньги. Мы сначала 'залатаем' дыры через ваши внутренние ресурсы."
  },
  {
    question: "Как часто вы системно контактируете с теми, кто у вас уже когда-то покупал или интересовался?",
    options: [
      "Раз в неделю / месяц (есть воронка)",
      "Очень редко / По настроению",
      "Вообще не контактирую, они просто лежат в CRM/записной книжке"
    ],
    insight: "Это ваша 'точка слива'. 15 из 17 наших клиентов находят первые деньги именно здесь, просто правильно напомнив о себе через 'мягкий вход'. Это те самые деньги под ногами."
  },
  {
    question: "Какую сумму чистой прибыли вы планируете «достать» из своего бизнеса в ближайшие 30 дней?",
    options: [
      "До 100 000 ₽",
      "100 000 – 500 000 ₽",
      "Более 500 000 ₽"
    ],
    insight: "Цифра реальна. Мой личный результат — +380 000 ₽ за 3 дня на своих же ресурсах. Ваш результат зависит только от точности выбранной стратегии монетизации."
  }
];

const CASES = [
  {
    id: 1,
    title: "Фотограф (Услуги)",
    header: "+55 000 ₽ за 14 дней",
    sub: "Как выйти из ловушки низкого чека, перестав 'охотиться' за новыми клиентами.",
    stats: "75к → 130к за 2 недели",
    problem: "Продажа услуги за 10к в лоб приносила мало заказов, база лежала 'мёртвым грузом'.",
    action: "Запущен 'мягкий вход' — продукт 'Фото-подружка' (съемка на смартфон + ИИ-ретушь).",
    result: "База превратилась в актив, поток продаж без вложений в трафик."
  },
  {
    id: 2,
    title: "Школа языков (Образование)",
    header: "+30% новых студентов",
    sub: "Как перестать зависеть от рекламных бюджетов и найти деньги в расписании.",
    stats: "Заполнение групп на 1/3 без трафика",
    problem: "Простой учебных классов и база 'отказников', которым продукт казался тяжелым.",
    action: "В пустые часы встроили разговорные клубы — доступный шаг для базы.",
    result: "Простаивающее время стало активом, +30% учеников за 60 дней."
  },
  {
    id: 3,
    title: "Инвест-недвижимость (Коллаборации)",
    header: "Новая премиум-аудитория",
    sub: "Как превратить одно знакомство в систему взаимных продаж.",
    stats: "Доступ к VIP-клиентам + прибыль",
    problem: "Поиск целевых клиентов через стандартные каналы обходился слишком дорого.",
    action: "Коллаборация с премиум-брендом косметики: подарки и сертификаты взаимно.",
    result: "Прибыль от продаж партнера и качественная аудитория с высоким чеком."
  },
  {
    id: 4,
    title: "MLM-бизнес (Сетевой)",
    header: "+60 000 ₽ и +15 партнеров",
    sub: "Как расти через раскрытие экспертных ресурсов внутри своей же сети.",
    stats: "Скачок оборота за 14 дней",
    problem: "Команда рассматривалась как 'список имен', ресурсы партнеров не использовались.",
    action: "Коллаборация с нутрициологом из числа партнеров — новые точки доверия.",
    result: "Рост личных продаж и команды через активацию 'спящей' среды."
  },
  {
    id: 5,
    title: "Юрист (Экспертный бизнес)",
    header: "10 обращений вместо 1",
    sub: "Как перестать сливать бюджет и начать продавать через 'входной сервис'.",
    stats: "80к+ без рекламного бюджета",
    problem: "Расходы на рекламу 50к приносили 1 клиента; отсутствие системы входа.",
    action: "Свободные окна загрузили 'аудитом договоров' за 5 000 ₽.",
    result: "Количество обращений выросло в 10 раз, стабильный доход без вложений."
  },
  {
    id: 6,
    title: "BBQ-оборудование (Товарный VIP)",
    header: "Допродажи на VIP-сегменте",
    sub: "Как превратить сервисную поддержку в мощный канал продаж.",
    stats: "Активация базы с чеком 500к+",
    problem: "Игнорирование базы клиентов после совершения крупной сделки.",
    action: "Бесплатный сервисный осмотр оборудования для выявления новых потребностей.",
    result: "Сервис стал точкой входа в допродажи тандыров и аксессуаров."
  }
];

// --- Components ---

const BlockWrapper = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-20 px-6 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ title, subTitle, align = "left" }: { title: string, subTitle?: string, align?: "left" | "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <h2 className="text-white font-display font-black text-4xl mb-6 tracking-tighter uppercase leading-[0.9]">
      {title}
    </h2>
    {subTitle && <p className="text-brand-zinc/60 text-base leading-relaxed max-w-[380px] mx-auto lg:mx-0 font-medium">{subTitle}</p>}
  </div>
);

const Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showInsight, setShowInsight] = useState(false);

  const handleOption = (opt: string) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    setShowInsight(true);
  };

  const nextStep = () => {
    setShowInsight(false);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const current = QUIZ_STEPS[step];
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="glass-card p-8 min-h-[460px] flex flex-col shadow-2xl border-white/10">
      <div className="flex justify-between items-center mb-8">
        <span className="font-mono text-[10px] text-brand-emerald font-bold uppercase tracking-widest">Вопрос {step + 1}/5</span>
        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-brand-emerald shadow-[0_0_10px_#10b981]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showInsight ? (
          <motion.div key="q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-2xl font-black text-white mb-8 leading-tight tracking-tight">{current.question}</h3>
            <div className="space-y-4">
              {current.options.map((opt, i) => (
                <button key={i} onClick={() => handleOption(opt)} className="w-full p-6 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-brand-emerald/50 hover:bg-brand-emerald/5 transition-all group active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-brand-zinc group-hover:text-white leading-snug">{opt}</span>
                    <ArrowRight className="w-5 h-5 text-brand-zinc/20 group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="i" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1">
            <div className="p-8 rounded-3xl bg-brand-emerald/10 border border-brand-emerald/20 mb-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-brand-emerald" />
                <span className="text-xs font-black text-brand-emerald uppercase tracking-widest">Инсайт монетизатора</span>
              </div>
              <p className="text-lg text-white leading-relaxed italic font-medium">"{current.insight}"</p>
            </div>
            <button onClick={nextStep} className="mt-auto w-full h-16 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
              ДАЛЕЕ <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SpinningCoin = ({ size = "w-48 h-48", className = "" }: { size?: string, className?: string }) => (
  <div className={`flex justify-center relative ${className}`}>
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
        filter: [
          'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
          'drop-shadow(0 0 40px rgba(212, 175, 55, 0.7))',
          'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))'
        ]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative z-20"
    >
      <motion.img 
        src="assets/LogoCoin.png" 
        alt="Logo Coin" 
        animate={{ rotateY: 360 }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`${size} object-contain`}
      />
    </motion.div>
    {/* Glow background */}
    <motion.div 
      animate={{ 
        backgroundColor: ['#10b981', '#D4AF37', '#10b981'],
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.5, 1]
      }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[70px] rounded-full z-10"
    />
  </div>
);

const LossCalculator = () => {
  const [leads, setLeads] = useState(100);
  const [conv, setConv] = useState(5);
  const [avgCheck, setAvgCheck] = useState(50000);
  const [retention, setRetention] = useState(0);

  const currentRevenue = leads * (conv / 100) * avgCheck;
  // Multiplier for potential: 3-5x as requested by user (let's use 3.5x for impact)
  const potentialConv = conv * 3.5; 
  const potentialRetention = currentRevenue * (retention / 100) * 1.5; 
  const totalPotential = (leads * (potentialConv / 100) * avgCheck) + potentialRetention - currentRevenue;

  return (
    <BlockWrapper className="bg-brand-charcoal border-y border-white/5">
      <SectionHeader title="Калькулятор упущенных денег" subTitle="Узнайте, сколько прибыли вы 'дарите' конкурентам из-за отсутствия системы." />
      
      <div className="space-y-10">
        {/* Sliders Grid */}
        <div className="grid gap-8">
          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
              <span>Лиды в месяц</span>
              <span className="text-white">{leads}</span>
            </div>
            <input type="range" min="10" max="2000" step="10" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
              <span>Конверсия (%)</span>
              <span className="text-white">{conv}%</span>
            </div>
            <input type="range" min="1" max="50" step="0.5" value={conv} onChange={(e) => setConv(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
              <span>Средний чек (₽)</span>
              <span className="text-white whitespace-nowrap">{avgCheck.toLocaleString()} ₽</span>
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={avgCheck} onChange={(e) => setAvgCheck(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
              <span>Повторные продажи (%)</span>
              <span className="text-white">{retention}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-brand-gold/10 border border-brand-gold/20 relative overflow-hidden group mt-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-16 h-16 text-brand-gold" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-black text-brand-gold uppercase tracking-widest mb-4">Ваш скрытый потенциал</div>
            <div className="text-5xl font-display font-black text-brand-gold mb-3 tracking-tighter whitespace-nowrap">
              +{totalPotential.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
            </div>
            <div className="text-[11px] text-brand-zinc/50 uppercase font-bold tracking-widest">ДОПОЛНИТЕЛЬНО К ТЕКУЩЕЙ ПРИБЫЛИ</div>
          </div>
        </div>
        
        <p className="text-[10px] text-brand-zinc/30 leading-relaxed text-center uppercase tracking-widest font-bold">
          *Расчет произведен на основе потенциала роста показателей до 3.5x после внедрения системы монетизации
        </p>
      </div>
    </BlockWrapper>
  );
};

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [activeCase, setActiveCase] = useState<number | null>(null);

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setQuizCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (!userName.trim()) return;
    setIsSubmitting(true);
    
    try {
      const leadData = {
        name: userName,
        contact: 'Telegram Direct',
        quiz_responses: quizData,
        calculation_data: { potential_boost: 3.5 }
      };

      const { session_uuid } = await leadService.submitLead(leadData);
      const message = encodeURIComponent(`Привет! Я прошел аудит ресурсов. Мои результаты готовы. ID: ${session_uuid}`);
      window.location.href = `https://t.me/monetizator_osipuk?text=${message}`;
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black">
      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian shadow-2xl relative border-x border-white/5">
        
        {/* Блок 1: Главный экран */}
        <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center">
          <div className="scanner-line" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            
            {/* Spinning Coin Section */}
            <SpinningCoin className="mb-10" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-[0_0_12px_#10b981]" />
              <span className="font-mono text-[11px] text-brand-emerald uppercase tracking-[0.4em] font-black">Money Matrix Protocol v2.3.0</span>
            </div>

            <h1 className="text-5xl font-display font-black leading-[0.85] mb-12 tracking-tighter text-white uppercase">
              Ваш бизнес уже <span className="text-brand-emerald">заработал</span> больше, чем вы видите на счету.
            </h1>

            {!quizCompleted ? (
              <div className="space-y-12">
                <div className="space-y-6">
                  <p className="text-white font-black text-3xl leading-tight uppercase tracking-tighter">Пора активировать скрытые ресурсы.</p>
                  <p className="text-brand-zinc/50 text-lg leading-relaxed font-medium">
                    Сергей Осипук. Монетизатор ресурсов. Помогаю находить дополнительную прибыль в базе, связях и продуктах без лишних затрат на рекламу.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    "+380 000 ₽ за 3 дня — результат на своих ресурсах",
                    "15 из 17 человек находят деньги в 1-й день",
                    "15 заявок в день с 0 вложений в рекламу"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-5 text-lg font-bold text-white/90">
                      <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20">
                        <Check className="w-5 h-5 text-brand-emerald" />
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
                >
                  НАЙТИ МОИ ТОЧКИ РОСТА
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </button>
                <p className="text-[11px] text-brand-zinc/40 text-center italic uppercase font-black tracking-widest">
                  Бесплатный экспресс-разбор ваших ресурсов за 30 минут по методу Монетизатора
                </p>

                <div id="quiz-anchor" className="pt-24 space-y-10">
                  {/* Photo before quiz */}
                  <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                    <img src="assets/Квиз.jpg" alt="Start Quiz" className="w-full h-auto" />
                  </div>
                  
                  <p className="text-xl text-center font-medium text-brand-zinc/70">
                    Ответьте на <span className="text-white font-black">5 вопросов</span> и получите <span className="text-brand-emerald font-black">персональную</span> карту из <span className="text-white font-black">3-х точек роста</span>
                  </p>
                  <Quiz onComplete={handleQuizComplete} />
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-10">
                <div className="p-10 rounded-[50px] bg-brand-emerald/10 border border-brand-emerald/30 shadow-2xl">
                  <h3 className="text-3xl font-black text-white mb-6 uppercase leading-tight tracking-tighter">Анализ завершен!</h3>
                  <p className="text-lg text-brand-zinc/70 leading-relaxed mb-8">
                    Ваш персональный план активации прибыли готов. 
                    На основе ваших ответов мы определили, что ваш главный «спящий» актив — <span className="text-brand-emerald font-black text-xl">{quizData[1]?.split('(')[0].trim() || 'Ваши ресурсы'}</span>.
                  </p>
                  <p className="text-base text-brand-zinc/50 leading-relaxed mb-10 italic font-medium">
                    Я уже подготовил инструкции по его монетизации. Подтвердите имя, чтобы забрать их в Telegram:
                  </p>
                  <input 
                    type="text" placeholder="Как вас зовут?" value={userName} onChange={(e) => setUserName(e.target.value)}
                    className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-emerald outline-none transition-all text-white text-lg mb-8"
                  />
                  <button 
                    onClick={handleFinalSubmit} disabled={isSubmitting || !userName.trim()}
                    className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-brand-emerald/40 disabled:opacity-50"
                  >
                    {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕЗУЛЬТАТ В TELEGRAM'}
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <p className="text-[11px] text-brand-zinc/40 mt-8 text-center uppercase font-black tracking-widest">
                    + Карта из 3-х точек роста и слот на диагностику внутри
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </BlockWrapper>

        {/* Блок 2: Лидер среды */}
        <BlockWrapper className="bg-brand-charcoal">
          <SectionHeader title="Лидер среды" subTitle="Автор метода. Профессиональный нетворкер. Лидер деловой среды." />
          <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-12 group grayscale hover:grayscale-0 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent z-10" />
            <img src="assets/PhotoExpert.jpg" alt="Sergey Osipuk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-10 left-10 z-20">
              <div className="font-mono text-[11px] text-brand-emerald font-black mb-3 uppercase tracking-widest">Founder // Protocol</div>
              <div className="text-3xl font-black text-white uppercase tracking-tighter">СЕРГЕЙ ОСИПУК</div>
            </div>
          </div>
          <p className="text-brand-zinc/60 text-lg leading-relaxed mb-10 font-medium">
            Я не теоретик из YouTube. Моя экспертиза — это сплав жесткой бизнес-логики и мастерства коммуникаций:
          </p>
          <div className="space-y-6 mb-12">
            {[
              { i: Award, t: "Дипломированный монетизатор:", d: "выпускник школы нестандартного мышления Владислава Бермуды." },
              { i: Users, t: "Профессиональный нетворкер:", d: "эксперт Первой школы профессионального нетворинга Екатерины Косенко." },
              { i: TrendingUp, t: "Масштаб:", d: "Через мои форматы прошли 200+ предпринимателей и экспертов." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-emerald/10 flex items-center justify-center border border-brand-emerald/20">
                  <item.i className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <span className="text-base font-black text-white uppercase block mb-1">{item.t}</span>
                  <span className="text-base text-brand-zinc/60 leading-tight">{item.d}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all"
          >
            Посмотреть кейсы в цифрах
          </button>
        </BlockWrapper>

        {/* Блок 3: Твердые результаты */}
        <BlockWrapper id="cases">
          <SectionHeader title="Твердые результаты" subTitle="Цифры, которые мы достали из «спящих» активов клиентов." />
          <div className="space-y-6">
            {CASES.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card overflow-hidden group border-white/10">
                <div className="p-8 cursor-pointer" onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}>
                  <div className="flex justify-between items-start mb-5">
                    <div className="font-mono text-[10px] text-brand-emerald uppercase tracking-widest font-black">{c.title}</div>
                    <div className={`transition-transform duration-300 ${activeCase === c.id ? 'rotate-180' : ''}`}>
                      <ChevronRight className="w-5 h-5 text-brand-zinc/30" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tighter group-hover:text-brand-gold transition-colors uppercase">{c.header}</h3>
                  <p className="text-brand-zinc/50 text-sm leading-relaxed mb-6 font-medium">{c.sub}</p>
                  <div className="text-[11px] font-black text-brand-emerald uppercase tracking-widest border-t border-white/5 pt-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Ключевой показатель: {c.stats}
                  </div>
                </div>

                <AnimatePresence>
                  {activeCase === c.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white/[0.02] border-t border-white/5">
                      <div className="p-8 space-y-8">
                        <div>
                          <div className="text-[10px] font-black text-brand-zinc/40 uppercase tracking-widest mb-3">Проблема</div>
                          <p className="text-base text-brand-zinc/70 leading-relaxed font-medium">{c.problem}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-brand-zinc/40 uppercase tracking-widest mb-3">Что сделано</div>
                          <p className="text-base text-brand-zinc/70 leading-relaxed font-medium">{c.action}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-brand-emerald/5 border border-brand-emerald/10">
                          <div className="text-[10px] font-black text-brand-emerald uppercase tracking-widest mb-2">Результат</div>
                          <p className="text-base text-brand-zinc/80 leading-relaxed font-bold">{c.result}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </BlockWrapper>

        {/* Блок 4: Манифест */}
        <BlockWrapper className="bg-brand-emerald/[0.02]">
          <SectionHeader title="Реклама не исправляет хаос — она его усиливает." align="center" />
          <div className="space-y-12 max-w-[400px] mx-auto">
            <p className="text-brand-zinc/60 text-lg leading-relaxed text-center font-medium">
              Большинство маркетологов совершают преступление против вашего кошелька: они советуют «долить трафика» в систему, которая дырява как решето.
            </p>
            
            <div className="space-y-6">
              {[
                "Если ваша база не разобрана — вы теряете 70% прибыли.",
                "Если вы продаете «в лоб» без входного продукта — вы переплачиваете за клиента в 5 раз.",
                "Если нетворкинг для вас — это спам визитками, вы живете в иллюзии связей."
              ].map((text, i) => (
                <div key={i} className="flex gap-5 items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-lg text-brand-zinc/80 font-bold leading-tight">{text}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full h-18 bg-brand-emerald text-brand-obsidian rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-brand-emerald/20"
            >
              Где именно лежат мои деньги?
            </button>
          </div>
        </BlockWrapper>

        {/* Блок 5: Метод 7 источников */}
        <BlockWrapper id="method">
          <SectionHeader title="Я сканирую ваш проект через 7 «линз» прибыли." subTitle="Деньги в 99% случаев не «приходят» из новой рекламы, а «просыпаются» внутри системы." />
          <div className="grid gap-4">
            {[
              { n: "Клиентская база", i: Users, d: "Превращаем ваш «архив» в актив, который приносит деньги без вложений в трафик." },
              { n: "Повторные продажи", i: TrendingUp, d: "Проектируем логичное продолжение после первой сделки." },
              { n: "Рекомендации", i: MessageCircle, d: "Учимся управлять «сарафаном» системно и экологично." },
              { n: "Добавочная ценность", i: Target, d: "Делаем высокий чек обоснованным и желанным для клиента." },
              { n: "Коллаборации", i: Handshake, d: "Строим партнерства на взаимной выгоде без «кринжа» и спама." },
              { n: "Скрытые услуги", i: BarChart3, d: "Упаковываем вашу экспертность, которая годами давалась «бонусом»." },
              { n: "Старые клиенты", i: Timer, d: "Возвращаем тех, кто уже доверял вам деньги, через мягкую пользу." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-emerald/20">
                  <item.i className="w-8 h-8 text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-black text-white text-lg mb-2 uppercase tracking-tight">{i + 1}. {item.n}</h4>
                  <p className="text-brand-zinc/50 text-base leading-relaxed font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => document.getElementById('calc-anchor')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-18 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 mt-12 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
          >
            Просканировать мой бизнес
          </button>
          <div id="calc-anchor" />
        </BlockWrapper>

        {/* Доп блок: Калькулятор */}
        <LossCalculator />

        {/* Блоки 7-9: Услуги */}
        <BlockWrapper id="services">
          <SectionHeader title="Линейка продуктов" subTitle="От точечной диагностики до системного сопровождения." />
          
          <div className="space-y-16">
            {/* Эшелон 1 */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[11px] text-brand-emerald font-black uppercase tracking-[0.3em]">Шаг 1: Диагностика</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              
              <div className="grid gap-6">
                {[
                  { name: "Диагностика (60 мин)", price: "5 000 ₽", img: "assets/Диагностика.jpg", desc: "Глубокий разбор текущих активов и поиск 3-х точек быстрого роста." },
                  { name: "Мастермайнд-блиц", price: "от 1 990 ₽", img: "assets/Мастермайнд-блиц.jpg", desc: "Формат-разведка для тех, кто хочет познакомиться с методом в деле." }
                ].map((s, i) => (
                  <div key={i} className="glass-card overflow-hidden group flex flex-col h-full border-white/10">
                    <div className="aspect-video overflow-hidden">
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{s.name}</h4>
                        <span className="font-mono font-black text-brand-emerald whitespace-nowrap">{s.price}</span>
                      </div>
                      <p className="text-base text-brand-zinc/50 leading-relaxed mb-8 flex-1 font-medium">{s.desc}</p>
                      <button 
                        onClick={() => window.location.href = `https://t.me/monetizator_osipuk?text=${encodeURIComponent(`Интересует ${s.name}`)}`}
                        className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                      >
                        Подробнее <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Эшелон 2 */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[11px] text-brand-gold font-black uppercase tracking-[0.3em]">Шаг 2: Среда</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              
              <div className="grid gap-6">
                {[
                  { name: "Мастермайнд (Сборный)", price: "5 000 ₽", img: "assets/Мастермайнд.jpg", desc: "Игра + коллективный разум. Генерируем 50+ идей для вашего бизнеса за встречу." },
                  { name: "Стратегическая сессия", price: "15 000 ₽", img: "assets/Стратегическая сессия.jpg", desc: "Проектируем воронку ресурсов и партнерств на ближайшие 3 месяца." }
                ].map((s, i) => (
                  <div key={i} className="glass-card overflow-hidden group flex flex-col h-full border-brand-gold/20 bg-brand-gold/[0.02]">
                    <div className="aspect-video overflow-hidden">
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{s.name}</h4>
                        <span className="font-mono font-black text-brand-gold whitespace-nowrap">{s.price}</span>
                      </div>
                      <p className="text-base text-brand-zinc/50 leading-relaxed mb-8 flex-1 font-medium">{s.desc}</p>
                      <button 
                        onClick={() => window.location.href = `https://t.me/monetizator_osipuk?text=${encodeURIComponent(`Интересует ${s.name}`)}`}
                        className="w-full h-14 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-gold/20 transition-all flex items-center justify-center gap-3"
                      >
                        Подробнее <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Эшелон 3 */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[11px] text-brand-emerald font-black uppercase tracking-[0.3em]">Шаг 3: Масштаб</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              
              <div className="grid gap-6">
                {[
                  { name: "Групповое наставничество", price: "от 20 000 ₽", img: "assets/Шаг 3.jpg", desc: "Работа в мини-группе: внедрение инструментов под моим присмотром." },
                  { name: "Ведение стратегии", price: "от 30 000 ₽", img: "assets/Мастермайнд.jpg", desc: "Я становлюсь вашим архитектором монетизации на постоянной основе." },
                  { name: "Индивидуальное сопровождение", price: "от 50 000 ₽", img: "assets/Стратегическая сессия.jpg", desc: "Полноценное внедрение всех инструментов до твердого результата." }
                ].map((s, i) => (
                  <div key={i} className="glass-card overflow-hidden group flex flex-col h-full border-white/10">
                    <div className="aspect-video overflow-hidden">
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4 leading-tight">{s.name}</h4>
                      <p className="text-base text-brand-zinc/50 leading-relaxed mb-8 flex-1 font-medium">{s.desc}</p>
                      <div className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-xs font-bold text-brand-zinc/40 uppercase">Стоимость</span>
                        <span className="font-mono font-black text-brand-emerald text-lg whitespace-nowrap">{s.price}</span>
                      </div>
                      <button 
                        onClick={() => window.location.href = `https://t.me/monetizator_osipuk?text=${encodeURIComponent(`Хочу узнать про ${s.name}`)}`}
                        className="w-full h-16 bg-brand-emerald text-brand-obsidian rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-emerald/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        Зайти в {i === 2 ? 'сопровождение' : 'продукт'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BlockWrapper>

        {/* Блок 10: Подарок */}
        <BlockWrapper className="bg-brand-emerald/[0.05]">
          <div className="p-10 rounded-[50px] border border-brand-emerald/20 text-center relative overflow-hidden bg-brand-obsidian shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
              <Rocket className="w-12 h-12 text-brand-emerald opacity-20" />
            </div>
            
            <SectionHeader title="Давайте найдем ваши деньги вместе. Бесплатно." align="center" />
            
            <div className="space-y-10 text-center mb-12">
              <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-8">
                <img src="assets/Квиз.jpg" alt="Map" className="w-full h-auto opacity-80" />
              </div>
              
              <p className="text-brand-zinc/60 text-lg leading-relaxed font-medium">
                Я предлагаю вам не слова, а тест-драйв моего метода.
              </p>
              
              <div className="p-8 rounded-[40px] bg-brand-emerald/10 border border-brand-emerald/20 shadow-inner">
                <h4 className="font-black text-white text-xl mb-3 uppercase tracking-tight">Экспресс-диагностика</h4>
                <p className="text-base text-brand-zinc/70 leading-relaxed font-medium italic">Мы просканируем ваш проект за 20-30 минут и подсветим точки роста бесплатно.</p>
              </div>
              
              <p className="text-red-500 text-xs uppercase font-black tracking-widest">Внимание: Беру только 3–5 человек в неделю.</p>
            </div>
            
            <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
              className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
            >
              Записаться на разбор
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </BlockWrapper>

        {/* Блок 11: Контакты */}
        <footer className="py-24 px-8 border-t border-white/5 bg-black/20">
          <SpinningCoin className="mb-16" size="w-32 h-32" />
          <SectionHeader title="Перестаньте искать деньги далеко." subTitle="Давайте найдем их у вас под ногами." />
          
          <div className="grid gap-5 mb-20">
            <a href="https://t.me/monetizator_osipuk" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                <MessageCircle className="w-8 h-8 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">Написать лично</div>
                <div className="font-black text-white text-lg">@monetizator_osipuk</div>
              </div>
            </a>

            <a href="https://t.me/+P3O1S_T2vR80NmIy" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                <Send className="w-8 h-8 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">Telegram Канал</div>
                <div className="font-black text-white text-lg">Зайти в канал</div>
              </div>
            </a>

            <a href="https://wa.me/79219001331" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
              <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                <Share2 className="w-8 h-8 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">WhatsApp</div>
                <div className="font-black text-white text-lg">Написать в WhatsApp</div>
              </div>
            </a>
          </div>

          <div className="pt-24 flex flex-col items-center gap-6 opacity-20">
            <div className="font-mono text-[9px] uppercase tracking-[0.6em] text-center font-black">MONETIZATOR // PROTOCOL // 2026</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
