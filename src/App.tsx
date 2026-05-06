import { useState } from 'react';
import { leadService } from './lib/leadService';
import { ScrollRouteLine } from './components/ui/ScrollRouteLine';
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

export default function App() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

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
    <div className="min-h-screen bg-brand-obsidian text-brand-zinc font-sans selection:bg-brand-emerald selection:text-black relative">

      {/* Red Route Line Background */}
      <ScrollRouteLine />

      <div className="max-w-[460px] mx-auto min-h-screen bg-brand-obsidian/80 shadow-2xl relative border-x border-white/5 backdrop-blur-sm">

        {/* Блок 1: Главный экран + Квиз */}
        <Hero 
          quizCompleted={quizCompleted}
          quizData={quizData}
          userName={userName}
          setUserName={setUserName}
          handleQuizComplete={handleQuizComplete}
          handleFinalSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />

        {/* Блок 2: Лидер среды (Об авторе) */}
        <Expert />

        {/* Блок 3: Твердые результаты (Кейсы) */}
        <Cases />

        {/* Блок 4: Манифест */}
        <Manifesto />

        {/* Блок 6: С кем мы не сработаемся (Анти-цели) */}
        <AntiTarget />

        {/* Блок 5: Метод 7 источников */}
        <Method />

        {/* Доп блок: Калькулятор */}
        <Calculator />

        {/* Блоки 7-9: Услуги */}
        <Services />

        {/* Блок 10: Подарок (Призыв к действию) */}
        <Gift />

        {/* Блок 11: Контакты (Футер) */}
        <Footer />

      </div>
    </div>
  );
}
