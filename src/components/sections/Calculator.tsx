import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Calculator = ({ block }: { block?: any }) => {
    const [leads, setLeads] = useState(100);
    const [conv, setConv] = useState(5);
    const [avgCheck, setAvgCheck] = useState(50000);
    const [retention, setRetention] = useState(0);

    const currentRevenue = leads * (conv / 100) * avgCheck;
    const potentialConv = conv * 3.5;
    const potentialRetention = currentRevenue * (retention / 100) * 1.5;
    const totalPotential = (leads * (potentialConv / 100) * avgCheck) + potentialRetention - currentRevenue;

    return (
        <BlockWrapper id="calculator">
            <SectionHeader 
                title={block?.title || "Ваши скрытые деньги"} 
                subTitle={block?.subtitle || "Узнайте, сколько прибыли вы 'дарите' конкурентам из-за отсутствия системы."} 
            />

            <div className="space-y-10">
                {/* Sliders Grid */}
                <div className="grid gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
                            <span>База клиентов (чел)</span>
                            <span className="text-white">{leads}</span>
                        </div>
                        <input type="range" min="10" max="10000" step="50" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
                            <span>Конверсия (%)</span>
                            <span className="text-white">{conv}%</span>
                        </div>
                        <input type="range" min="1" max="50" step="0.5" value={conv} onChange={(e) => setConv(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
                            <span>Средний чек (₽)</span>
                            <span className="text-white whitespace-nowrap">{avgCheck.toLocaleString()} ₽</span>
                        </div>
                        <input type="range" min="1000" max="500000" step="1000" value={avgCheck} onChange={(e) => setAvgCheck(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-brand-zinc/40">
                            <span>Повторные продажи (%)</span>
                            <span className="text-white">{retention}%</span>
                        </div>
                        <input type="range" min="0" max="100" step="5" value={retention} onChange={(e) => setRetention(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-emerald" />
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-brand-gold/10 border border-brand-gold/20 relative overflow-hidden group mt-8">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-16 h-16 text-brand-gold" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-xs font-black text-brand-gold uppercase tracking-widest mb-4">Ваш скрытый потенциал в год</div>
                        <div className="text-5xl font-display font-black text-brand-gold mb-3 tracking-tighter whitespace-nowrap leading-none">
                            +{totalPotential.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                        </div>
                        <div className="text-[11px] text-brand-zinc/50 uppercase font-bold tracking-widest">ДОПОЛНИТЕЛЬНО К ТЕКУЩЕЙ ПРИБЫЛИ</div>
                    </div>
                </div>

                <p className="text-[10px] text-brand-zinc/30 leading-relaxed text-center uppercase tracking-widest font-bold">
                    *Расчет произведен на основе потенциала роста показателей до 3.5x после внедрения системы монетизации
                </p>
            </div>
        </BlockWrapper>
    );
};