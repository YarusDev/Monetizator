import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  MessageCircle, ArrowRight, Timer, Users, 
  ChevronRight, ArrowDown, Award, BarChart3, ExternalLink, ChevronLeft
} from 'lucide-react';
import { leadService } from './lib/leadService';

// --- Types & Data Structures ---

type QuizRole = 'EXPERT' | 'BUSINESS_OWNER' | 'ENTREPRENEUR' | 'COMMUNITY_LEADER' | 'PLANNING' | null;

interface Option {
  text: string;
  value: string;
  isNeutral?: boolean;
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
        { text: "Работаем только на разовых", value: "one_off" },
        { text: "Не знаю / Не считаю", value: "unknown", isNeutral: true }
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

const ExpertInsightModal = ({ text, visible, onNext, onBack, showBack }: { text: string, visible: boolean, onNext: () => void, onBack: () => void, showBack: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-card w-full max-w-[400px] p-8 border-brand-emerald/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-emerald/30 mb-6 shadow-2xl">
              <img src="assets/PhotoExpert.jpg" alt="Сергей Осипук" className="w-full h-full object-cover" />
            </div>
            <div className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.3em] mb-4">Инсайт Монетизатора</div>
            <p className="text-lg text-white leading-relaxed italic font-medium mb-8">"{text}"</p>
            
            <div className="w-full flex gap-3">
              {showBack && (
                <button 
                  onClick={onBack}
                  className="px-6 h-14 rounded-xl bg-white/5 border border-white/10 text-brand-zinc/50 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={onNext}
                className="flex-1 h-14 rounded-xl bg-brand-emerald text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                ПРОДОЛЖИТЬ <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
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
  
  const [activeUsers, setActiveUsers] = useState(7);
  const [secondsRemaining, setSecondsRemaining] = useState(45);

  // Live Counter Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal < 3 ? 3 : newVal > 10 ? 10 : newVal;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (secondsRemaining <= 10) return; // Don't go below 10 for urgency feel
    const interval = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

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
      <div className="absolute -top-4 -right-4 bg-brand-emerald text-black text-[9px] font-black py-2 px-4 rounded-full shadow-lg z-20 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        Сейчас проходят аудит: {activeUsers} человек
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-widest block">Шаг {currentStep + 1} из {role ? steps.length : '?'}</span>
            <span className="text-xs text-brand-zinc/50 font-bold uppercase">{current.progressText || "Анализ..."}</span>
          </div>
          <div className="text-[10px] text-brand-zinc/40 font-black uppercase flex items-center gap-2">
            <Timer className={`w-3 h-3 ${secondsRemaining < 20 ? 'text-red-500 animate-pulse' : ''}`} /> 
            ~{secondsRemaining} сек до финиша
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

        <ExpertInsightModal 
          text={typeof current.insight === 'function' ? current.insight(selectedOption || '') : current.insight} 
          visible={showInsight}
          onNext={next}
          onBack={back}
          showBack={currentStep > 0}
        />
      </div>

      <div className="mt-10 flex gap-4 opacity-20 pointer-events-none">
        {currentStep > 0 && (
          <button className="px-6 h-16 rounded-2xl bg-white/5 border border-white/10 text-brand-zinc/50 flex items-center justify-center transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <button 
          className="flex-1 h-16 rounded-2xl bg-white/5 text-white/20 border border-white/5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
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
    stats: "75к → 130к за 2 недели", problem: "Продажа основной услуги за 10 000 ₽ в лоб приносила мало заказов, а база контактов лежала «мёртвым грузом».", action: "Запущен продукт «Фото-подружка».", result: "База превратилась в актив, а доверительный контакт обеспечил поток продаж без вложений в трафик."
  },
  {
    id: 2, title: "Школа языков", header: "+30% новых студентов", sub: "Как найти деньги в расписании.",
    stats: "Заполнение групп без трафика", problem: "Простой учебных классов и наличие базы потенциальных клиентов, которые интересовались, но не купили основной продукт.", action: "Встроили разговорные клубы и базовые уроки.", result: "Простаивающее время стало активом, а школа увеличила количество учеников на 30% за 60 дней."
  },
  {
    id: 3, title: "Инвест-недвижимость", header: "Новая премиум-аудитория", sub: "Система взаимных продаж.",
    stats: "Доступ к VIP + прибыль", problem: "Поиск новых целевых клиентов через стандартные каналы обходился дорого.", action: "Коллаборация с брендом косметики премиум-сегмента.", result: "Агент получил прибыль от продаж партнера и качественную аудиторию."
  },
  {
    id: 4, title: "MLM-предприниматель", header: "+60 000 ₽ личных продаж", sub: "Рост через раскрытие экспертных ресурсов.",
    stats: "+15 партнеров за 14 дней", problem: "Команда рассматривалась просто как «список имен», а ресурсы партнеров не использовались системно.", action: "Коллаборация с нутрициологом из числа партнеров.", result: "Рост личных продаж и команды через активацию «спящей» среды."
  },
  {
    id: 5, title: "Юрист", header: "10 обращений вместо 1", sub: "Отказ от слива бюджета в Директ.",
    stats: "80 000 ₽+ без рекламы", problem: "Расходы на рекламу 50 000 ₽ приносили максимум 1 клиента; отсутствие системы входа в услуги.", action: "Загрузили «аудитом договоров» — быстрым продуктом-шагом.", result: "Количество обращений выросло в 10 раз, обеспечив стабильный доход."
  },
  {
    id: 6, title: "BBQ-оборудование", header: "Активация VIP-базы", sub: "Допродажи через бесплатный сервис.",
    stats: "Чек от 500 000 ₽", problem: "Игнорирование базы клиентов после совершения крупной сделки.", action: "Бесплатный сервисный осмотр оборудования.", result: "Сервис стал «точкой входа» в новые продажи дорогих комплектующих."
  }
];

const SourcesOfProfit = () => {
  const sources = [
    { t: "Клиентская база", d: "Превращаем ваш «архив» в актив, который приносит деньги без вложений в трафик." },
    { t: "Повторные продажи", d: "Проектируем логичное продолжение после первой сделки." },
    { t: "Рекомендации", d: "Учимся управлять «сарафаном» системно и экологично, а не ждать его как погоды." },
    { t: "Добавочная ценность", d: "Делаем высокий чек обоснованным и желанным для клиента." },
    { t: "Коллаборации", d: "Строим партнерства на взаимной выгоде без «кринжа» и спама." },
    { t: "Скрытые услуги", d: "Упаковываем вашу экспертность, которая давалась «бонусом», в отдельный продукт." },
    { t: "Старые клиенты", d: "Возвращаем тех, кто уже доверял вам деньги, через мягкую пользу." }
  ];

  return (
    <BlockWrapper className="bg-brand-obsidian py-32">
      <SectionHeader title="7 источников скрытой прибыли" subTitle="Я сканирую ваш проект через 7 «линз» прибыли. Деньги в 99% случаев не «приходят» из новой рекламы, а «просыпаются» внутри системы." align="center" />
      <div className="grid gap-4">
        {sources.map((s, i) => (
          <div key={i} className="glass-card p-6 border-white/5 flex gap-5 items-start">
            <div className="w-10 h-10 shrink-0 rounded-full bg-brand-emerald/10 flex items-center justify-center font-display font-black text-brand-emerald border border-brand-emerald/20">
              {i + 1}
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-tight text-lg mb-1">{s.t}</h4>
              <p className="text-brand-zinc/50 text-sm leading-relaxed font-medium">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full h-16 border border-brand-emerald/30 text-brand-emerald rounded-2xl font-black text-[10px] uppercase tracking-widest mt-12 hover:bg-brand-emerald/10 transition-all"
      >
        ПРОСКАННИРОВАТЬ МОЙ БИЗНЕС
      </button>
    </BlockWrapper>
  );
};

const Manifesto = () => (
  <BlockWrapper className="bg-brand-charcoal border-y border-white/5 py-32 overflow-hidden">
    <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
      <Award className="w-96 h-96" />
    </div>
    <div className="relative z-10">
      <div className="font-mono text-[10px] text-brand-emerald font-black mb-6 uppercase tracking-[0.4em]">Философия Монетизатора</div>
      <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter mb-10 leading-[1.1]">
        Реклама не исправляет хаос — <span className="text-brand-emerald">она его усиливает.</span>
      </h2>
      <div className="space-y-8 text-lg text-brand-zinc/70 font-medium leading-relaxed">
        <p>Большинство маркетологов совершают преступление против вашего кошелька: они советуют «долить трафика» в систему, которая дырява как решето.</p>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="text-brand-emerald font-black">•</span>
            <span>Если ваша база не разобрана — вы теряете 70% прибыли.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-brand-emerald font-black">•</span>
            <span>Если вы продаете «в лоб» без входного продукта — вы переплачиваете за клиента в 5 раз.</span>
          </li>
          <li className="flex gap-4">
            <span className="text-brand-emerald font-black">•</span>
            <span>Если нетворкинг для вас — это спам визитками, вы живете в иллюзии связей.</span>
          </li>
        </ul>
        <p className="text-white font-bold italic border-l-4 border-brand-emerald pl-6">
          Сначала мы выжимаем максимум из того, что у вас уже есть, и только потом масштабируем результат.
        </p>
      </div>
    </div>
  </BlockWrapper>
);

const FilterSection = () => (
  <BlockWrapper className="bg-brand-obsidian py-32">
    <SectionHeader title="Честно: я работаю не со всеми" subTitle="Мое время и экспертиза — это ресурс для тех, кто готов к взрослому росту. Нам точно не по пути, если:" />
    <div className="grid gap-4">
      {[
        { t: "Вы ищете «волшебную кнопку»", d: "Я не достаю деньги из пустоты и не занимаюсь магией." },
        { t: "У вас «абсолютный ноль»", d: "Без продукта, базы и хотя бы одного реального клиента метод не поможет." },
        { t: "Вы не готовы действовать", d: "Если нужна просто «умная стратегия» для папки на столе — не тратьте мои силы." },
        { t: "Вы ждете «мотивации»", d: "Я даю инструменты и план. Заставлять вас работать — не моя задача." }
      ].map((item, i) => (
        <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-red-500/30 transition-all">
          <h4 className="text-white font-black uppercase text-lg mb-2 flex items-center gap-3">
            <span className="text-red-500 text-2xl leading-none">×</span> {item.t}
          </h4>
          <p className="text-brand-zinc/50 text-base font-medium leading-relaxed">{item.d}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 p-8 rounded-3xl bg-brand-emerald/5 border border-brand-emerald/20 text-center">
      <p className="text-brand-emerald font-black uppercase tracking-widest text-[10px] mb-4">Вердикт</p>
      <div className="text-white font-black text-xl uppercase tracking-tighter mb-8">Я работаю только с теми, кто готов превращать ресурсы в систему.</div>
      <button 
        onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full h-16 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
      >
        Я В АДЕКВАТЕ, ИДЕМ ДАЛЬШЕ
      </button>
    </div>
  </BlockWrapper>
);

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
    // Scroll to the result section anchor
    setTimeout(() => {
      document.getElementById('quiz-result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFinalSubmit = async () => {
    if (!userName.trim()) return;
    setIsSubmitting(true);
    try {
      const { session_uuid } = await leadService.submitLead({ 
        name: userName, 
        contact: 'Telegram',
        quiz_responses: quizData 
      });
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
                <p className="text-brand-zinc/50 text-lg leading-[1.5] font-medium">
                  Сергей Осипук. Монетизатор ресурсов. Помогаю экспертам и предпринимателям находить дополнительную прибыль в базе, связях и продуктах без лишних затрат на рекламу. Пока другие ищут деньги «снаружи», мы превращаем то, что у вас уже есть, в твердый результат.
                </p>
              </div>

              {/* Power Stats */}
              <div className="grid gap-4 py-4">
                {[
                  "+380 000 ₽ за 3 дня — результат на собственных ресурсах",
                  "15 из 17 человек находят деньги в 1-й же день работы",
                  "15 заявок в день с 0 вложений в рекламу"
                ].map((stat, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald shadow-[0_0_8px_#10b981]" />
                    <span className="text-xs text-white font-black uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{stat}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all"
                >
                  НАЙТИ МОИ ТОЧКИ РОСТА <ArrowDown className="w-6 h-6 animate-bounce" />
                </button>
                <p className="text-center italic text-brand-zinc/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  *Бесплатный экспресс-разбор ваших ресурсов за 30 минут по методу Монетизатора
                </p>
              </div>
              
              <div id="quiz-anchor" className="pt-24 space-y-10 text-center">
                <div className="space-y-4 mb-8">
                  <h3 className="text-white font-display font-black text-2xl uppercase tracking-tighter">Интрига Монетизации</h3>
                  <p className="text-brand-zinc/60 text-sm font-medium leading-relaxed px-4">
                    Ответьте на <span className="text-brand-emerald font-black">5 коротких</span> вопросов и получите <span className="text-white font-black">персональную</span> карту из <span className="text-brand-emerald font-black">3-х точек роста</span> вашего бизнеса <span className="text-white font-black">еще до созвона</span>
                  </p>
                </div>
                <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                  <img src="assets/Квиз.jpg" alt="Start Quiz" className="w-full h-auto" />
                </div>
                <Quiz onComplete={handleQuizComplete} />
              </div>
            </div>
          ) : (
            <div id="quiz-result-anchor" className="py-10 space-y-8">
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
          <SectionHeader title="Лидер среды" subTitle="Автор метода. Профессиональный нетворкер. Лидер деловой среды." />
          <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-12 grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 shadow-2xl">
            <img src="assets/PhotoExpert.jpg" alt="Sergey Osipuk" className="w-full h-full object-cover" />
            <div className="absolute bottom-10 left-10 z-20">
              <div className="font-mono text-[11px] text-brand-emerald font-black mb-3 uppercase tracking-widest">Founder // Protocol</div>
              <div className="text-3xl font-black text-white uppercase tracking-tighter">СЕРГЕЙ ОСИПУК</div>
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-lg text-white font-medium leading-relaxed italic border-l-4 border-brand-emerald pl-6">
              "Я не теоретик из YouTube. Моя экспертиза — это сплав жесткой бизнес-логики и мастерства коммуникаций."
            </p>
            <div className="space-y-6">
              {[
                { i: Award, t: "Дипломированный монетизатор", d: "выпускник школы нестандартного мышления Владислава Бермуды." },
                { i: Users, t: "Профессиональный нетворкер", d: "эксперт Первой школы профессионального нетворинга Екатерины Косенко." },
                { i: BarChart3, t: "Масштаб", d: "через мои форматы прошли 200+ предпринимателей и экспертов." }
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
          </div>
          <p className="mt-10 text-lg text-brand-zinc/50 leading-relaxed font-medium">Я не просто «консультирую». Я фасилитирую процессы, в которых связи превращаются в партнерства, а ресурсы — в твердую валюту.</p>
          <button 
            onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-16 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-8 hover:bg-white/5 transition-all"
          >
            ПОСМОТРЕТЬ КЕЙСЫ В ЦИФРАХ
          </button>
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

        <Manifesto />

        <SourcesOfProfit />

        <FilterSection />

        <LossCalculator />

        {/* Products */}
        <BlockWrapper id="services" className="bg-brand-obsidian py-32">
          <SectionHeader title="Линейка продуктов" align="center" />
          
          <div className="space-y-24">
            {/* Echelon 1 */}
            <div className="space-y-8">
              <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-[0.5em] text-center mb-10">Эшелон 1: Быстрый старт</div>
              <div className="grid gap-8">
                <ProductCard 
                  name="Диагностика скрытой прибыли" price="5 000 ₽" img="assets/Диагностика.jpg" 
                  desc="60 минут индивидуального разбора. Находим спящие активы и 2-3 шага к деньгам за 7 дней." 
                />
                <ProductCard 
                  name="Монетизатор.Блиц" price="1 990 ₽" img="assets/Квиз.jpg" 
                  desc="90 минут игры-разведки. Свежий взгляд на продуктовую логику, если проект буксует." 
                />
              </div>
            </div>

            {/* Echelon 2 */}
            <div className="space-y-8">
              <div className="font-mono text-[10px] text-brand-gold font-black uppercase tracking-[0.5em] text-center mb-10">Эшелон 2: Среда и Прорыв</div>
              <div className="grid gap-8">
                <ProductCard 
                  name="Авторский мастермайнд" price="5 000 ₽ / чел" img="assets/Мастермайнд.jpg" 
                  desc="Интенсивный мозговой штурм с игровой механикой. 15 из 17 находят деньги прямо во время игры." 
                  accentColor="brand-gold"
                />
                <ProductCard 
                  name="Корпоративный мастермайнд" price="40 000 ₽" img="assets/Квиз.jpg" 
                  desc="Полная отработка запроса вашей команды до 6 человек. Взрыв текущей реальности." 
                  accentColor="brand-gold"
                />
                <ProductCard 
                  name="Стратегическая сессия" price="15 000 ₽" img="assets/Шаг 3.jpg" 
                  desc="2.5 часа глубокого погружения. Карта ресурсов и пошаговый план на 30 дней + неделя поддержки." 
                  accentColor="brand-gold"
                />
              </div>
            </div>

            {/* Echelon 3 */}
            <div className="space-y-8">
              <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-[0.5em] text-center mb-10">Эшелон 3: Масштаб</div>
              <div className="grid gap-8">
                <ProductCard 
                  name="Индивидуальное наставничество" price="50 000 ₽ / мес" img="assets/PhotoExpert.jpg" 
                  desc="Мое полное погружение в ваш проект как соавтора решений. До результата вместе." 
                />
                <ProductCard 
                  name="Ведение стратегии" price="20 000 ₽ / мес" img="assets/Шаг 3.jpg" 
                  desc="Контракт от 3 месяцев. Постоянный мониторинг показателей и корректировка курса." 
                />
                <ProductCard 
                  name="Групповое наставничество" price="20 000 ₽ / мес" img="assets/Мастермайнд.jpg" 
                  desc="Трекинг, динамика и регулярные разборы в кругу равных. Для тех, кому важна дисциплина." 
                />
              </div>
            </div>
          </div>
        </BlockWrapper>

        {/* Gift Section */}
        <BlockWrapper className="bg-brand-emerald/[0.05] py-32">
          <div className="p-10 rounded-[50px] border border-brand-emerald/20 text-center bg-brand-obsidian shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-emerald shadow-[0_0_20px_#10b981]" />
            <h2 className="text-white font-display font-black text-3xl mb-6 uppercase tracking-tighter">Давайте найдем ваши деньги вместе. Бесплатно.</h2>
            <p className="text-brand-zinc/50 text-base mb-8 font-medium">Экспресс-диагностика (20-30 мин). Просканируем проект и подсветим точки роста. Беру только 3-5 человек в неделю.</p>
            <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-10 aspect-video">
              <img src="assets/Квиз.jpg" alt="Map" className="w-full h-full object-cover opacity-60" />
            </div>
            <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
              className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
            >
              ЗАПИСАТЬСЯ НА РАЗБОР <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </BlockWrapper>

        <footer className="py-32 px-8 border-t border-white/5 bg-black/40 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-emerald/20 to-transparent" />
          <SpinningCoin className="mb-16" size="w-32 h-32" />
          <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-12">Перестаньте искать деньги далеко.<br/>Давайте найдем их у вас под ногами.</h3>
          <div className="grid gap-4 mb-20 max-w-[320px] mx-auto">
            <a href="https://t.me/monetizator_osipuk" className="h-16 rounded-2xl bg-white/5 border border-white/10 font-black text-white uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-white/10 transition-all gap-3">
              <MessageCircle className="w-4 h-4 text-brand-emerald" /> Личный Telegram
            </a>
            <a href="https://t.me/+P3O1S_T2vR80NmIy" className="h-16 rounded-2xl bg-white/5 border border-white/10 font-black text-white uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-white/10 transition-all gap-3">
              <ExternalLink className="w-4 h-4 text-brand-emerald" /> Канал Монетизатора
            </a>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.8em] text-brand-zinc/20 font-black">MONETIZATOR // PROTOCOL // 2026</div>
        </footer>

      </div>
    </div>
  );
}
