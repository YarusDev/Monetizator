import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, Phone, ArrowRight, Check, X, Timer, TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';
import { supabase } from './lib/supabase';

// --- Types ---
interface QuizStep {
  question: string;
  options: string[];
  insight: string;
}

// --- Content Data (Strictly from docs) ---
const QUIZ_STEPS: QuizStep[] = [
  {
    question: "В какой роли вы сейчас создаете ценность?",
    options: [
      "Я эксперт / Частный специалист (продаю свои знания).",
      "Я собственник бизнеса (у меня есть команда и продукт).",
      "Я организатор / Лидер сообщества (вокруг меня много людей)."
    ],
    insight: "Важно: У каждой роли — своя \"золотая жила\". Эксперты часто сидят на нераспакованной базе, а собственники — на недооцененных коллаборациях. Мы настроим ваш аудит именно под вашу специфику."
  },
  {
    question: "Какой актив у вас сейчас самый объемный, но приносит меньше всего денег?",
    options: [
      "Клиентская база (старые контакты, переписки).",
      "Социальный капитал (связи, окружение, нетворкинг).",
      "Личный бренд / Доверие (меня знают, но покупают мало).",
      "Продукт / Экспертность (много даю бесплатно, не упаковано)."
    ],
    insight: "Знаете ли вы? По статистике, работа со \"старой\" базой в 5-7 раз дешевле, чем привлечение новых лидов. Вы прямо сейчас платите \"налог на бездействие\", оставляя эти деньги конкурентам."
  },
  {
    question: "Что сейчас больше всего мешает вам вырасти в 2-3 раза?",
    options: [
      "Сжигаю бюджет на рекламу, а лиды «холодные» или дорогие.",
      "Живу на «сарафанке» — то густо, то пусто.",
      "Не знаю, как продавать дорого, не «впаривая».",
      "Нет системы: всё держится на моих личных усилиях."
    ],
    insight: "Главная ловушка: Реклама не исправляет хаос, она его усиливает. Если система \"дырявая\", новый трафик просто быстрее сожжет ваши деньги. Мы сначала \"залатаем\" дыры через ваши внутренние ресурсы."
  },
  {
    question: "Как часто вы системно контактируете с теми, кто у вас уже когда-то покупал или интересовался?",
    options: [
      "Раз в неделю / месяц (есть воронка).",
      "Очень редко / По настроению.",
      "Вообще не контактирую, они просто лежат в CRM/записной книжке."
    ],
    insight: "Это ваша \"точка слива\". 15 из 17 наших клиентов находят первые деньги именно здесь, просто правильно напомнив о себе через \"мягкий вход\". Это те самые деньги под ногами."
  },
  {
    question: "Какую сумму чистой прибыли вы планируете «достать» из своего бизнеса в ближайшие 30 дней?",
    options: [
      "До 100 000 ₽.",
      "100 000 – 500 000 ₽.",
      "Более 500 000 ₽."
    ],
    insight: "Цифра реальна. Мой личный результат — +380 000 ₽ за 3 дня на своих же ресурсах. Ваш результат зависит только от точности выбранной стратегии монетизации."
  }
];

const CASES = [
  { title: "Ниша: Онлайн-школа (Психология)", result: "3.2 млн ₽", desc: "За 14 дней без новых вложений в трафик. Просто активировали «спящую» базу через персонализированную Money Matrix." },
  { title: "Ниша: B2B Консалтинг", result: "х4 в чеке", desc: "Переход от продажи «часов» к продаже результата. Внедрена система фильтрации клиентов и закрытия сделок на высокий чек." },
  { title: "Ниша: Личный бренд (Блогер 100к+)", result: "+1.5 млн ₽ / мес", desc: "Создание товарной линейки «под ногами». Монетизация социального капитала через закрытый клуб." },
  { title: "Ниша: Производство мебели", result: "800 000 ₽", desc: "Достали из «зависших» переписок в WhatsApp за неделю. Внедрен скрипт «мягкого возврата»." },
  { title: "Ниша: IT-сервис (SaaS)", result: "LTV +40%", desc: "Оптимизация работы с текущими пользователями. Выявлены и устранены точки слива лояльности." },
  { title: "Ниша: Сообщество экспертов", result: "12 млн ₽ сборов", desc: "Архитектура запуска на внутреннем ресурсе без внешнего трафика." }
];

// --- Components ---

const BlockWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`py-24 px-6 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ title, subTitle, align = "left" }: { title: string, subTitle?: string, align?: "left" | "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <h2 className="text-3xl font-display font-black tracking-tighter text-white uppercase leading-tight mb-4">
      {title}
    </h2>
    {subTitle && <p className="text-brand-zinc/50 text-sm leading-relaxed max-w-[320px] mx-auto lg:mx-0">{subTitle}</p>}
    <div className={`h-[2px] w-12 bg-brand-emerald/30 mt-6 ${align === "center" ? "mx-auto" : ""}`} />
  </div>
);

const Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(-1); // -1 is intro
  const [answers, setAnswers] = useState<string[]>([]);
  const [showInsight, setShowInsight] = useState(false);
  const [sessionUuid] = useState(crypto.randomUUID());

  const handleStart = () => setStep(0);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    setShowInsight(true);
  };

  const handleNext = () => {
    setShowInsight(false);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ answers, sessionUuid });
    }
  };

  if (step === -1) {
    return (
      <div className="space-y-8 py-10">
        <p className="text-brand-zinc/70 text-sm leading-relaxed italic border-l-2 border-brand-emerald/20 pl-4">
          «Пройдите экспресс-аудит ваших ресурсов за 2 минуты. Узнайте, какой из 7 источников прибыли у вас сейчас "спит", и получите персональную карту активации».
        </p>
        <button 
          onClick={handleStart}
          className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/20"
        >
          ЗАПУСТИТЬ АУДИТ РЕСУРСОВ
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const currentQuizStep = QUIZ_STEPS[step];

  return (
    <div className="min-h-[400px] flex flex-col justify-center py-10">
      <AnimatePresence mode="wait">
        {!showInsight ? (
          <motion.div 
            key={`q-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[10px] text-brand-emerald font-bold tracking-widest uppercase">Вопрос {step + 1}/{QUIZ_STEPS.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-white leading-tight">{currentQuizStep.question}</h3>
            <div className="space-y-3">
              {currentQuizStep.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-brand-emerald/50 hover:bg-brand-emerald/[0.02] text-left text-sm text-brand-zinc/70 transition-all active:scale-[0.98]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={`i-${step}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-[32px] bg-brand-emerald/[0.03] border border-brand-emerald/20 relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-brand-emerald text-brand-obsidian font-mono text-[9px] font-black rounded-full uppercase">
                Инсайт
              </div>
              <p className="text-brand-zinc text-base leading-relaxed font-medium">
                {currentQuizStep.insight}
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full h-16 bg-white text-brand-obsidian rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              ДАЛЕЕ
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LossCalculator = ({ turnover, setTurnover }: { turnover: number, setTurnover: (v: number) => void }) => {
  const potential = useMemo(() => Math.round(turnover * 0.42), [turnover]);

  return (
    <BlockWrapper className="bg-brand-charcoal">
      <div className="p-10 rounded-[40px] bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.03]">
          <TrendingUp className="w-64 h-64 text-brand-gold italic" />
        </div>
        
        <div className="relative z-10">
          <SectionHeader title="Калькулятор утечки" subTitle="Узнайте, сколько денег прямо сейчас «пролетает» мимо вашего кармана." align="center" />
          
          <div className="space-y-8 mb-12">
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-brand-zinc/40">
                <span>Ваш текущий оборот</span>
                <span className="text-brand-zinc">{turnover.toLocaleString()} ₽</span>
              </div>
              <input 
                type="range" 
                min="300000" 
                max="10000000" 
                step="100000"
                value={turnover}
                onChange={(e) => setTurnover(parseInt(e.target.value))}
                className="w-full accent-brand-emerald bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="pt-8 border-t border-white/5 text-center">
              <div className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.4em] mb-4 font-bold">Ваш скрытый потенциал (мес)</div>
              <motion.div 
                key={potential}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-display font-black text-brand-emerald tracking-tighter"
              >
                +{potential.toLocaleString()} <span className="text-xl opacity-40">₽</span>
              </motion.div>
            </div>
          </div>

          <p className="text-[10px] text-brand-zinc/30 text-center leading-relaxed mb-10 max-w-[280px] mx-auto uppercase tracking-widest">
            Это математически обоснованный минимум, который можно достать за 60 дней работы по протоколу.
          </p>

          <button 
            onClick={() => document.getElementById('formats')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-14 rounded-xl bg-brand-gold text-brand-obsidian font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-gold/10"
          >
            ВЕРНУТЬ ЭТИ ДЕНЬГИ
          </button>
        </div>
      </div>
    </BlockWrapper>
  );
};

// --- Main App ---
import { leadService } from './lib/leadService';

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<{ answers: string[], sessionUuid: string } | null>(null);
  const [turnover, setTurnover] = useState(500000);

  const handleQuizComplete = async (data: { answers: string[], sessionUuid: string }) => {
    setQuizData(data);
    setQuizCompleted(true);
    // Предварительное сохранение без имени
    try {
      await leadService.submitLead({
        name: 'Анонимный Лид',
        contact: 'KVIZ_STARTED',
        session_uuid: data.sessionUuid,
        quiz_responses: data.answers,
        metadata: { status: 'quiz_completed' }
      });
    } catch (e) {
      console.warn('Silent save failed', e);
    }
  };

  const handleFinalSubmit = async () => {
    if (!userName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await leadService.submitLead({
        name: userName,
        contact: 'TELEGRAM_PENDING',
        session_uuid: quizData?.sessionUuid,
        quiz_responses: quizData?.answers,
        calculation_data: { 
          turnover, 
          potential: Math.round(turnover * 0.42),
          formula: 'turnover * 0.42'
        },
        metadata: { source: 'monetizator_v2_site' }
      });

      // Редирект в личку к Сергею с UUID для идентификации
      const message = encodeURIComponent(`Привет! Я прошел аудит Money Matrix. Мой ID: ${quizData?.sessionUuid}`);
      window.location.href = `https://t.me/monetizator_osipuk?text=${message}`;
    } catch (error) {
      console.error('Submission error:', error);
      alert('Ошибка при отправке. Пожалуйста, напишите нам напрямую в Telegram.');
      window.location.href = `https://t.me/monetizator_osipuk`;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black">
      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian shadow-2xl relative border-x border-white/5">
        
        {/* Блок 1: Hero-KVIЗ */}
        <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center">
          <div className="scanner-line" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald shadow-[0_0_10px_#10b981]" />
              <span className="font-mono text-[9px] text-brand-emerald uppercase tracking-[0.3em] font-bold">Money Matrix Protocol v2.1</span>
            </div>

            <h1 className="text-[52px] font-display font-black leading-[0.85] mb-8 tracking-tighter text-white uppercase">
              АКТИВИРУЙТЕ <br/>
              ВАШУ <span className="text-brand-emerald">MONEY</span> <br/>
              <span className="text-brand-gold">MATRIX</span>
            </h1>

            {!quizCompleted ? (
              <div className="space-y-6">
                <p className="text-brand-zinc/50 text-sm leading-relaxed max-w-[320px]">
                  Инвентаризация 7 источников прибыли: найдите, где вы теряете <span className="text-white font-bold">от 500.000₽ в месяц</span> прямо сейчас.
                </p>
                <Quiz onComplete={handleQuizComplete} />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 py-10"
              >
                <div className="p-8 rounded-[40px] bg-brand-emerald/10 border border-brand-emerald/30">
                  <h3 className="text-2xl font-black text-white mb-4 uppercase leading-tight">Анализ завершен!</h3>
                  <p className="text-sm text-brand-zinc/70 leading-relaxed mb-6">
                    Ваш персональный план активации прибыли готов. Подтвердите имя, чтобы получить результат.
                  </p>
                  <div className="space-y-4 mb-8">
                    <input 
                      type="text" 
                      placeholder="Как вас зовут?" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full h-14 px-6 rounded-xl bg-white/5 border border-white/10 focus:border-brand-emerald outline-none transition-all text-white"
                    />
                  </div>
                  <button 
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || !userName.trim()}
                    className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30 disabled:opacity-50"
                  >
                    {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕЗУЛЬТАТ В TELEGRAM'}
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </BlockWrapper>

        {/* Блок 2: Лидер среды */}
        <BlockWrapper className="bg-brand-charcoal">
          <SectionHeader title="Сергей Осипук" subTitle="Монетизатор. Тот, кто находит деньги там, где другие видят операционку." />
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-10 group grayscale hover:grayscale-0 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" alt="Sergey Osipuk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-8 left-8 z-20">
              <div className="font-mono text-[10px] text-brand-emerald font-bold mb-2 uppercase tracking-widest">Founder // Protocol</div>
              <div className="text-2xl font-black text-white uppercase tracking-tighter">СЕРГЕЙ ОСИПУК</div>
            </div>
          </div>
          <p className="text-brand-zinc/50 text-sm leading-relaxed mb-8">
            За последние 2 года я помог более чем 100 предпринимателям достать скрытую прибыль из их собственных проектов, не привлекая ни копейки внешних инвестиций. 
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-3xl font-black text-brand-emerald mb-1 tracking-tighter">12 лет</div>
              <div className="text-[10px] text-brand-zinc/30 uppercase font-bold tracking-widest">В бизнесе</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05]">
              <div className="text-3xl font-black text-brand-gold mb-1 tracking-tighter">500+</div>
              <div className="text-[10px] text-brand-zinc/30 uppercase font-bold tracking-widest">Разборов</div>
            </div>
          </div>
        </BlockWrapper>

        {/* Блок 3: Твердые результаты */}
        <BlockWrapper>
          <SectionHeader title="Твердые результаты" subTitle="Цифры, которые мы достали из «спящих» активов клиентов." />
          <div className="space-y-6">
            {CASES.map((c, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 group hover:bg-white/[0.08] transition-all"
              >
                <div className="font-mono text-[9px] text-brand-emerald/40 mb-4 uppercase tracking-widest font-bold">CASE_STUDY_0{i + 1}</div>
                <div className="text-[10px] text-brand-zinc/40 uppercase font-bold mb-2 tracking-widest">{c.title}</div>
                <div className="text-4xl font-display font-black text-white mb-4 tracking-tighter group-hover:text-brand-gold transition-colors">{c.result}</div>
                <p className="text-brand-zinc/50 text-xs leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </BlockWrapper>

        {/* Блок 4: Манифест */}
        <BlockWrapper className="bg-brand-emerald/[0.02]">
          <SectionHeader title="Почему вы до сих пор не там, где хотите?" align="center" />
          <div className="space-y-8 max-w-[320px] mx-auto text-center">
            <p className="text-brand-zinc/60 text-sm leading-relaxed">
              Главная иллюзия предпринимателя: «Мне нужно больше трафика, чтобы больше зарабатывать». 
            </p>
            <div className="text-2xl font-display font-black text-white uppercase italic tracking-tighter leading-tight">
              «Реклама не исправляет хаос, <br/> она его <span className="text-brand-emerald">масштабирует</span>»
            </div>
            <p className="text-brand-zinc/60 text-sm leading-relaxed">
              Вы сидите на мешке с золотом — вашей текущей базе, связях и продукте — но продолжаете искать медь в холодном трафике. Моя задача — включить свет в вашей «темной комнате» активов.
            </p>
          </div>
        </BlockWrapper>

        {/* Блок 5: Метод 7 источников */}
        <BlockWrapper>
          <SectionHeader title="7 источников скрытой прибыли" subTitle="Где именно мы будем искать ваши деньги." />
          <div className="grid gap-3">
            {[
              { n: "Трафик", i: Timer, d: "Оптимизация стоимости и качества входящего потока." },
              { n: "Конверсия", i: TrendingUp, d: "Докрутка каждого этапа воронки до идеала." },
              { n: "Средний чек", i: Target, d: "Упаковка ценности, за которую платят дорого." },
              { n: "LTV", i: Users, d: "Превращение разового покупателя в фаната бренда." },
              { n: "Реферальный капитал", i: MessageCircle, d: "Система рекомендаций, которая работает сама." },
              { n: "Команда и КПД", i: Users, d: "Освобождение собственника от операционного равства." },
              { n: "Архитектура продукта", i: ShieldCheck, d: "Пересборка линейки под максимальную маржу." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <item.i className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.n}</h4>
                  <p className="text-brand-zinc/40 text-[11px] leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Дополнительный блок: Калькулятор */}
        <LossCalculator turnover={turnover} setTurnover={setTurnover} />

        {/* Блок 6: Фильтр (Warning) */}
        {/* Блок 6: Фильтр (Warning) */}
        <BlockWrapper className="bg-red-950/10 border-y border-red-900/20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-[10px] text-red-600 font-bold uppercase tracking-[0.3em] font-bold">Entry Criteria</span>
          </div>
          <h2 className="text-white font-display font-black text-4xl mb-12 tracking-tighter uppercase leading-[0.9]">
            КОМУ МЫ <br/> <span className="text-red-600/50">ОТКАЖЕМ:</span>
          </h2>
          <div className="space-y-4">
            {[
              "Ищете «волшебную таблетку» без продукта.",
              "Ваш бизнес построен на обмане или низком качестве.",
              "Вы не готовы делегировать и менять свои убеждения.",
              "Ваш текущий оборот меньше 300 000 ₽ в месяц."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-red-600/5 border border-red-600/10">
                <X className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-brand-zinc/50 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Блок 4: Манифест */}
        <BlockWrapper className="bg-brand-emerald/[0.02]">
          <SectionHeader title="Почему вы до сих пор не там, где хотите?" align="center" />
          <div className="space-y-8 max-w-[320px] mx-auto text-center">
            <p className="text-brand-zinc/60 text-sm leading-relaxed">
              Главная иллюзия предпринимателя: «Мне нужно больше трафика, чтобы больше зарабатывать». 
            </p>
            <div className="text-2xl font-display font-black text-white uppercase italic tracking-tighter leading-tight">
              «Реклама не исправляет хаос, <br/> она его <span className="text-brand-emerald">масштабирует</span>»
            </div>
            <p className="text-brand-zinc/60 text-sm leading-relaxed">
              Вы сидите на мешке с золотом — вашей текущей базе, связях и продукте — но продолжаете искать медь в холодном трафике. Моя задача — включить свет в вашей «темной комнате» активов.
            </p>
          </div>
        </BlockWrapper>

        {/* Блок 5: Метод 7 источников */}
        <BlockWrapper>
          <SectionHeader title="7 источников скрытой прибыли" subTitle="Где именно мы будем искать ваши деньги." />
          <div className="grid gap-3">
            {[
              { n: "Трафик", i: Timer, d: "Оптимизация стоимости и качества входящего потока." },
              { n: "Конверсия", i: TrendingUp, d: "Докрутка каждого этапа воронки до идеала." },
              { n: "Средний чек", i: Target, d: "Упаковка ценности, за которую платят дорого." },
              { n: "LTV", i: Users, d: "Превращение разового покупателя в фаната бренда." },
              { n: "Реферальный капитал", i: MessageCircle, d: "Система рекомендаций, которая работает сама." },
              { n: "Команда и КПД", i: Users, d: "Освобождение собственника от операционного рабства." },
              { n: "Архитектура продукта", i: ShieldCheck, d: "Пересборка линейки под максимальную маржу." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <item.i className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.n}</h4>
                  <p className="text-brand-zinc/40 text-[11px] leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Дополнительный блок: Калькулятор */}
        <LossCalculator turnover={turnover} setTurnover={setTurnover} />

        {/* Блок 6: Фильтр (Warning) */}
        <BlockWrapper className="bg-red-950/10 border-y border-red-900/20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-[10px] text-red-600 font-bold uppercase tracking-[0.3em]">Entry Criteria</span>
          </div>
          <h2 className="text-white font-display font-black text-4xl mb-12 tracking-tighter uppercase leading-[0.9]">
            КОМУ МЫ <br/> <span className="text-red-600/50">ОТКАЖЕМ:</span>
          </h2>
          <div className="space-y-4">
            {[
              "Ищете «волшебную таблетку» без продукта.",
              "Ваш бизнес построен на обмане или низком качестве.",
              "Вы не готовы делегировать и менять свои убеждения.",
              "Ваш текущий оборот меньше 300 000 ₽ в месяц."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-red-600/5 border border-red-600/10">
                <X className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-brand-zinc/50 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Блок 7, 8, 9: Эшелоны продуктов */}
        <BlockWrapper id="formats">
          <SectionHeader title="Форматы работы" subTitle="От точечного разбора до полного внедрения системы." />
          <div className="space-y-6">
            {/* Эшелон 1 */}
            <div className="glass-card p-8 border-white/10">
              <div className="font-mono text-[9px] text-brand-emerald mb-4 uppercase tracking-widest font-bold">Эшелон 1</div>
              <h3 className="font-display font-black text-2xl mb-4 text-white uppercase leading-none">Блиц-разбор</h3>
              <p className="text-brand-zinc/50 text-xs leading-relaxed mb-8">
                60-минутная сессия, где мы вскрываем вашу Money Matrix и находим ближайшие 300-500к, которые вы недополучаете.
              </p>
              <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                <div className="font-mono font-black text-2xl tracking-tighter text-white">15 000 ₽</div>
                <button className="h-14 w-full bg-brand-emerald text-brand-obsidian rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">ЗАБРОНИРОВАТЬ СЛОТ</button>
              </div>
            </div>

            {/* Эшелон 2 */}
            <div className="glass-card p-8 border-brand-gold/30 bg-brand-gold/[0.05]">
              <div className="absolute top-0 right-0 px-4 py-1 bg-brand-gold text-brand-obsidian font-mono text-[8px] font-bold uppercase tracking-widest rounded-bl-lg">CORE PRODUCT</div>
              <div className="font-mono text-[9px] text-brand-gold mb-4 uppercase tracking-widest font-bold">Эшелон 2</div>
              <h3 className="font-display font-black text-2xl mb-4 text-white uppercase leading-none">Монетизатор</h3>
              <p className="text-brand-zinc/50 text-xs leading-relaxed mb-8">
                2-месячное сопровождение. Моя команда заходит в ваш проект и руками внедряет инструменты из 7 источников прибыли.
              </p>
              <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                <div className="font-mono font-black text-2xl tracking-tighter text-brand-gold">ОТ 300 000 ₽</div>
                <button className="h-14 w-full gold-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-brand-gold/20">ОБСУДИТЬ УСЛОВИЯ</button>
              </div>
            </div>

            {/* Эшелон 3 */}
            <div className="glass-card p-8 border-white/10 opacity-60">
              <div className="font-mono text-[9px] text-brand-emerald mb-4 uppercase tracking-widest font-bold">Эшелон 3</div>
              <h3 className="font-display font-black text-2xl mb-4 text-white uppercase leading-none">Инвест-клуб</h3>
              <p className="text-brand-zinc/50 text-xs leading-relaxed mb-8">
                Закрытое сообщество для тех, кто уже выстроил систему и готов к масштабированию через капитал и связи.
              </p>
              <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                <div className="font-mono font-black text-[10px] tracking-widest text-white/40 uppercase">ТОЛЬКО ПО РЕКОМЕНДАЦИИ</div>
              </div>
            </div>
          </div>
        </BlockWrapper>

        {/* Блок 10: Подарок (Lead Magnet) */}
        <BlockWrapper className="bg-brand-emerald/[0.05]">
          <div className="p-10 rounded-[40px] border border-brand-emerald/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Check className="w-8 h-8 text-brand-emerald opacity-20" />
            </div>
            <h2 className="text-2xl font-display font-black text-white mb-6 uppercase tracking-tight">ЭКСПРЕСС-ДИАГНОСТИКА</h2>
            <p className="text-brand-zinc/60 text-sm leading-relaxed mb-10">
              Я выделяю 3 слота в неделю на бесплатную 15-минутную диагностику. Если вы соответствуете критериям — мы найдем вашу точку роста за 15 минут.
            </p>
            <button 
              onClick={() => window.location.href = `https://t.me/monetizator_osipuk`}
              className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
            >
              ПРОВЕРИТЬ ДОСТУПНОСТЬ
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </BlockWrapper>

        {/* Блок 11: Контакты */}
        <footer className="py-24 px-8 border-t border-white/5">
          <div className="mb-16">
             <h2 className="text-2xl font-display font-black text-white mb-4 uppercase tracking-tighter">
              Перестаньте искать деньги далеко. Давайте найдем их у вас под ногами.
            </h2>
            <p className="text-brand-zinc/40 text-sm leading-relaxed">
              Я всегда на связи для тех, кто готов к взрослому росту и ценит силу окружения.
            </p>
          </div>

          <div className="grid gap-4 mb-20">
            <a href="https://t.me/monetizator_osipuk" className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[10px] text-brand-emerald font-bold uppercase tracking-widest mb-1">Написать лично</div>
                <div className="font-bold text-white">@monetizator_osipuk</div>
              </div>
            </a>
            <a href="https://t.me/monetizator_osipuk_channel" className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 group transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[10px] text-brand-emerald font-bold uppercase tracking-widest mb-1">Вступить в сообщество</div>
                <div className="font-bold text-white">Канал «Монетизатор»</div>
              </div>
            </a>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6 opacity-30">
            <div className="font-mono text-[9px] uppercase tracking-[0.5em]">MONETIZATOR // PROTOCOL // 2026</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
