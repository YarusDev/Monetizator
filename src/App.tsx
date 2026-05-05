import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  MessageCircle, ArrowRight, Check, X, Timer, TrendingUp, Users, Target, ShieldCheck, 
  ChevronRight, ArrowDown, Award, BarChart3, Rocket, Handshake, ExternalLink, Send, Share2, AlertTriangle, ChevronLeft
} from 'lucide-react';
import { leadService } from './lib/leadService';

// --- Types & Data Structures ---

type QuizRole = 'EXPERT' | 'BUSINESS_OWNER' | 'ENTREPRENEUR' | 'COMMUNITY_LEADER' | 'PLANNING' | null;

interface Option {
  text: string;
  value: string;
}

interface QuizStep {
  id: string;
  question: string;
  options: Option[];
  insight: string | ((answer: string) => string);
  progressText?: string;
}

const BRANCHES: Record<string, QuizStep[]> = {
  EXPERT: [
    {
      id: 'expert_q2',
      question: "Что из вашей экспертности вы сейчас отдаете клиентам «бонусом» или бесплатно?",
      options: [
        { text: "Авторские методики/гайды", value: "methods" },
        { text: "Личные консультации сверх пакета", value: "extra_consults" },
        { text: "Глубокую аналитику/аудит", value: "analytics" },
        { text: "Ничего, всё платно", value: "nothing" }
      ],
      insight: "Это 5-й источник прибыли — Скрытые услуги. То, что вы считаете 'само собой разумеющимся', для клиента часто является самым ценным. Перестав раздавать это бесплатно, вы можете поднять доход на 20%.",
      progressText: "Инвентаризация скрытых услуг..."
    },
    {
      id: 'expert_q3',
      question: "Что мешает вам удвоить чек на свои услуги прямо сейчас?",
      options: [
        { text: "Страх, что старые клиенты уйдут", value: "fear" },
        { text: "Нет понимания обоснования цены", value: "no_logic" },
        { text: "Слишком высокая конкуренция", value: "competition" }
      ],
      insight: "Цена — это не цифра, это ваша Самопрезентация. Мы вытащим из вашего ДНК такие смыслы, что клиент будет покупать ваше Состояние и Результат, не торгуясь.",
      progressText: "Анализ барьера масштабирования..."
    },
    {
      id: 'expert_q4',
      question: "Как вы сейчас отсеиваете «пустые» запросы от тех, кто реально готов платить?",
      options: [
        { text: "Трачу время на бесплатные созвоны", value: "free_calls" },
        { text: "Интуитивно в переписке", value: "intuition" },
        { text: "У меня нет системы фильтрации", value: "no_system" }
      ],
      insight: "Бесплатные консультации — это сжигание времени. Умный диагностический слой должен делать 80% работы за вас, подпуская только тех, кто готов к сделке.",
      progressText: "Оптимизация фильтрации..."
    }
  ],
  BUSINESS_OWNER: [
    {
      id: 'biz_q2',
      question: "Какой объем вашей клиентской базы (CRM, таблицы, почта)?",
      options: [
        { text: "До 1000", value: "low" },
        { text: "1000 – 5000", value: "mid" },
        { text: "Более 5000", value: "high" },
        { text: "Не ведем учет", value: "none" }
      ],
      insight: "Ваша база — это 1-й источник прибыли. Большинство тратят миллионы на трафик, пока база 'пылится'. Мы внедрим механику, которая превратит её в живые деньги.",
      progressText: "Аудит спящего актива..."
    },
    {
      id: 'biz_q3',
      question: "Сколько клиентов возвращаются к вам за покупкой системно?",
      options: [
        { text: "Более 30% (есть система)", value: "systematic" },
        { text: "Менее 10% (случайно)", value: "random" },
        { text: "Работаем только на разовых", value: "one_off" }
      ],
      insight: "Привлечение нового клиента в 7 раз дороже удержания. Если нет системы LTV (2-й источник), вы выбрасываете маржу. Мы найдем точки касания для фанатства бренда.",
      progressText: "Расчет LTV потенциала..."
    },
    {
      id: 'biz_q4',
      question: "Можете ли вы полностью отключить телефон на месяц, не потеряв в прибыли?",
      options: [
        { text: "Да, всё работает как часы", value: "autonomous" },
        { text: "Нет, всё на моем контроле", value: "control" },
        { text: "Прибыль сразу упадет", value: "risk" }
      ],
      insight: "Если всё на вас — вы узкое горлышко. Чтобы расти, нужно переложить диагностику на систему. Это позволит выйти из операционки в стратегию.",
      progressText: "Проверка автономии..."
    }
  ],
  ENTREPRENEUR: [
    {
      id: 'ent_q2',
      question: "Где вы фиксируете контакты людей, которые интересовались, но не купили?",
      options: [
        { text: "В CRM или таблице", value: "crm" },
        { text: "В истории переписок", value: "chat_history" },
        { text: "Нигде не фиксирую", value: "nowhere" }
      ],
      insight: "Переписки — это 'кладбище данных'. Это 6-й источник прибыли — Работа с отказниками. Мы научимся возвращать их за 1 сообщение.",
      progressText: "Инвентаризация базы..."
    },
    {
      id: 'ent_q3',
      question: "Какую ценную часть работы вы сейчас делаете бесплатно ради отношений?",
      options: [
        { text: "Глубокий брифинг", value: "briefing" },
        { text: "Составление стратегии/плана", value: "strategy" },
        { text: "Ответы на вопросы 24/7", value: "support" }
      ],
      insight: "Вы сжигаете маржу там, где могли бы продавать Трипвайер. Мы внедрим платный вход, который окупает ваше время и фильтрует клиентов.",
      progressText: "Поиск скрытых услуг..."
    },
    {
      id: 'ent_q4',
      question: "Как часто к вам приходят клиенты по «сарафанному радио»?",
      options: [
        { text: "Постоянно, но хаотично", value: "chaotic" },
        { text: "Редко", value: "rare" },
        { text: "Я сам плачу за рекомендации", value: "paid" }
      ],
      insight: "Сарафан — это 3-й источник. Но пока он неуправляем, вы в заложниках у случая. Мы превратим его в систему Рекомендательной машины.",
      progressText: "Настройка сарафанной машины..."
    }
  ],
  COMMUNITY_LEADER: [
    {
      id: 'comm_q2',
      question: "Есть ли у вас единая база ресурсов ваших людей (связи, активы)?",
      options: [
        { text: "Да, каталог", value: "catalog" },
        { text: "Только анкеты", value: "forms" },
        { text: "Всё в моей голове", value: "mental" }
      ],
      insight: "Каждое неслучившееся знакомство внутри — ваша упущенная прибыль. Мы создадим систему 'Матчинга' для обмена ресурсами.",
      progressText: "Картирование ресурсов..."
    },
    {
      id: 'comm_q3',
      question: "Получаете ли вы выгоду за то, что соединяете нужных людей?",
      options: [
        { text: "Да, часть модели", value: "business" },
        { text: "Редко, по запросу", value: "manual" },
        { text: "Нет, делаю просто так", value: "altruistic" }
      ],
      insight: "Коллаборации — это 4-й источник. Без фиксации ценности вы — 'бесплатный справочник'. Мы внедрим модель Маршрутизатора.",
      progressText: "Экономика связей..."
    },
    {
      id: 'comm_q4',
      question: "Какая часть аудитории активно следит за вашими предложениями?",
      options: [
        { text: "Более 30% (ядро)", value: "active" },
        { text: "Менее 10% (спящие)", value: "passive" },
        { text: "Трудно оценить", value: "unknown" }
      ],
      insight: "Вниманием нужно управлять. Мы активируем базу через механику 'Карты ресурсов', чтобы каждый участник стал звеном вашей прибыли.",
      progressText: "Активация внимания..."
    }
  ],
  PLANNING: [
    {
      id: 'plan_q2',
      question: "Какой актив у вас сейчас в самом большом объеме?",
      options: [
        { text: "Твердые знания", value: "knowledge" },
        { text: "Сеть связей", value: "network" },
        { text: "Стартовый капитал", value: "capital" },
        { text: "Понятная идея", value: "idea" }
      ],
      insight: "Запуск с нуля — иллюзия. У вас уже есть избыточный ресурс. Мы сделаем его 'оффером-локомотивом', чтобы окупить старт заранее.",
      progressText: "Инвентаризация ресурсов..."
    },
    {
      id: 'plan_q3',
      question: "Как планируете привлекать первых платных клиентов?",
      options: [
        { text: "Личные связи", value: "personal" },
        { text: "Реклама на холодную", value: "cold_ads" },
        { text: "Прогрев в соцсетях", value: "social" }
      ],
      insight: "Реклама на холодную — самый дорогой путь. Мы пойдем через 1-й и 4-й источники: активацию контактов и партнерства.",
      progressText: "Выбор модели входа..."
    },
    {
      id: 'plan_q4',
      question: "Что сейчас больше всего тормозит ваш запуск?",
      options: [
        { text: "Страх продаж/чеков", value: "fear" },
        { text: "Техническая упаковка", value: "tech" },
        { text: "Непонимание ценности", value: "value" }
      ],
      insight: "Люди платят за решение боли вашим методом. Мы распакуем ваше ДНК и создадим 'Мягкий вход', который сам продаст экспертность.",
      progressText: "Поиск узкого горлышка..."
    }
  ]
};

