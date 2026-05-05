import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, ArrowRight, Check, X, Timer, TrendingUp, Users, Target, ShieldCheck, 
  ChevronRight, ArrowDown, Award, BarChart3, Rocket
} from 'lucide-react';
import { leadService } from './lib/leadService';

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
  <section id={id} className={`py-24 px-6 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const SectionHeader = ({ title, subTitle, align = "left" }: { title: string, subTitle?: string, align?: "left" | "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
    <h2 className="text-white font-display font-black text-4xl mb-4 tracking-tighter uppercase leading-[0.9]">
      {title}
    </h2>
    {subTitle && <p className="text-brand-zinc/50 text-sm leading-relaxed max-w-[340px] mx-auto lg:mx-0">{subTitle}</p>}
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
    <div className="glass-card p-8 min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <span className="font-mono text-[10px] text-brand-emerald font-bold uppercase tracking-widest">Вопрос {step + 1}/5</span>
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-brand-emerald" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showInsight ? (
          <motion.div key="q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-bold text-white mb-8 leading-tight">{current.question}</h3>
            <div className="space-y-3">
              {current.options.map((opt, i) => (
                <button key={i} onClick={() => handleOption(opt)} className="w-full p-5 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-brand-emerald/50 hover:bg-brand-emerald/5 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-zinc group-hover:text-white">{opt}</span>
                    <ArrowRight className="w-4 h-4 text-brand-zinc/20 group-hover:text-brand-emerald group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="i" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-1">
            <div className="p-6 rounded-3xl bg-brand-emerald/10 border border-brand-emerald/20 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-widest">Инсайт монетизатора</span>
              </div>
              <p className="text-sm text-brand-zinc/80 leading-relaxed italic">"{current.insight}"</p>
            </div>
            <button onClick={nextStep} className="mt-auto w-full h-14 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
              ДАЛЕЕ <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LossCalculator = ({ turnover, setTurnover }: { turnover: number, setTurnover: (v: number) => void }) => {
  const potential = turnover * 0.42;
  
  return (
    <BlockWrapper className="bg-brand-charcoal border-y border-white/5">
      <SectionHeader title="Калькулятор упущенных денег" subTitle="Узнайте, сколько прибыли вы 'дарите' конкурентам ежемесячно." />
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="font-mono text-[10px] text-brand-zinc/40 uppercase font-bold tracking-widest">Ваш текущий оборот (₽)</label>
            <span className="text-2xl font-black text-white">{turnover.toLocaleString()} ₽</span>
          </div>
          <input 
            type="range" min="100000" max="10000000" step="50000" 
            value={turnover} onChange={(e) => setTurnover(Number(e.target.value))}
            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
          />
        </div>

        <div className="p-8 rounded-[40px] bg-brand-gold/10 border border-brand-gold/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-12 h-12 text-brand-gold" />
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-4">Ваш скрытый потенциал</div>
            <div className="text-5xl font-display font-black text-brand-gold mb-2 tracking-tighter">
              +{potential.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
            </div>
            <div className="text-xs text-brand-zinc/50 uppercase font-bold tracking-widest">ЕЖЕМЕСЯЧНО К ТЕКУЩЕЙ ПРИБЫЛИ</div>
          </div>
        </div>
        
        <p className="text-[10px] text-brand-zinc/30 leading-relaxed text-center uppercase tracking-widest font-bold">
          *Средний показатель активации ресурсов по методу Сергея Осипука составляет 42%
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
  const [turnover, setTurnover] = useState(500000);
  const [activeCase, setActiveCase] = useState<number | null>(null);

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setQuizCompleted(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (!userName.trim()) return;
    setIsSubmitting(true);
    
    try {
      const leadData = {
        name: userName,
        contact: 'Telegram Direct', // Updated to match service schema
        quiz_responses: quizData,
        calculation_data: { turnover, potential: turnover * 0.42 }
      };

      const { session_uuid } = await leadService.submitLead(leadData);
      
      // Redirect to TG with pre-filled message
      const message = encodeURIComponent(`Привет! Я прошел аудит ресурсов на сайте. Мои результаты готовы. ID сессии: ${session_uuid}`);
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald shadow-[0_0_10px_#10b981]" />
              <span className="font-mono text-[9px] text-brand-emerald uppercase tracking-[0.3em] font-bold">Money Matrix Protocol v2.1.1</span>
            </div>

            <h1 className="text-[44px] font-display font-black leading-[0.85] mb-8 tracking-tighter text-white uppercase">
              Ваш бизнес уже <span className="text-brand-emerald">заработал</span> больше, чем вы видите на счету.
            </h1>

            {!quizCompleted ? (
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-white font-bold text-lg leading-tight uppercase tracking-tighter">Пора активировать скрытые ресурсы.</p>
                  <p className="text-brand-zinc/50 text-xs leading-relaxed">
                    Сергей Осипук. Монетизатор ресурсов. Помогаю экспертам и предпринимателям находить дополнительную прибыль в базе, связях и продуктах без лишних затрат на рекламу.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/80">
                    <Check className="w-4 h-4 text-brand-emerald" />
                    <span>+380 000 ₽ за 3 дня — результат на своих ресурсах</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/80">
                    <Check className="w-4 h-4 text-brand-emerald" />
                    <span>15 из 17 человек находят деньги в 1-й день</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/80">
                    <Check className="w-4 h-4 text-brand-emerald" />
                    <span>15 заявок в день с 0 вложений в рекламу</span>
                  </div>
                </div>

                <button 
                  onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
                >
                  НАЙТИ МОИ ТОЧКИ РОСТА
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </button>
                <p className="text-[9px] text-brand-zinc/40 text-center italic uppercase font-bold tracking-widest">
                  Бесплатный экспресс-разбор ваших ресурсов за 30 минут по методу Монетизатора
                </p>

                <div id="quiz-anchor" className="pt-20">
                  <p className="text-sm text-center mb-6 text-brand-zinc/60">
                    Ответьте на <span className="text-white font-bold">5 коротких</span> вопросов и получите <span className="text-brand-emerald font-bold">персональную</span> карту из <span className="text-white font-bold">3-х точек роста</span> вашего бизнеса еще до созвона
                  </p>
                  <Quiz onComplete={handleQuizComplete} />
                </div>
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
                    Ваш персональный план активации прибыли готов. 
                    На основе ваших ответов мы определили, что ваш главный «спящий» актив — <span className="text-brand-emerald font-bold">{quizData[1]?.split('(')[0].trim() || 'Ваши ресурсы'}</span>.
                  </p>
                  <p className="text-[11px] text-brand-zinc/50 leading-relaxed mb-6 italic">
                    Я уже подготовил инструкции по его монетизации. Подтвердите имя, чтобы забрать их в Telegram:
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
                  <p className="text-[9px] text-brand-zinc/40 mt-6 text-center uppercase font-bold tracking-widest">
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
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-10 group grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" alt="Sergey Osipuk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute bottom-8 left-8 z-20">
              <div className="font-mono text-[10px] text-brand-emerald font-bold mb-2 uppercase tracking-widest">Founder // Protocol</div>
              <div className="text-2xl font-black text-white uppercase tracking-tighter">СЕРГЕЙ ОСИПУК</div>
            </div>
          </div>
          <p className="text-brand-zinc/60 text-sm leading-relaxed mb-8">
            Я не теоретик из YouTube. Моя экспертиза — это сплав жесткой бизнес-логики и мастерства коммуникаций:
          </p>
          <div className="space-y-4 mb-10">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 shrink-0 rounded-full bg-brand-emerald/10 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-brand-emerald" />
              </div>
              <p className="text-[11px] text-brand-zinc/70"><b>Дипломированный монетизатор:</b> выпускник школы нестандартного мышления Владислава Бермуды.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 shrink-0 rounded-full bg-brand-emerald/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-brand-emerald" />
              </div>
              <p className="text-[11px] text-brand-zinc/70"><b>Профессиональный нетворкер:</b> эксперт Первой школы профессионального нетворинга Екатерины Косенко.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 shrink-0 rounded-full bg-brand-emerald/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-brand-emerald" />
              </div>
              <p className="text-[11px] text-brand-zinc/70"><b>Масштаб:</b> Через мои форматы прошли 200+ предпринимателей и экспертов.</p>
            </div>
          </div>
          <p className="text-brand-zinc/50 text-xs leading-relaxed italic mb-10">
            Я не просто «консультирую». Я фасилитирую процессы, в которых связи превращаются в партнерства, а ресурсы — в твердую валюту.
          </p>
          <button 
            onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
          >
            Посмотреть кейсы в цифрах
          </button>
        </BlockWrapper>

        {/* Блок 3: Твердые результаты */}
        <BlockWrapper id="cases">
          <SectionHeader title="Твердые результаты" subTitle="Цифры, которые мы достали из «спящих» активов клиентов." />
          <div className="space-y-6">
            {CASES.map((c) => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden group"
              >
                <div className="p-8 cursor-pointer" onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-mono text-[9px] text-brand-emerald uppercase tracking-widest font-bold">{c.title}</div>
                    <div className={`transition-transform duration-300 ${activeCase === c.id ? 'rotate-180' : ''}`}>
                      <ChevronRight className="w-4 h-4 text-brand-zinc/30" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tighter group-hover:text-brand-gold transition-colors">{c.header}</h3>
                  <p className="text-brand-zinc/50 text-[11px] leading-relaxed mb-4">{c.sub}</p>
                  <div className="text-[10px] font-bold text-brand-emerald uppercase tracking-widest border-t border-white/5 pt-4">
                    Ключевой показатель: {c.stats}
                  </div>
                </div>

                <AnimatePresence>
                  {activeCase === c.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-white/[0.02] border-t border-white/5"
                    >
                      <div className="p-8 space-y-6">
                        <div>
                          <div className="text-[9px] font-bold text-brand-zinc/40 uppercase tracking-widest mb-2">Проблема</div>
                          <p className="text-xs text-brand-zinc/70 leading-relaxed">{c.problem}</p>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-brand-zinc/40 uppercase tracking-widest mb-2">Что сделано</div>
                          <p className="text-xs text-brand-zinc/70 leading-relaxed">{c.action}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10">
                          <div className="text-[9px] font-bold text-brand-emerald uppercase tracking-widest mb-1">Результат</div>
                          <p className="text-xs text-brand-zinc/80 leading-relaxed">{c.result}</p>
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
          <div className="space-y-10 max-w-[340px] mx-auto">
            <p className="text-brand-zinc/60 text-sm leading-relaxed text-center">
              Большинство маркетологов совершают преступление против вашего кошелька: они советуют «долить трафика» в систему, которая дырява как решето.
            </p>
            
            <div className="space-y-4">
              {[
                "Если ваша база не разобрана — вы теряете 70% прибыли.",
                "Если вы продаете «в лоб» без входного продукта — вы переплачиваете за клиента в 5 раз.",
                "Если нетворкинг для вас — это спам визитками, вы живете в иллюзии связей."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <X className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[11px] text-brand-zinc/70 font-bold">{text}</p>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 text-center">
              <p className="text-brand-zinc/60 text-sm leading-relaxed mb-6">
                <b>Моя философия проста:</b> Сначала мы выжимаем максимум из того, что у вас <b>уже есть</b>, наводим идеальный порядок в активах, и только потом масштабируем результат.
              </p>
              <p className="text-brand-zinc/40 text-[10px] uppercase font-bold tracking-widest">Взрослый рост — это рост без лишнего прожига бюджета.</p>
            </div>

            <button 
              onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full h-16 bg-brand-emerald text-brand-obsidian rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/20"
            >
              Где именно лежат мои деньги?
            </button>
          </div>
        </BlockWrapper>

        {/* Блок 5: Метод 7 источников */}
        <BlockWrapper id="method">
          <SectionHeader title="Я сканирую ваш проект через 7 «линз» прибыли." subTitle="Деньги в 99% случаев не «приходят» из новой рекламы, а «просыпаются» внутри системы." />
          <div className="grid gap-3">
            {[
              { n: "Клиентская база", i: Users, d: "Превращаем ваш «архив» в актив, который приносит деньги без вложений в трафик." },
              { n: "Повторные продажи", i: TrendingUp, d: "Проектируем логичное продолжение после первой сделки." },
              { n: "Рекомендации", i: MessageCircle, d: "Учимся управлять «сарафаном» системно и экологично, а не ждать его как погоды." },
              { n: "Добавочная ценность", i: Target, d: "Делаем высокий чек обоснованным и желанным для клиента." },
              { n: "Коллаборации", i: Users, d: "Строим партнерства на взаимной выгоде без «кринжа» и спама." },
              { n: "Скрытые услуги", i: BarChart3, d: "Упаковываем вашу экспертность, которая годами давалась «бонусом», в отдельный платный продукт." },
              { n: "Старые клиенты", i: Timer, d: "Возвращаем тех, кто уже доверял вам деньги, через мягкую пользу." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <item.i className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{i + 1}. {item.n}</h4>
                  <p className="text-brand-zinc/40 text-[11px] leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => document.getElementById('calc-anchor')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-12 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
          >
            Просканировать мой бизнес
          </button>
          <div id="calc-anchor" />
        </BlockWrapper>

        {/* Доп блок: Калькулятор */}
        <LossCalculator turnover={turnover} setTurnover={setTurnover} />

        {/* Блок 6: Жесткий фильтр */}
        <BlockWrapper className="bg-red-950/10 border-y border-red-900/20">
          <SectionHeader title="Честно: я работаю не со всеми." subTitle="Мое время и экспертиза — это ресурс для тех, кто готов к взрослому росту. Мы не уговариваем — мы выбираем." />
          <div className="space-y-4 mb-12">
            {[
              { t: "Вы ищете «волшебную кнопку»", d: "Я не достаю деньги из пустоты и не занимаюсь магией." },
              { t: "У вас «абсолютный ноль»", d: "Если нет продукта, нет базы и нет ни одного реального клиента — мой метод вам пока не поможет." },
              { t: "Вы не готовы действовать", d: "Если вам нужна просто «умная стратегия» для папки на рабочем столе, не тратьте мои силы." },
              { t: "Вы ждете «мотивации»", d: "Я даю инструменты, логику и план. Заставлять вас работать — не моя задача." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-red-600/5 border border-red-600/10">
                <div className="flex items-center gap-3 mb-2">
                  <X className="w-4 h-4 text-red-600" />
                  <h4 className="font-bold text-white text-sm">{item.t}</h4>
                </div>
                <p className="text-brand-zinc/50 text-[11px] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <p className="text-brand-zinc/60 text-xs text-center italic mb-10">Я работаю только с теми, кто ценит доверие, среду и готов превращать ресурсы в систему.</p>
          <button 
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Я в адеквате, идем дальше
          </button>
        </BlockWrapper>

        {/* Блоки 7-9: Услуги */}
        <BlockWrapper id="services">
          <SectionHeader title="Форматы работы" subTitle="От точечной диагностики до полного внедрения системы масштабирования." />
          
          <div className="space-y-12">
            {/* Эшелон 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[9px] text-brand-emerald font-bold uppercase tracking-widest">Эшелон 1: Быстрый старт</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="glass-card p-8">
                <h3 className="text-2xl font-display font-black text-white mb-6 uppercase">Шаг №1: Увидеть точки недозаработка</h3>
                <div className="space-y-6 mb-10">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white text-sm">Диагностика (60 мин)</span>
                      <span className="font-mono font-bold text-brand-emerald">5 000 ₽</span>
                    </div>
                    <p className="text-[10px] text-brand-zinc/50 leading-relaxed">Индивидуальный разбор. Находим «спящие» активы и 2-3 конкретных шага на 7 дней.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white text-sm">Монетизатор.Блиц</span>
                      <span className="font-mono font-bold text-brand-emerald">от 1 990 ₽</span>
                    </div>
                    <p className="text-[10px] text-brand-zinc/50 leading-relaxed">Мини-игра-разведка. Идеально, если проект буксует и нужен свежий взгляд.</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                  className="w-full h-14 bg-brand-emerald text-brand-obsidian rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-brand-emerald/10"
                >
                  Назначить время диагностики
                </button>
              </div>
            </div>

            {/* Эшелон 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-widest">Эшелон 2: Среда и Прорыв</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="glass-card p-8 border-brand-gold/20 bg-brand-gold/[0.02]">
                <h3 className="text-2xl font-display font-black text-white mb-6 uppercase">Шаг №2: Собрать стратегию в кругу сильных</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">Мастермайнд (Сборный)</h4>
                      <p className="text-[10px] text-brand-zinc/50 leading-relaxed">Игра «Монетизатор» + штурм идей.</p>
                    </div>
                    <span className="font-mono font-bold text-brand-gold shrink-0">5 000 ₽</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-white/5 pb-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">Корпоративный формат</h4>
                      <p className="text-[10px] text-brand-zinc/50 leading-relaxed">Отработка запроса вашей команды (до 6 чел).</p>
                    </div>
                    <span className="font-mono font-bold text-brand-gold shrink-0">40 000 ₽</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">Стратегическая сессия</h4>
                      <p className="text-[10px] text-brand-zinc/50 leading-relaxed">2-2.5 часа + карта ресурсов на 30 дней.</p>
                    </div>
                    <span className="font-mono font-bold text-brand-gold shrink-0">15 000 ₽</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                  className="w-full h-14 gold-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-brand-gold/20"
                >
                  Выбрать формат участия
                </button>
              </div>
            </div>

            {/* Эшелон 3 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="font-mono text-[9px] text-brand-emerald font-bold uppercase tracking-widest">Эшелон 3: Масштаб и Внедрение</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>
              <div className="glass-card p-8 opacity-90">
                <h3 className="text-2xl font-display font-black text-white mb-6 uppercase">Шаг №3: Дойти до результата вместе</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Групповое наставничество</span>
                    <span className="text-[10px] text-brand-zinc/40 uppercase font-bold tracking-widest">20к / мес</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Ведение стратегии</span>
                    <span className="text-[10px] text-brand-zinc/40 uppercase font-bold tracking-widest">20к / мес</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Индивидуальное сопровождение</span>
                    <span className="text-[10px] text-brand-zinc/40 uppercase font-bold tracking-widest">50к / мес</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                  className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                >
                  Зайти в сопровождение
                </button>
              </div>
            </div>
          </div>
        </BlockWrapper>

        {/* Блок 10: Подарок */}
        <BlockWrapper className="bg-brand-emerald/[0.05]">
          <div className="p-10 rounded-[40px] border border-brand-emerald/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Rocket className="w-8 h-8 text-brand-emerald opacity-20" />
            </div>
            <SectionHeader title="Давайте найдем ваши деньги вместе. Бесплатно." align="center" />
            <div className="space-y-6 text-center mb-10">
              <p className="text-brand-zinc/60 text-sm leading-relaxed">
                Я знаю, что вы уже слышали сотни обещаний от маркетологов. Поэтому я предлагаю вам не слова, а тест-драйв моего метода.
              </p>
              <div className="p-6 rounded-3xl bg-brand-emerald/10 border border-brand-emerald/20">
                <h4 className="font-bold text-white text-sm mb-2">Экспресс-диагностика (20–30 минут)</h4>
                <p className="text-[11px] text-brand-zinc/70">Мы просканируем ваш проект и подсветим точки роста. Вы уйдете с пониманием, где лежат ваши «спящие» миллионы.</p>
              </div>
              <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">Внимание: Беру только 3–5 человек в неделю. Только тех, у кого уже есть продукт и база.</p>
            </div>
            <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
              className="w-full h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
            >
              Записаться на экспресс-разбор
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </BlockWrapper>

        {/* Блок 11: Контакты */}
        <footer className="py-24 px-8 border-t border-white/5 bg-black/20">
          <SectionHeader title="Перестаньте искать деньги далеко. Давайте найдем их у вас под ногами." subTitle="Я всегда на связи для тех, кто готов к взрослому росту и ценит силу окружения." />
          
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
                <BarChart3 className="w-6 h-6 text-brand-emerald" />
              </div>
              <div>
                <div className="text-[10px] text-brand-emerald font-bold uppercase tracking-widest mb-1">Вступить в сообщество</div>
                <div className="font-bold text-white">Канал «Монетизатор»</div>
              </div>
            </a>
          </div>

          <div className="flex flex-col gap-4">
             <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
              className="w-full h-14 emerald-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Написать в Telegram
            </button>
            <button 
              onClick={() => window.location.href = 'https://t.me/monetizator_osipuk_channel'}
              className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Подписаться на канал
            </button>
          </div>

          <div className="pt-24 flex flex-col items-center gap-6 opacity-20">
            <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-center">MONETIZATOR // PROTOCOL // 2026<br/>ALL RIGHTS RESERVED</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
