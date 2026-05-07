import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Timer,
  Users as UsersIcon
} from 'lucide-react';

// Конфигурация вопросов
const QUIZ_CONFIG = {
  initialQuestion: {
    id: 'role',
    question: "В какой роли вы сейчас создаете ценность?",
    options: [
      { label: "Я эксперт / Частный специалист", value: "expert" },
      { label: "Я собственник бизнеса", value: "owner" },
      { label: "Я предприниматель", value: "entrepreneur" },
      { label: "Я организатор / Лидер сообщества", value: "leader" },
      { label: "Я только планирую запуск", value: "newbie" }
    ],
    insight: "У каждой роли — своя 'золотая жила'. Собственники часто зарывают деньги в недооцененных активах компании, а эксперты — в бесплатной раздаче ценнейших знаний. Мы настроим ваш аудит на поиск тех ресурсов, которые вы уже создали, но еще не обналичили."
  },
  branches: {
    expert: [
      {
        question: "Что из вашей экспертности или материалов вы сейчас отдаете клиентам «бонусом» или бесплатно?",
        options: ["Свои авторские методики/гайды", "Личные консультации сверх пакета", "Глубокую аналитику/аудит", "Ничего, всё платно"],
        insight: "Это 5-й источник прибыли — Скрытые услуги. То, что вы считаете 'само собой разумеющимся', для клиента часто является самым ценным. Перестав раздавать это бесплатно и упаковав в отдельный продукт, вы можете поднять доход на 20% без поиска новых людей."
      },
      {
        question: "Что мешает вам удвоить чек на свои услуги прямо сейчас?",
        options: ["Страх, что старые клиенты уйдут", "Нет понимания, как обосновать цену", "Слишком высокая конкуренция"],
        insight: "Цена — это не цифра, это ваша Самопрезентация. Если вы продаете 'процесс', вы всегда будете дешевым. Мы вытащим из вашего ДНК такие смыслы, что клиент будет покупать ваше Состояние и измеримый Результат, не торгуясь."
      },
      {
        question: "Как вы сейчас отсеиваете 'пустые' запросы от тех, кто реально готов платить?",
        options: ["Трачу время на бесплатные созвоны", "Интуитивно в переписке", "У меня нет системы фильтрации"],
        insight: "Бесплатные консультации — это сжигание вашего главного актива (времени). Умный диагностический слой должен делать 80% работы за вас, подпуская к вам только тех, кто уже понимает вашу ценность."
      }
    ],
    owner: [
      {
        question: "Какой объем вашей клиентской базы (контакты в CRM, таблицах, почте)?",
        options: ["До 1000", "1000 – 5000", "Более 5000", "Не ведем учет"],
        insight: "Ваша база — это 1-й источник прибыли. Большинство собственников тратят миллионы на новый трафик, пока их главный актив 'пылится'. Мы превратим эти контакты в живые деньги за счет правильного оффера."
      },
      {
        question: "Сколько клиентов возвращаются к вам за второй и третьей покупкой системно?",
        options: ["Более 30% (есть система)", "Менее 10% (случайно)", "Только разовые продажи"],
        insight: "Привлечение нового клиента стоит в 7 раз дороже, чем удержание старого. Если у вас нет системы повторных продаж (2-й источник), вы буквально выбрасываете маржу. Мы найдем 'точки касания'."
      },
      {
        question: "Можете ли вы полностью отключить телефон на месяц, не потеряв в прибыли?",
        options: ["Да, всё работает как часы", "Нет, держится на моем контроле", "Прибыль сразу упадет"],
        insight: "Если всё завязано на вас — вы узкое горлышко своей компании. Чтобы расти, нужно переложить первичную диагностику и продажи на систему. Это позволит вам выйти из операционки."
      }
    ],
    entrepreneur: [
      {
        question: "Где вы фиксируете контакты людей, которые интересовались, но не купили?",
        options: ["В CRM или таблице", "В истории переписок", "Нигде не фиксирую"],
        insight: "Если контакты лежат в переписках — у вас нет базы, у вас есть 'кладбище данных'. Это 6-й источник прибыли — Работа с отказниками. Мы научимся возвращать их за 1 сообщение."
      },
      {
        question: "Какую ценную часть работы вы сейчас делаете бесплатно 'ради хороших отношений'?",
        options: ["Глубокий брифинг", "Составление стратегии/плана", "Ответы на вопросы 24/7"],
        insight: "Вы сжигаете маржу там, где могли бы продавать Трипвайер. То, что вы называете 'сервисом', — это Скрытая услуга. Платный диагностический вход сразу окупает ваше время."
      },
      {
        question: "Как часто к вам приходят клиенты по 'сарафанному радио'?",
        options: ["Постоянно, но хаотично", "Редко", "Плачу комиссию за рекомендации"],
        insight: "Сарафан — это 3-й источник (Рекомендательная машина). Но пока он неуправляем, вы в заложниках у случая. Мы превратим ваше окружение в систему стабильных поставок клиентов."
      }
    ],
    leader: [
      {
        question: "Есть ли у вас единая база ресурсов ваших людей (кто чем владеет, связи)?",
        options: ["Да, структурированный каталог", "Только общие анкеты", "Всё только в моей голове"],
        insight: "Вы сидите на золотой жиле нетворкинга. Каждое неслучившееся знакомство в клубе — упущенная прибыль. Мы создадим систему 'Матчинга', которая сделает ценность сообщества в 10 раз выше."
      },
      {
        question: "Получаете ли вы процент за то, что соединяете нужных людей друг с другом?",
        options: ["Да, это бизнес-модель", "Редко, если сами предложат", "Нет, делаю это просто так"],
        insight: "Коллаборации — это 4-й источник прибыли. Если вы соединяете ресурсы без фиксации своей ценности, вы 'бесплатный справочник'. Мы внедрим модель 'Маршрутизатора'."
      },
      {
        question: "Какая часть вашей аудитории активно следит за вами и предложениями?",
        options: ["Более 30% (ядро)", "Менее 10% (спящие)", "Трудно оценить"],
        insight: "Вниманием нужно управлять. Если люди просто сидят в чате — это пассив. Мы активируем базу через механику 'Карты ресурсов', чтобы каждый участник стал активным звеном вашей прибыли."
      }
    ],
    newbie: [
      {
        question: "Какой актив у вас сейчас в самом большом объеме?",
        options: ["Твердые знания", "Сеть связей", "Стартовый капитал", "Понятная идея"],
        insight: "Запуск 'с нуля' — это иллюзия. У вас уже есть избыточный ресурс. Мы сделаем его 'оффером-локомотивом', чтобы вы окупили запуск еще до его начала."
      },
      {
        question: "Каким способом вы планируете привлекать первых платных клиентов?",
        options: ["Через личные связи", "Через рекламу на холодную", "Через прогрев в соцсетях"],
        insight: "Реклама на холодную — самый дорогой путь. Мы пойдем через 1-й и 4-й источники: активацию имеющихся контактов и партнерства. Первые деньги без риска слить бюджет."
      },
      {
        question: "Что сейчас больше всего тормозит ваш запуск?",
        options: ["Страх продаж/чеков", "Сложность упаковки", "Непонимание, за что заплатят"],
        insight: "Люди платят не за кнопки, а за решение боли вашим методом. Мы распакуем ваше ДНК и создадим 'Мягкий вход' (диагностику), который сам продаст вашу экспертность."
      }
    ]
  },
  finalQuestion: {
    question: "Какую сумму чистой прибыли вы планируете «достать» в ближайшие 30 дней?",
    options: ["До 100 000 ₽", "100 000 – 500 000 ₽", "Более 500 000 ₽"],
    insight: "Эта сумма — лишь вопрос выбора правильного рычага из 7 источников. Мой личный результат — +380 000 ₽ за 3 дня на своих же ресурсах. Сейчас я подготовлю для вас план."
  }
};

