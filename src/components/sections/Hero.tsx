import { motion } from 'motion/react';
import { Check, ArrowDown, MessageCircle } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SpinningCoin } from '../ui/SpinningCoin';
import { ScrollRouteLine } from '../ui/ScrollRouteLine';
import { Quiz } from './Quiz';

export const Hero = ({ 
  quizCompleted, 
  quizData, 
  userName, 
  setUserName, 
  handleQuizComplete, 
  handleFinalSubmit, 
  isSubmitting 
}: any) => {
  return (
    <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            {/* Spinning Coin Section */}
            <SpinningCoin className="mb-10" />

            <h1 className="text-[2.6rem] font-display font-black leading-[1.05] mb-12 tracking-tighter text-white uppercase">
                Ваш бизнес уже <span className="text-brand-emerald">заработал</span> больше, чем вы видите на счету.
            </h1>

            {!quizCompleted ? (
                <div className="space-y-12">
                    <div className="space-y-6">
                        <p className="text-white font-black text-2xl leading-tight uppercase tracking-tighter">Пора активировать скрытые ресурсы.</p>
                        <p className="text-brand-zinc/50 text-lg leading-[1.4] font-medium">
                            Помогаю находить дополнительную прибыль в базе, связях и продуктах без лишних затрат на рекламу.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            "+380 000 ₽ за 3 дня — результат на своих ресурсах",
                            "15 из 17 человек находят деньги в 1-й день",
                            "15 заявок в день с 0 вложений в рекламу"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-5 text-lg font-bold text-white/90">
                                <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20">
                                    <Check className="w-5 h-5 text-brand-emerald" />
                                </div>
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
                    >
                        НАЙТИ МОИ ТОЧКИ РОСТА
                        <ArrowDown className="w-6 h-6 animate-bounce" />
                    </button>
                    <p className="text-[11px] text-brand-zinc/40 text-center italic uppercase font-black tracking-widest leading-relaxed">
                        Бесплатный экспресс-разбор ваших ресурсов за 30 минут по методу Монетизатора
                    </p>

                    <div id="quiz-anchor" className="pt-24 space-y-10">
                        <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                            <img src="assets/Квиз.jpg" alt="Start Quiz" className="w-full h-auto" />
                        </div>

                        <p className="text-xl text-center font-medium text-brand-zinc/70 leading-relaxed">
                            Ответьте на <span className="text-white font-black">5 вопросов</span> и получите <span className="text-brand-emerald font-black">персональную</span> карту из <span className="text-white font-black">3-х точек роста</span>
                        </p>
                        <Quiz onComplete={handleQuizComplete} />
                    </div>
                </div>
            ) : (
                <motion.div id="quiz-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-10">
                    <div className="p-10 rounded-[50px] bg-brand-emerald/10 border border-brand-emerald/30 shadow-2xl">
                        <h3 className="text-3xl font-black text-white mb-6 uppercase leading-[1.1] tracking-tighter">Анализ завершен!</h3>
                        <p className="text-lg text-brand-zinc/70 leading-relaxed mb-8">
                            Ваш персональный план активации прибыли готов.
                            На основе ваших ответов мы определили, что ваш главный «спящий» актив — <span className="text-brand-emerald font-black text-xl">{quizData?.[1]?.split('(')[0].trim() || 'Ваши ресурсы'}</span>.
                        </p>
                        <p className="text-base text-brand-zinc/50 leading-relaxed mb-10 italic font-medium">
                            Я уже подготовил инструкции по его монетизации. Подтвердите имя, чтобы забрать их в Telegram:
                        </p>
                        <input
                            type="text" placeholder="Как вас зовут?" value={userName} onChange={(e) => setUserName(e.target.value)}
                            className="w-full h-16 px-8 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-emerald outline-none transition-all text-white text-lg mb-8"
                        />
                        <button
                            onClick={handleFinalSubmit} disabled={isSubmitting || !userName.trim()}
                            className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-brand-emerald/40 disabled:opacity-50"
                        >
                            {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕЗУЛЬТАТ В TELEGRAM'}
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <p className="text-[11px] text-brand-zinc/40 mt-8 text-center uppercase font-black tracking-widest leading-relaxed">
                            + Карта из 3-х точек роста и слот на диагностику внутри
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    </BlockWrapper>
  );
};