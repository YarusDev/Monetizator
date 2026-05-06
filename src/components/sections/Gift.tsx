import React from 'react';
import { Rocket, MessageCircle } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';

export const Gift = () => {
    return (
        <BlockWrapper className="bg-brand-emerald/[0.05]">
            <div className="p-10 rounded-[50px] border border-brand-emerald/20 text-center relative overflow-hidden bg-brand-obsidian shadow-2xl">
                <div className="absolute top-0 right-0 p-8">
                    <Rocket className="w-12 h-12 text-brand-emerald opacity-20" />
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-white font-display font-black text-3xl mb-6 tracking-tighter uppercase leading-[1.1]">
                        Давайте найдем ваши деньги вместе. Бесплатно.
                    </h2>
                </div>

                <div className="space-y-10 text-center mb-12">
                    <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-8 relative">
                        <img src="assets/Квиз.jpg" alt="Map" className="w-full h-auto opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent" />
                    </div>

                    <p className="text-brand-zinc/60 text-lg leading-relaxed font-medium">
                        Я предлагаю вам не слова, а тест-драйв моего метода.
                    </p>

                    <div className="p-8 rounded-[40px] bg-brand-emerald/10 border border-brand-emerald/20 shadow-inner">
                        <h4 className="font-black text-white text-xl mb-3 uppercase tracking-tight leading-tight">Экспресс-диагностика</h4>
                        <p className="text-base text-brand-zinc/70 leading-relaxed font-medium italic">Мы просканируем ваш проект за 20-30 минут и подсветим точки роста бесплатно.</p>
                    </div>

                    <p className="text-red-500 text-xs uppercase font-black tracking-widest">Внимание: Беру только 3–5 человек в неделю.</p>
                </div>

                <button
                    onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                    className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
                >
                    Записаться на разбор
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </BlockWrapper>
    );
};