export const Quiz = ({ onComplete, onShowInsight, block }: { onComplete: (data: any) => void; onShowInsight: (insight: any) => void; block?: any }) => {
  const content = block?.content || {};
  // Load state from localStorage
  const savedState = JSON.parse(localStorage.getItem('monetizator_quiz_state') || 'null');
  
  const [step, setStep] = useState(savedState?.step || 0);
  const [branch, setBranch] = useState<string | null>(savedState?.branch || null);
  const [answers, setAnswers] = useState<any[]>(savedState?.answers || []);

  const [activeUsers, setActiveUsers] = useState(12);
  const [secondsRemaining, setSecondsRemaining] = useState(45);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('monetizator_quiz_state', JSON.stringify({ step, branch, answers }));
  }, [step, branch, answers]);

  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal < 8 ? 8 : newVal > 18 ? 18 : newVal;
      });
    }, 5000);
    
    const timerInterval = setInterval(() => {
      setSecondsRemaining(prev => prev > 10 ? prev - 1 : prev);
    }, 1000);

    return () => {
      clearInterval(userInterval);
      clearInterval(timerInterval);
    };
  }, []);

  // Determine current question based on step and branch
  const currentQuestionData = useMemo(() => {
    // Check if block has custom questions
    if (block?.content?.questions && Array.isArray(block.content.questions) && block.content.questions.length > 0) {
      return block.content.questions[step] || block.content.questions[0];
    }

    if (step === 0) return QUIZ_CONFIG.initialQuestion;
    if (step === 4) return QUIZ_CONFIG.finalQuestion;
    if (branch && QUIZ_CONFIG.branches[branch as keyof typeof QUIZ_CONFIG.branches]) {
      return QUIZ_CONFIG.branches[branch as keyof typeof QUIZ_CONFIG.branches][step - 1];
    }
    return QUIZ_CONFIG.initialQuestion;
  }, [step, branch, block?.content?.questions]);

  const [isFinished, setIsFinished] = useState(false);

  const next = (answerLabel?: string) => {
    const newAnswers = [...answers];
    if (answerLabel) {
      newAnswers[step] = answerLabel;
      setAnswers(newAnswers);
    }
    
    if (step === 0 && answerLabel) {
      const selectedOption = QUIZ_CONFIG.initialQuestion.options.find(o => o.label === answerLabel);
      if (selectedOption) setBranch(selectedOption.value);
    }

    if (step === 4) {
      setIsFinished(true);
      onComplete(newAnswers);
      localStorage.removeItem('monetizator_quiz_state');
    } else {
      setStep((prev: number) => prev + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep((prev: number) => prev - 1);
    }
  };

  const handleSelect = (val: string) => {
    if (currentQuestionData.insight) {
      onShowInsight({
        text: currentQuestionData.insight,
        onNext: () => next(val),
        onBack: back,
        showBack: step > 0
      });
    } else {
      next(val);
    }
  };

  if (isFinished) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-brand-charcoal/50 border border-brand-emerald/30 rounded-[40px] p-8 relative overflow-hidden shadow-2xl backdrop-blur-md text-center">
            <div className="w-20 h-20 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-emerald/40">
                <Timer className="w-10 h-10 text-brand-emerald" />
            </div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-4">
                План готов!
            </h3>
            <p className="text-brand-zinc/60 mb-8 max-w-xs mx-auto text-sm">
                Я проанализировал ваши ответы. Оставьте контакт, чтобы я прислал вам PDF-карту с вашими 7 источниками прибыли.
            </p>
            
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Ваше имя" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white focus:border-brand-emerald/50 outline-none transition-all"
                />
                <input 
                    type="text" 
                    placeholder="Telegram / Телефон" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white focus:border-brand-emerald/50 outline-none transition-all"
                />
                <button 
                    className="w-full h-16 bg-brand-emerald text-brand-obsidian font-black rounded-2xl uppercase tracking-widest hover:shadow-[0_0_20px_#10b981] transition-all"
                    onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                >
                    Получить результат
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {block && (
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-4 leading-tight">
            {content.title || ""}
          </h2>
          {content.description && (
            <p className="text-brand-zinc/50 text-base max-w-xl mx-auto font-medium leading-relaxed">
              {content.description}
            </p>
          )}
        </div>
      )}

      {block?.content?.image && (
        <div className="relative max-w-2xl mx-auto mb-8 group">
          <div className="absolute -inset-4 bg-brand-emerald/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={block.content.image.startsWith('assets/') ? `/${block.content.image}` : block.content.image} 
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" 
              alt="Quiz Preview" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent opacity-60" />
          </div>
        </div>
      )}

      <div className="bg-brand-charcoal/50 border border-white/5 rounded-[40px] p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Activity Widget */}
      <div className="absolute top-4 right-4 z-10 hidden md:block">
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex items-center gap-2 bg-brand-emerald/10 px-3 py-1.5 rounded-full border border-brand-emerald/20 backdrop-blur-sm"
        >
          <UsersIcon className="w-3 h-3 text-brand-emerald" />
          <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">
            {activeUsers} проходят
          </span>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mb-10 relative mt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-brand-emerald shadow-[0_0_10px_#10b981]' : 'w-3 bg-white/10'}`} />
          ))}
        </div>
        <div className="text-[8px] text-brand-zinc/30 font-black uppercase tracking-widest flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <Timer className={`w-2.5 h-2.5 ${secondsRemaining < 20 ? 'text-red-500 animate-pulse' : ''}`} /> 
          ~{secondsRemaining} сек
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-lg md:text-xl font-display font-bold text-white uppercase tracking-tight leading-tight">
            {currentQuestionData.question}
          </h3>
          <div className="grid gap-2.5">
            {currentQuestionData.options.map((opt: any) => {
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <button
                  key={label}
                  onClick={() => handleSelect(label)}
                  className={`w-full p-4 md:p-5 rounded-xl border transition-all flex items-center justify-between group ${
                    answers[step] === label 
                    ? 'bg-brand-emerald/20 border-brand-emerald/50' 
                    : 'bg-white/5 border-white/10 hover:bg-brand-emerald/10 hover:border-brand-emerald/30'
                  }`}
                >
                  <span className={`font-bold text-[10px] md:text-xs uppercase tracking-wide transition-colors text-left pr-4 ${
                    answers[step] === label ? 'text-white' : 'text-brand-zinc group-hover:text-white'
                  }`}>
                    {label}
                  </span>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-all transform ${
                    answers[step] === label ? 'text-brand-emerald translate-x-1' : 'text-brand-zinc/20 group-hover:text-brand-emerald group-hover:translate-x-1'
                  }`} />
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
};
