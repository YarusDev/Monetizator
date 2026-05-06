import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface InsightCardProps {
    insight: string;
    onNext: () => void;
    onBack?: () => void;
    showBack?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onNext, onBack, showBack }) => {
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-brand-obsidian/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-brand-charcoal border border-brand-emerald/30 rounded-[40px] p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col items-center text-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-brand-emerald/20 flex items-center justify-center border border-brand-emerald/30">
                        <Sparkles className="w-10 h-10 text-brand-emerald animate-pulse" />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-brand-emerald font-black text-xs uppercase tracking-[0.3em]">Инсайт монетизатора</h3>
                        <p className="text-white text-xl font-bold leading-relaxed">
                            {insight}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full">
                        {showBack && onBack && (
                            <button 
                                onClick={onBack}
                                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button 
                            onClick={onNext}
                            className="flex-1 h-16 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-brand-emerald/20"
                        >
                            Продолжить
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
