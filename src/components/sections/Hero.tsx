import { motion } from 'motion/react';
import { Check, ArrowDown } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SpinningCoin } from '../ui/SpinningCoin';

export const Hero = ({ block }: any) => {
  const content = block?.content || {};
  
  return (
    <BlockWrapper className="min-h-[90dvh] flex flex-col justify-center pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            {/* Logo Bar */}
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center border border-brand-emerald/20">
                    <img src={content.logo_image || "/assets/LogoCoin.png"} alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-display font-black text-white leading-none tracking-tighter uppercase">
                        {content.logo_text || ""}
                    </span>
                    <span className="text-[9px] font-black text-brand-emerald tracking-[0.3em] uppercase">
                        {content.logo_sub || ""}
                    </span>
                </div>
            </div>

            {/* Spinning Coin Section */}
            <SpinningCoin className="mb-10" />

            <h1 className="text-[2.6rem] font-display font-black leading-[1.05] mb-12 tracking-tighter text-white uppercase">
                {content.title || ""}
            </h1>

            <div className="space-y-12">
                <div className="space-y-6">
                    <p className="text-white font-black text-2xl leading-tight uppercase tracking-tighter">
                        {content.subtitle || ""}
                    </p>
                    <p className="text-brand-zinc/50 text-lg leading-[1.4] font-medium">
                        {content.description || ""}
                    </p>
                </div>

                {content.metrics && content.metrics.length > 0 && (
                    <div className="space-y-6">
                        {content.metrics.map((stat: any, i: number) => (
                            <div key={i} className="flex items-center gap-5 text-lg font-bold text-white/90">
                                <div className="w-8 h-8 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20">
                                    <Check className="w-5 h-5 text-brand-emerald" />
                                </div>
                                <span><span className="text-brand-emerald">{stat.value}</span> {stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
                >
                    {content.button_text || "НАЖМИТЕ ДЛЯ ДЕЙСТВИЯ"}
                    <ArrowDown className="w-6 h-6 animate-bounce" />
                </button>
                {content.footer && (
                    <p className="text-[11px] text-brand-zinc/40 text-center italic uppercase font-black tracking-widest leading-relaxed">
                        {content.footer}
                    </p>
                )}
            </div>
        </motion.div>
    </BlockWrapper>
  );
};