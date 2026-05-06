import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Timer,
  ArrowRight
} from 'lucide-react';

const ExpertInsightModal = ({ insight, onNext, onBack, showBack }: { insight: string; onNext: () => void; onBack: () => void; showBack: boolean }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="bg-brand-obsidian border border-brand-emerald/30 p-8 rounded-[40px] max-w-[400px] w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-emerald shadow-[0_0_15px_#10b981]" />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-brand-emerald/30 shadow-lg">
          <img src="assets/PhotoExpert.jpg" alt="Expert" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-widest">Инсайт эксперта</div>
          <div className="text-white font-display font-black text-lg uppercase tracking-tight">Сергей Осипук</div>
        </div>
      </div>
      <p className="text-brand-zinc text-lg leading-relaxed font-medium mb-10">{insight}</p>
      <div className="w-full flex gap-3">
        {showBack && (
          <button 
            onClick={onBack}
            className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> НАЗАД
          </button>
        )}
        <button 
          onClick={onNext}
          className="flex-[2] h-16 rounded-2xl emerald-gradient text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
        >
          ПРОДОЛЖИТЬ <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export const Quiz = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showInsight, setShowInsight] = useState(false);
  const [activeUsers, setActiveUsers] = useState(7);
  const [secondsRemaining, setSecondsRemaining] = useState(45);

  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal < 3 ? 3 : newVal > 10 ? 10 : newVal;
      });
    }, 4000);
    
    const timerInterval = setInterval(() => {
      setSecondsRemaining(prev => prev > 5 ? prev - 1 : prev);
    }, 1000);

    return () => {
      clearInterval(userInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const questions = [
    {
      question: "В какой роли вы сейчас создаете ценность?",
      options: [
        "Я эксперт / Частный специалист",
        "Я предприниматель",
        "Я собственник бизнеса (команда и продукт)",
        "Я лидер сообщества / Организатор"
      ],
      insight: "Важно: У каждой роли — своя 'золотая жила'. Эксперты часто сидят на нераспакованной базе, а собственники — на недооцененных коллаборациях. Мы настроим ваш аудит именно под вашу специфику."
    },
    {
      question: "Какой актив у вас сейчас самый объемный, но приносит меньше всего денег?",
      options: [
        "Клиентская база (старые контакты)",
        "Социальный капитал (связи, нетворкинг)",
        "Личный бренд / Доверие",
        "Продукт / Экспертность"
      ],
      insight: "Знаете ли вы? По статистике, работа со 'старой' базой в 5-7 раз дешевле, чем привлечение новых лидов. Вы прямо сейчас платите 'налог на бездействие', оставляя эти деньги конкурентам."
    },
    {
      question: "Что сейчас больше всего мешает вам вырасти в 2-3 раза?",
      options: [
        "Сжигаю бюджет на рекламу, лиды дорогие",
        "Живу на 'сарафанке' — то густо, то пусто",
        "Не знаю, как продавать дорого",
        "Нет системы: всё на личных усилиях"
      ],
      insight: "Главная ловушка: Реклама не исправляет хаос, она его усиливает. Если система 'дырявая', новый трафик просто быстрее сожжет ваши деньги. Мы сначала 'залатаем' дыры через ваши внутренние ресурсы."
    },
    {
      question: "Как часто вы контактируете с базой тех, кто уже покупал?",
      options: [
        "Раз в неделю / месяц (есть воронка)",
        "Очень редко / По настроению",
        "Вообще не контактирую"
      ],
      insight: "Это ваша 'точка слива'. 15 из 17 наших клиентов находят первые деньги именно здесь, просто правильно напомнив о себе через 'мягкий вход'. Это те самые деньги под ногами."
    },
    {
      question: "Какую сумму прибыли вы хотите «достать» в ближайшие 30 дней?",
      options: [
        "До 100 000 ₽",
        "100 000 – 500 000 ₽",
        "Более 500 000 ₽"
      ],
      insight: "Цифра реальна. Мой личный результат — +380 000 ₽ за 3 дня на своих же ресурсах. Ваш результат зависит только от точности выбранной стратегии монетизации."
    }
  ];

  const handleSelect = (val: string) => {
    setAnswers([...answers, val]);
    setShowInsight(true);
  };

  const next = () => {
    setShowInsight(false);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };


  const back = () => {
    setShowInsight(false);
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="bg-brand-charcoal/50 border border-white/5 rounded-[40px] p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
      
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-brand-emerald shadow-[0_0_10px_#10b981]' : 'w-3 bg-white/10'}`} />
          ))}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-brand-emerald/10 px-3 py-1.5 rounded-full border border-brand-emerald/20">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-[10px] font-black text-brand-emerald uppercase tracking-widest">{activeUsers} в сети</span>
          </div>
          <div className="text-[9px] text-brand-zinc/30 font-black uppercase tracking-widest flex items-center gap-1.5">
            <Timer className={`w-3 h-3 ${secondsRemaining < 20 ? 'text-red-500 animate-pulse' : ''}`} /> 
            ~{secondsRemaining} сек до финиша
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">{questions[step].question}</h3>
          <div className="grid gap-3">
            {questions[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-left text-brand-zinc hover:bg-brand-emerald/10 hover:border-brand-emerald/30 transition-all flex items-center justify-between group"
              >
                <span className="font-bold text-sm uppercase tracking-wide group-hover:text-white transition-colors">{opt}</span>
                <ArrowRight className="w-5 h-5 text-brand-zinc/20 group-hover:text-brand-emerald transition-all transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showInsight && (
          <ExpertInsightModal 
            insight={questions[step].insight} 
            onNext={next} 
            onBack={back}
            showBack={step > 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

