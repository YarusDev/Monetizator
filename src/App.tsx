import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  MessageCircle, 
  ExternalLink,
  CheckCircle2,
  Award,
  Users,
  BarChart3,
  ArrowDown,
  Timer
} from 'lucide-react';
import { Quiz } from './components/Quiz';

// --- UI Components ---

const BlockWrapper = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`px-6 py-20 ${className}`}>
    <div className="max-w-xl mx-auto">
      {children}
    </div>
  </section>
);

const SectionHeader = ({ title, subTitle, align = "left" }: { title: string; subTitle?: string; align?: "left" | "center" }) => (
  <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
    <div className={`w-12 h-1.5 bg-brand-emerald mb-6 ${align === "center" ? "mx-auto" : ""}`} />
    <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4">{title}</h2>
    {subTitle && <p className="text-brand-zinc/40 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">{subTitle}</p>}
  </div>
);

const ProductCard = ({ name, price, desc, img, accentColor = "brand-emerald" }: any) => (
  <div className="group relative bg-brand-charcoal/30 border border-white/5 rounded-[40px] overflow-hidden hover:border-white/10 transition-all duration-500">
    <div className="aspect-[16/10] overflow-hidden">
      <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-50 group-hover:opacity-100" />
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">{name}</h3>
        <span className={`px-4 py-1.5 rounded-full bg-${accentColor}/10 border border-${accentColor}/20 text-${accentColor} font-mono text-[10px] font-black`}>{price}</span>
      </div>
      <p className="text-brand-zinc/50 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SpinningCoin = ({ className = "", size = "w-24 h-24" }: { className?: string; size?: string }) => (
  <div className={`relative ${size} ${className} perspective-1000 mx-auto`}>
    <motion.div
      animate={{ rotateY: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="w-full h-full rounded-full bg-gradient-to-br from-brand-gold via-brand-emerald to-brand-gold p-1 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
    >
      <div className="w-full h-full rounded-full bg-brand-obsidian flex items-center justify-center border border-white/10">
        <span className="text-brand-gold font-display font-black text-3xl">M</span>
      </div>
    </motion.div>
  </div>
);

const ScrollRouteLine = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1.2]);
  
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