const FINAL_STEP: QuizStep = {
  id: 'final_goal',
  question: "Какую сумму чистой прибыли вы планируете «достать» из бизнеса в ближайшие 30 дней?",
  options: [
    { text: "До 100 000 ₽", value: "low" },
    { text: "100 000 – 500 000 ₽", value: "mid" },
    { text: "Более 500 000 ₽", value: "high" }
  ],
  insight: "Эта сумма — лишь вопрос выбора правильного рычага из 7 источников. Мой личный результат — +380 000 ₽ за 3 дня на своих же ресурсах.",
  progressText: "Финальное планирование..."
};

// --- Sub-components ---

const ExpertInsight = ({ text, visible }: { text: string, visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }}
        className="mt-8 p-6 rounded-3xl bg-brand-emerald/10 border border-brand-emerald/20 relative"
      >
        <div className="flex gap-4 items-start mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-emerald/30 shrink-0">
            <img src="assets/PhotoExpert.jpg" alt="Сергей Осипук" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[10px] font-black text-brand-emerald uppercase tracking-widest mb-1">Сергей Осипук, Монетизатор</div>
            <p className="text-sm text-white leading-relaxed italic font-medium">"{text}"</p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<QuizRole>(() => (localStorage.getItem('quiz_role') as QuizRole) || null);
  const [answers, setAnswers] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('quiz_answers') || '{}'));
  const [showInsight, setShowInsight] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    if (role) localStorage.setItem('quiz_role', role);
    localStorage.setItem('quiz_answers', JSON.stringify(answers));
  }, [role, answers]);

  // Determine full question set based on role
  const steps = useMemo(() => {
    const base: QuizStep[] = [{
      id: 'role',
      question: "В какой роли вы сейчас создаете ценность?",
      options: [
        { text: "Я эксперт / Частный специалист", value: "EXPERT" },
        { text: "Я собственник бизнеса", value: "BUSINESS_OWNER" },
        { text: "Я предприниматель", value: "ENTREPRENEUR" },
        { text: "Я организатор / Лидер сообщества", value: "COMMUNITY_LEADER" },
        { text: "Я только планирую запуск", value: "PLANNING" }
      ],
      insight: "У каждой роли — своя 'золотая жила'. Мы настроим ваш аудит на поиск тех ресурсов, которые вы уже создали, но еще не обналичили.",
      progressText: "Идентификация роли..."
    }];
    
    if (role && BRANCHES[role]) {
      return [...base, ...BRANCHES[role], FINAL_STEP];
    }
    return base;
  }, [role]);

  const handleOption = (opt: Option) => {
    setSelectedOption(opt.value);
    setShowInsight(true);
    
    // Auto-save role on first step
    if (currentStep === 0) {
      setRole(opt.value as QuizRole);
    }

    setAnswers(prev => ({ ...prev, [steps[currentStep].id]: opt.text }));
  };

  const next = () => {
    setShowInsight(false);
    setSelectedOption(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const back = () => {
    if (currentStep > 0) {
      setShowInsight(false);
      setSelectedOption(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const current = steps[currentStep];
  const progress = ((currentStep + 1) / (role ? steps.length : 6)) * 100;
  
  // Acceleration effect for progress bar
  const visualProgress = currentStep >= steps.length - 2 ? progress + 5 : progress;

  return (
    <div className="glass-card p-8 min-h-[520px] flex flex-col shadow-2xl border-white/10 relative">
      {/* Social Proof Widget */}
      <div className="absolute -top-4 -right-4 bg-brand-emerald text-black text-[9px] font-black py-2 px-4 rounded-full shadow-lg animate-pulse z-20 uppercase tracking-widest">
        Сейчас проходят аудит: 14 человек
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-widest block">Шаг {currentStep + 1} из {role ? steps.length : '?'}</span>
            <span className="text-xs text-brand-zinc/50 font-bold uppercase">{current.progressText || "Анализ..."}</span>
          </div>
          <div className="text-[10px] text-brand-zinc/40 font-black uppercase flex items-center gap-2">
            <Timer className="w-3 h-3" /> ~45 сек до финиша
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-emerald shadow-[0_0_15px_#10b981]" 
            initial={{ width: 0 }} 
            animate={{ width: `${visualProgress}%` }} 
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-2xl font-black text-white mb-8 leading-[1.2] tracking-tight">{current.question}</h3>
            <div className="space-y-3">
              {current.options.map((opt, i) => (
                <button 
                  key={i} 
                  disabled={showInsight}
                  onClick={() => handleOption(opt)} 
                  className={`w-full p-6 text-left rounded-2xl border transition-all group relative overflow-hidden ${
                    selectedOption === opt.value 
                    ? 'bg-brand-emerald/20 border-brand-emerald shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:border-brand-emerald/50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-base font-bold transition-colors ${selectedOption === opt.value ? 'text-white' : 'text-brand-zinc/80'}`}>{opt.text}</span>
                    <ArrowRight className={`w-5 h-5 transition-all ${selectedOption === opt.value ? 'text-brand-emerald translate-x-1' : 'text-white/10'}`} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <ExpertInsight text={typeof current.insight === 'function' ? current.insight(selectedOption || '') : current.insight} visible={showInsight} />
      </div>

      <div className="mt-10 flex gap-4">
        {currentStep > 0 && (
          <button onClick={back} className="px-6 h-16 rounded-2xl bg-white/5 border border-white/10 text-brand-zinc/50 flex items-center justify-center hover:bg-white/10 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <button 
          onClick={next} 
          disabled={!showInsight}
          className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            showInsight 
            ? 'bg-white text-black shadow-xl active:scale-95' 
            : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
        >
          {currentStep === steps.length - 1 ? 'ФИНАЛИЗИРОВАТЬ' : 'ДАЛЕЕ'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
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
        animate={{ rotateY: [0, 360, 360] }}
        transition={{ 
          times: [0, 0.8, 1], // 8s rotation, 2s pause
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`${size} object-contain`}
      />
    </motion.div>
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
  const potentialConv = conv * 3.5; 
  const potentialRetention = currentRevenue * (retention / 100) * 1.5; 
  const totalPotential = (leads * (potentialConv / 100) * avgCheck) + potentialRetention - currentRevenue;

  return (
    <BlockWrapper className="bg-brand-charcoal border-y border-white/5">
      <SectionHeader title="Калькулятор упущенных денег" subTitle="Узнайте, сколько прибыли вы 'дарите' конкурентам из-за отсутствия системы." />
      <div className="space-y-10">
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
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-brand-gold"><BarChart3 className="w-16 h-16" /></div>
          <div className="relative z-10">
            <div className="text-xs font-black text-brand-gold uppercase tracking-widest mb-4">Ваш скрытый потенциал</div>
            <div className="text-5xl font-display font-black text-brand-gold mb-3 tracking-tighter whitespace-nowrap leading-none">
              +{totalPotential.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
            </div>
            <div className="text-[11px] text-brand-zinc/50 uppercase font-bold tracking-widest">ДОПОЛНИТЕЛЬНО К ТЕКУЩЕЙ ПРИБЫЛИ</div>
          </div>
        </div>
        <p className="text-[10px] text-brand-zinc/30 leading-relaxed text-center uppercase tracking-widest font-bold">*На основе потенциала роста до 3.5x</p>
      </div>
    </BlockWrapper>
  );
};

const ScrollRouteLine = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1.2]); // Over-scroll effect
  
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] flex justify-center">
      <svg width="4" height="100%" className="overflow-visible">
        <motion.line
          x1="2" y1="0" x2="2" y2="100%"
          stroke="rgba(239, 68, 68, 0.4)"
          strokeWidth="3"
          strokeDasharray="12 18"
          style={{ pathLength, filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }}
        />
      </svg>
    </div>
  );
};

const BlockWrapper = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-20 px-6 relative overflow-visible ${className}`}>
    <div className="relative z-10">{children}</div>
  </section>
);

const SectionHeader = ({ title, subTitle, align = "left" }: { title: string, subTitle?: string, align?: "left" | "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <h2 className="text-white font-display font-black text-4xl mb-6 tracking-tighter uppercase leading-[1.1]">{title}</h2>
    {subTitle && <p className="text-brand-zinc/60 text-base leading-relaxed max-w-[380px] mx-auto lg:mx-0 font-medium">{subTitle}</p>}
  </div>
);

const ProductCard = ({ name, price, img, desc, accentColor = "brand-emerald", cta = "Подробнее" }: any) => {
  const isGold = accentColor === "brand-gold";
  return (
    <div className={`glass-card overflow-hidden group flex flex-col h-full border-white/10 ${isGold ? 'bg-brand-gold/[0.02] border-brand-gold/20' : ''}`}>
      <div className="aspect-video overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight flex-1">{name}</h4>
          <span className={`font-mono font-black text-lg whitespace-nowrap ${isGold ? 'text-brand-gold' : 'text-brand-emerald'}`}>{price}</span>
        </div>
        <p className="text-base text-brand-zinc/50 leading-relaxed mb-8 flex-1 font-medium">{desc}</p>
        <button 
          onClick={() => window.location.href = `https://t.me/monetizator_osipuk?text=${encodeURIComponent(`Интересует ${name}`)}`}
          className={`w-full h-14 border rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
            isGold 
            ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20' 
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {cta} <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CASES = [
  {
    id: 1, title: "Фотограф (Услуги)", header: "+55 000 ₽ за 14 дней", sub: "Как выйти из ловушки низкого чека.",
    stats: "75к → 130к за 2 недели", problem: "База лежала 'мёртвым грузом'.", action: "Запущен продукт 'Фото-подружка'.", result: "База стала активом."
  },
  {
    id: 2, title: "Школа языков", header: "+30% новых студентов", sub: "Как найти деньги в расписании.",
    stats: "Заполнение групп без трафика", problem: "Простой классов и база 'отказников'.", action: "Встроили разговорные клубы.", result: "Рост учеников за 60 дней."
  },
  {
    id: 3, title: "Инвест-недвижимость", header: "Новая премиум-аудитория", sub: "Система взаимных продаж.",
    stats: "Доступ к VIP + прибыль", problem: "Дорогой трафик на холодную.", action: "Коллаборация с премиум-брендом.", result: "VIP-аудитория с высоким чеком."
  }
];

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(() => localStorage.getItem('quiz_completed') === 'true');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [activeCase, setActiveCase] = useState<number | null>(null);

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setQuizCompleted(true);
    localStorage.setItem('quiz_completed', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (!userName.trim()) return;
    setIsSubmitting(true);
    try {
      const { session_uuid } = await leadService.submitLead({ name: userName, quiz_responses: quizData });
      window.location.href = `https://t.me/monetizator_osipuk?start=${session_uuid}`;
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black relative overflow-x-hidden">
      
      {/* Red Route Line - Fixed rendering */}
      <ScrollRouteLine />

      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian/95 shadow-2xl relative border-x border-white/5 backdrop-blur-md z-10">
        
        {/* Hero Section */}
        <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center">
          <SpinningCoin className="mb-10" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-[0_0_12px_#10b981]" />
            <span className="font-mono text-[11px] text-brand-emerald uppercase tracking-[0.4em] font-black">Money Matrix Protocol v2.5.0</span>
          </div>
          <h1 className="text-[2.6rem] font-display font-black leading-[1.05] mb-12 tracking-tighter text-white uppercase">
            Ваш бизнес уже <span className="text-brand-emerald">заработал</span> больше, чем вы видите на счету.
          </h1>

          {!quizCompleted ? (
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-white font-black text-2xl leading-tight uppercase tracking-tighter">Пора активировать скрытые ресурсы.</p>
                <p className="text-brand-zinc/50 text-lg leading-[1.4] font-medium">Сергей Осипук. Монетизатор. Помогаю находить прибыль в базе и связях без затрат на рекламу.</p>
              </div>
              <button 
                onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl"
              >
                НАЙТИ МОИ ТОЧКИ РОСТА <ArrowDown className="w-6 h-6 animate-bounce" />
              </button>
              
              <div id="quiz-anchor" className="pt-24 space-y-10">
                <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                  <img src="assets/Квиз.jpg" alt="Start Quiz" className="w-full h-auto" />
                </div>
                <Quiz onComplete={handleQuizComplete} />
              </div>
            </div>
          ) : (
            <div className="py-10 space-y-8">
              <div className="p-10 rounded-[50px] bg-brand-emerald/10 border border-brand-emerald/30 shadow-2xl">
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Аудит завершен!</h3>
                <p className="text-lg text-brand-zinc/70 leading-relaxed mb-8 font-medium">Я уже подготовил ваш персональный план активации прибыли. Подтвердите имя, чтобы забрать его в Telegram:</p>
                <input 
                  type="text" placeholder="Как вас зовут?" value={userName} onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-emerald outline-none transition-all text-white text-lg mb-8"
                />
                <button 
                  onClick={handleFinalSubmit} disabled={isSubmitting || !userName.trim()}
                  className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'ОТПРАВКА...' : 'ЗАБРАТЬ ПЛАН В TELEGRAM'} <MessageCircle className="w-6 h-6" />
                </button>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[10px] text-brand-zinc/30 uppercase font-black tracking-widest hover:text-brand-zinc/60 transition-colors mx-auto block">Пройти заново</button>
            </div>
          )}
        </BlockWrapper>

        {/* About Section */}
        <BlockWrapper className="bg-brand-charcoal/50">
          <SectionHeader title="Лидер среды" subTitle="Автор метода. Профессиональный нетворкер." />
          <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-12 grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 shadow-2xl">
            <img src="assets/PhotoExpert.jpg" alt="Sergey Osipuk" className="w-full h-full object-cover" />
            <div className="absolute bottom-10 left-10 z-20">
              <div className="font-mono text-[11px] text-brand-emerald font-black mb-3 uppercase tracking-widest">Founder // Protocol</div>
              <div className="text-3xl font-black text-white uppercase tracking-tighter">СЕРГЕЙ ОСИПУК</div>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { i: Award, t: "Дипломированный монетизатор", d: "выпускник школы Владислава Бермуды." },
              { i: Users, t: "Профессиональный нетворкер", d: "эксперт школы Екатерины Косенко." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-emerald/10 flex items-center justify-center border border-brand-emerald/20">
                  <item.i className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <span className="text-base font-black text-white uppercase block mb-1 leading-tight">{item.t}</span>
                  <span className="text-base text-brand-zinc/60 leading-[1.3]">{item.d}</span>
                </div>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Results */}
        <BlockWrapper id="cases">
          <SectionHeader title="Твердые результаты" subTitle="Цифры из спящих активов." />
          <div className="space-y-4">
            {CASES.map((c) => (
              <div key={c.id} className="glass-card p-8 border-white/10 cursor-pointer" onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="font-mono text-[10px] text-brand-emerald uppercase tracking-widest font-black">{c.title}</div>
                  <ChevronRight className={`w-5 h-5 text-brand-zinc/30 transition-transform ${activeCase === c.id ? 'rotate-90' : ''}`} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">{c.header}</h3>
                <AnimatePresence>
                  {activeCase === c.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-6 space-y-4">
                      <p className="text-sm text-brand-zinc/50 font-medium">{c.problem}</p>
                      <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 text-brand-emerald text-sm font-bold">{c.result}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </BlockWrapper>

        <LossCalculator />

        {/* Products */}
        <BlockWrapper id="services">
          <SectionHeader title="Линейка продуктов" />
          <div className="space-y-16">
            <div className="space-y-6">
              <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-[0.4em] text-center">Шаг 1: Диагностика</div>
              <ProductCard name="Диагностика" price="5 000 ₽" img="assets/Диагностика.jpg" desc="Разбор активов и поиск 3-х точек быстрого роста." />
            </div>
            <div className="space-y-6">
              <div className="font-mono text-[10px] text-brand-gold font-black uppercase tracking-[0.4em] text-center">Шаг 2: Среда</div>
              <ProductCard name="Мастермайнд" price="5 000 ₽" img="assets/Мастермайнд.jpg" desc="Игра + коллективный разум. 50+ идей за встречу." accentColor="brand-gold" />
            </div>
            <div className="space-y-6">
              <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-[0.4em] text-center">Шаг 3: Масштаб</div>
              <ProductCard name="Наставничество" price="от 20 000 ₽" img="assets/Шаг 3.jpg" desc="Внедрение инструментов под моим присмотром." />
            </div>
          </div>
        </BlockWrapper>

        {/* Gift Section */}
        <BlockWrapper className="bg-brand-emerald/[0.05]">
          <div className="p-10 rounded-[50px] border border-brand-emerald/20 text-center bg-brand-obsidian shadow-2xl">
            <h2 className="text-white font-display font-black text-3xl mb-6 uppercase tracking-tighter">Давайте найдем ваши деньги вместе. Бесплатно.</h2>
            <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-8">
              <img src="assets/Квиз.jpg" alt="Map" className="w-full h-auto opacity-80" />
            </div>
            <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
              className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-4"
            >
              Записаться на разбор <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </BlockWrapper>

        <footer className="py-24 px-8 border-t border-white/5 bg-black/20 text-center">
          <SpinningCoin className="mb-16" size="w-32 h-32" />
          <div className="grid gap-4 mb-20">
            <a href="https://t.me/monetizator_osipuk" className="p-6 rounded-3xl bg-white/5 border border-white/10 font-black text-white uppercase tracking-widest text-xs">Личный Telegram</a>
            <a href="https://t.me/+P3O1S_T2vR80NmIy" className="p-6 rounded-3xl bg-white/5 border border-white/10 font-black text-white uppercase tracking-widest text-xs">Канал Монетизатора</a>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.6em] opacity-20 font-black">MONETIZATOR // PROTOCOL // 2026</div>
        </footer>

      </div>
    </div>
  );
}
