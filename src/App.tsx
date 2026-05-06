import { useState } from 'react';
import { leadService } from './lib/leadService';
import { Hero } from './components/sections/Hero';
import { Expert } from './components/sections/Expert';
import { Cases } from './components/sections/Cases';
import { Manifesto } from './components/sections/Manifesto';
import { AntiTarget } from './components/sections/AntiTarget';
import { Method } from './components/sections/Method';
import { Calculator } from './components/sections/Calculator';
import { Services } from './components/sections/Services';
import { Gift } from './components/sections/Gift';
import { Footer } from './components/sections/Footer';
import { Header } from './components/sections/Header';
import { Contacts } from './components/sections/Contacts';
import { MenuPopup } from './components/ui/MenuPopup';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeInsight, setActiveInsight] = useState<{ text: string, onNext: () => void } | null>(null);

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setQuizCompleted(true);
    setTimeout(() => {
      document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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
    <div className="min-h-screen bg-brand-obsidian text-white font-sans selection:bg-brand-emerald selection:text-white">
      
      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian/80 shadow-2xl relative border-x border-white/5 backdrop-blur-sm">
        {/* Блок 1: Главный экран + Квиз */}
        <div id="home" className="pt-[100px]">
          <Hero 
            quizCompleted={quizCompleted}
            quizData={quizData}
            userName={userName}
            setUserName={setUserName}
            handleQuizComplete={handleQuizComplete}
            handleFinalSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
            onShowInsight={setActiveInsight}
          />
        </div>

        {/* Блок 2: Лидер среды (Об авторе) */}
        <div id="expert">
          <Expert />
        </div>

        {/* Блок 3: Твердые результаты (Кейсы) */}
        <div id="cases">
          <Cases />
        </div>

        {/* Блок 4: Манифест */}
        <div id="manifesto">
          <Manifesto />
        </div>

        {/* Блок 6: С кем мы не сработаемся (Анти-цели) */}
        <div id="antitarget">
          <AntiTarget />
        </div>

        {/* Блок 5: Метод 7 источников */}
        <div id="method">
          <Method />
        </div>

        {/* Доп блок: Калькулятор */}
        <div id="calculator">
          <Calculator />
        </div>

        {/* Блоки 7-9: Услуги */}
        <div id="services">
          <Services />
        </div>

        {/* Блок 10: Подарок (Призыв к действию) */}
        <div id="gift">
          <Gift />
        </div>

        {/* Блок 11: Контакты */}
        <div id="contacts">
          <Contacts />
        </div>

        {/* Финальный футер */}
        <Footer />
      </div>

      {/* FIXED UI ELEMENTS */}
      <Header 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenMenu={() => setIsMenuOpen(true)} 
      />
      <MenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* GLOBAL INSIGHT MODAL */}
      <AnimatePresence>
        {activeInsight && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-brand-obsidian border border-brand-emerald/30 p-8 rounded-[40px] max-w-[400px] w-full shadow-[0_0_50px_rgba(16,185,129,0.4)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-emerald shadow-[0_0_15px_#10b981]" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-emerald shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0">
                  <img src="assets/PhotoExpertquiz.jpg" alt="Expert" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-widest">Инсайт эксперта</div>
                  <div className="text-white font-display font-black text-lg uppercase tracking-tight">Сергей Осипук</div>
                </div>
              </div>
              <p className="text-brand-zinc text-lg leading-relaxed font-medium mb-10">{activeInsight.text}</p>
              <button 
                onClick={() => {
                  activeInsight.onNext();
                  setActiveInsight(null);
                }}
                className="w-full h-16 rounded-2xl emerald-gradient text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                ПРОДОЛЖИТЬ <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