// --- Main Page ---

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadData, setLeadData] = useState({ name: '' });

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setQuizCompleted(true);
    setTimeout(() => {
      document.getElementById('quiz-result-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating lead submission
    setTimeout(() => {
      window.location.href = `https://t.me/monetizator_osipuk?text=Привет! Я ${leadData.name}. Прошел аудит. Мои ответы: ${JSON.stringify(quizData)}`;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-obsidian text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black relative overflow-x-hidden">
      
      {/* Red Route Line */}
      <ScrollRouteLine />

      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian/95 shadow-2xl relative border-x border-white/5 backdrop-blur-md z-10">
        
        {/* Hero Section */}
        <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center">
          <SpinningCoin className="mb-10" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-[0_0_12px_#10b981]" />
            <span className="font-mono text-[11px] text-brand-emerald uppercase tracking-[0.4em] font-black">Money Matrix Protocol v2.5.2</span>
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
                <Quiz onComplete={handleQuizComplete} />
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-[40px] bg-brand-emerald/10 border border-brand-emerald/20 text-center animate-pulse">
              <CheckCircle2 className="w-16 h-16 text-brand-emerald mx-auto mb-6" />
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-2">Анализ завершен!</h2>
              <p className="text-brand-emerald font-mono text-[10px] font-black uppercase tracking-widest">Прокрутите вниз для результата</p>
            </div>
          )}
        </BlockWrapper>

        {/* Quiz Success Form */}
        {quizCompleted && (
          <BlockWrapper id="quiz-result-anchor" className="bg-brand-emerald/[0.03] py-24">
            <div className="p-10 rounded-[50px] border border-brand-emerald/20 bg-brand-obsidian shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-emerald shadow-[0_0_20px_#10b981]" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/20 flex items-center justify-center border border-brand-emerald/30">
                  <CheckCircle2 className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <div className="text-brand-emerald font-mono text-[10px] font-black uppercase tracking-widest">Шаг 2/2: Завершение</div>
                  <h3 className="text-white font-display font-black text-2xl uppercase tracking-tight">Аудит завершен!</h3>
                </div>
              </div>
              <p className="text-brand-zinc/50 text-base mb-10 font-medium leading-relaxed">
                На основе ваших ответов я подготовил карту из <span className="text-white font-black">3-х точек быстрого роста</span>. Оставьте контакт, чтобы получить её в Telegram и забронировать время на экспресс-разбор.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                  type="text" placeholder="ВАШЕ ИМЯ" required value={leadData.name} onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                  className="w-full h-18 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white placeholder:text-brand-zinc/20 focus:border-brand-emerald/50 focus:bg-brand-emerald/5 outline-none transition-all uppercase tracking-widest"
                />
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕЗУЛЬТАТ'} <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            </div>
          </BlockWrapper>
        )}

        {/* About Section */}
        <BlockWrapper id="about" className="bg-brand-charcoal/50">
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
        </BlockWrapper>

        {/* Cases */}
        <BlockWrapper id="cases" className="bg-brand-obsidian py-32">
          <SectionHeader title="Твердые результаты" subTitle="Как метод Монетизатора работает на практике" align="center" />
          <div className="space-y-12">
            {[
              { t: "Фотограф", v: "+55 000 ₽ / 14 дней", d: "Подняли выручку с 75к до 130к без новых вложений. Механика: Допродажи + База." },
              { t: "Школа языков", v: "+30% к обороту", d: "Отработали «окна» в расписании и возвраты через отказников. Рост за 1 месяц." },
              { t: "Инвест-недвижимость", v: "Новая VIP-аудитория", d: "Переупаковали оффер под партнерскую сеть. Закрыты 2 сделки за неделю." },
              { t: "MLM-предприниматель", v: "+60 000 ₽ личных продаж", d: "Активировали спящую ветку через игровой формат. +15 партнеров." },
              { t: "Юрист (консультации)", v: "10 заявок вместо 1", d: "Аудит ресурсов показал, что 90% трафика уходит в никуда. Исправили воронку." },
              { t: "Производство BBQ", v: "VIP-активация", d: "Внедрили сервисную модель входа. Продажа 3-х премиум-комплектов." }
            ].map((c, i) => (
              <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-brand-emerald/30 transition-all">
                <div className="text-brand-emerald font-mono text-[10px] font-black uppercase tracking-widest mb-2">{c.t}</div>
                <div className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-4">{c.v}</div>
                <p className="text-brand-zinc/50 text-sm font-medium">{c.d}</p>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Manifesto */}
        <BlockWrapper className="bg-brand-emerald/[0.05] py-32">
          <SectionHeader title="Манифест" subTitle="Почему реклама не исправляет хаос" />
          <div className="space-y-10">
            <p className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">Реклама — это бензин. Если ваш мотор неисправен, вы просто сожжете деньги быстрее.</p>
            <div className="grid gap-6">
              {[
                "База клиентов — это «нефть», которую вы не качаете.",
                "Продажи «в лоб» больше не работают — нужны смыслы.",
                "Нетворкинг без системы — это просто спам и потеря времени."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-emerald/20 flex items-center justify-center border border-brand-emerald/30 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                  </div>
                  <span className="text-brand-zinc/70 text-lg font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </BlockWrapper>

        {/* 7 Sources */}
        <BlockWrapper className="bg-brand-obsidian py-32">
          <SectionHeader title="7 источников прибыли" subTitle="Мы сканируем проект через 7 линз" align="center" />
          <div className="grid grid-cols-1 gap-6">
            {[
              "Текущая клиентская база",
              "Повторные продажи и LTV",
              "Сарафанное радио и рекомендации",
              "Дополнительная ценность продукта",
              "Коллаборации и партнерства",
              "Скрытые услуги и экспертность",
              "Старые и «отвалившиеся» клиенты"
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-brand-emerald/5 transition-all">
                <span className="text-3xl font-display font-black text-brand-emerald/20 group-hover:text-brand-emerald/50 transition-all">0{i+1}</span>
                <span className="text-white font-black uppercase tracking-tight text-sm">{s}</span>
              </div>
            ))}
          </div>
        </BlockWrapper>

        {/* Filter Section */}
        <BlockWrapper className="bg-brand-charcoal py-32">
          <SectionHeader title="Работаю не со всеми" subTitle="Берегу свое время и ваш результат" />
          <div className="space-y-8">
            <p className="text-brand-zinc/50 text-lg font-medium leading-relaxed">Мой метод требует готовности к изменениям. Я не беру проекты, где:</p>
            <div className="space-y-4">
              {[
                "Ищут «волшебную кнопку» без личного участия",
                "В бизнесе абсолютный ноль и нет продукта",
                "Не готовы внедрять рекомендации здесь и сейчас",
                "Просто хотят «поговорить» и вдохновиться"
              ].map((f, i) => (
                <div key={i} className="flex gap-5 items-center p-5 rounded-2xl bg-black/20 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-brand-emerald/40" />
                  <span className="text-white/80 font-bold uppercase tracking-tight text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </BlockWrapper>

        {/* Services */}
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
