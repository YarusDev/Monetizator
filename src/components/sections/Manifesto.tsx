import { X } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Manifesto = () => {
    return (
        <BlockWrapper className="bg-brand-emerald/[0.02]">
            <SectionHeader title="Реклама не исправляет хаос — она его усиливает." align="center" />
            <div className="space-y-12 max-w-[400px] mx-auto">
                <p className="text-brand-zinc/60 text-lg leading-relaxed text-center font-medium">
                    Большинство маркетологов совершают преступление против вашего кошелька: они советуют «долить трафика» в систему, которая дырява как решето.
                </p>

                <div className="space-y-6">
                    {[
                        "Если ваша база не разобрана — вы теряете 70% прибыли.",
                        "Если вы продаете «в лоб» без входного продукта — вы переплачиваете за клиента в 5 раз.",
                        "Если нетворкинг для вас — это спам визитками, вы живете в иллюзии связей."
                    ].map((text, i) => (
                        <div key={i} className="flex gap-5 items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                <X className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-lg text-brand-zinc/80 font-bold leading-tight">{text}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full h-18 bg-brand-emerald text-brand-obsidian rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-brand-emerald/20"
                >
                    Где именно лежат мои деньги?
                </button>
            </div>
        </BlockWrapper>
    );
};