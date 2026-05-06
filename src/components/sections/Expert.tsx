import { Award, Users, TrendingUp } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Expert = () => {
    return (
        <BlockWrapper className="bg-brand-charcoal/50">
            <SectionHeader title="Лидер среды" subTitle="Автор метода. Профессиональный нетворкер. Лидер деловой среды." />
            <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-12 group grayscale hover:grayscale-0 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent z-10" />
                <img src="assets/PhotoExpert.jpg" alt="Sergey Osipuk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-10 left-10 z-20">
                    <div className="font-mono text-[11px] text-brand-emerald font-black mb-3 uppercase tracking-widest">Founder // Protocol</div>
                    <div className="text-3xl font-black text-white uppercase tracking-tighter leading-none">СЕРГЕЙ ОСИПУК</div>
                </div>
            </div>
            <p className="text-brand-zinc/60 text-lg leading-[1.5] mb-10 font-medium">
                Я не теоретик из YouTube. Моя экспертиза — это сплав жесткой бизнес-логики и мастерства коммуникаций:
            </p>
            <div className="space-y-6 mb-12">
                {[
                    { i: Award, t: "Дипломированный монетизатор:", d: "выпускник школы нестандартного мышления Владислава Бермуды." },
                    { i: Users, t: "Профессиональный нетворкер:", d: "эксперт Первой школы профессионального нетворинга Екатерины Косенко." },
                    { i: TrendingUp, t: "Результат на своих ресурсах:", d: "+380 000 ₽ всего за 3 дня." },
                    { i: TrendingUp, t: "Скорость активации:", d: "15 из 17 человек находят деньги уже в 1-й день." },
                    { i: TrendingUp, t: "Эффективность:", d: "15 заявок в день при 0 вложений в рекламу." },
                    { i: TrendingUp, t: "Масштаб:", d: "Через мои форматы прошли 200+ предпринимателей и экспертов." }
                ].map((item, index) => (
                    <div key={index} className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 flex items-center justify-center shrink-0">
                            <item.i className="w-6 h-6 text-brand-emerald" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <h4 className="font-display font-black text-white text-sm uppercase tracking-wider">{item.t}</h4>
                            <p className="text-brand-zinc/70 text-sm leading-relaxed text-left">{item.d}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all"
            >
                Посмотреть кейсы в цифрах
            </button>
        </BlockWrapper>
    );
};