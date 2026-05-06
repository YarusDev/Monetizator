import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Timer
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
  const [answers, setAnswers] = useState<Record<string, any>>({});
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
      id: 'biz_q1',
      title: "Ваша текущая роль?",
      options: [
        { text: "Эксперт / Фрилансер", value: "expert" },
        { text: "Владелец бизнеса", value: "owner" },
        { text: "Запускаю новый проект", value: "startup" }
      ],
      insight: "Эксперты часто занижают чек, а владельцы бизнеса теряют до 30% прибыли на неэффективных связях. Ваш выбор определит фокус аудита."
    },
    {
      id: 'biz_q2',
      title: "Главная цель на 30 дней?",
      options: [
        { text: "Увеличить чистую прибыль", value: "profit" },
        { text: "Системный поток заявок", value: "leads" },
        { text: "Выход из операционки", value: "exit_ops" }
      ],
      insight: "Прибыль растет быстрее всего через работу с текущей базой, а не через покупку нового трафика. Это мой главный принцип."
    },
    {
      id: 'biz_q3',
      title: "Как часто клиенты возвращаются?",
      options: [
        { text: "Постоянно (LTV высокий)", value: "high" },
        { text: "Редко (Разовые продажи)", value: "low" },
        { text: "Не знаю / Не считаю", value: "unknown" }
      ],
      insight: "Если клиент не возвращается — вы каждый месяц начинаете бизнес с нуля. Мы найдем способ сделать их адвокатами вашего бренда."
    },
    {
      id: 'biz_q4',
      title: "Ваш текущий оборот?",
      options: [
        { text: "До 300 000 ₽", value: "low" },
        { text: "300к — 1 млн ₽", value: "mid" },
        { text: "Свыше 1 млн ₽", value: "high" }
      ],
      insight: "На каждом уровне свои «дыры». До миллиона — это обычно продукт, после — это уже процессы и неиспользованные партнерства."
    }
  ];

  const handleSelect = (val: string) => {
    setAnswers({ ...answers, [questions[step].id]: val });
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
    <div className="bg-brand-charcoal/50 border border-white/5 rounded-[40px] p-8 relative overflow-hidden">
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
          <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-tight">{questions[step].title}</h3>
          <div className="grid gap-3">
            {questions[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-left text-brand-zinc hover:bg-brand-emerald/10 hover:border-brand-emerald/30 transition-all flex items-center justify-between group"
              >
                <span className="font-bold text-sm uppercase tracking-wide group-hover:text-white transition-colors">{opt.text}</span>
                <ChevronRight className="w-5 h-5 text-brand-zinc/20 group-hover:text-brand-emerald transition-all transform group-hover:translate-x-1" />
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
