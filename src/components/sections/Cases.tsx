import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { supabase } from '../../lib/supabase';

interface Case {
    id: string;
    title: string;
    student_name: string;
    metrics: string;
    header: string;
    sub: string;
    problem: string;
    action: string;
    mechanics: string;
    description: string;
    is_active: boolean;
    sphere?: string;
    niche?: string;
    case_number?: number;
}

export const Cases = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    const [activeCase, setActiveCase] = useState<string | null>(null);
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            const { data } = await supabase
                .from('m_cases')
                .select('*')
                .eq('is_active', true)
                .order('case_number', { ascending: true });
            
            if (data) setCases(data);
            setLoading(false);
        };
        fetchCases();
    }, []);

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-emerald" />
        </div>
    );

    if (cases.length === 0) return null;

    return (
        <BlockWrapper id="cases">
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || ""} 
            />
            <div className="space-y-6">
                {cases.map((c) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card overflow-hidden group border-white/10">
                        <div className="p-8 cursor-pointer" onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}>
                            <div className="flex justify-between items-start mb-5">
                                <div className="space-y-1">
                                    <div className="font-mono text-[11px] text-brand-emerald uppercase tracking-widest font-black">
                                        {c.sphere}
                                    </div>
                                    {c.niche && (
                                        <div className="text-[9px] text-brand-zinc/40 uppercase tracking-[0.2em] font-medium">
                                            Ниша: {c.niche}
                                        </div>
                                    )}
                                </div>
                                <div className={`transition-transform duration-300 ${activeCase === c.id ? 'rotate-180' : ''}`}>
                                    <ChevronRight className="w-5 h-5 text-brand-zinc/30" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tighter group-hover:text-brand-gold transition-colors uppercase leading-[1.1]">{c.header}</h3>
                            <div className="mb-6">
                                <p className="text-brand-zinc/50 text-sm font-medium">{c.sub}</p>
                            </div>
                            <div className="text-[11px] font-black text-brand-emerald uppercase tracking-widest border-t border-white/5 pt-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> {c.metrics}
                            </div>
                        </div>

                        <AnimatePresence>
                            {activeCase === c.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white/[0.02] border-t border-white/5">
                                    <div className="p-8 space-y-8">
                                        <div>
                                            <div className="text-[10px] font-black text-brand-zinc/40 uppercase tracking-widest mb-3">Проблема</div>
                                            <p className="text-base text-brand-zinc/70 leading-relaxed font-medium">{c.problem}</p>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-brand-zinc/40 uppercase tracking-widest mb-3">Что сделано</div>
                                            <p className="text-base text-brand-zinc/70 leading-relaxed font-medium">{c.action}</p>
                                        </div>
                                        {c.mechanics && (
                                            <div>
                                                <div className="text-[10px] font-black text-brand-zinc/40 uppercase tracking-widest mb-3">Механика</div>
                                                <p className="text-base text-brand-zinc/70 leading-relaxed font-medium">{c.mechanics}</p>
                                            </div>
                                        )}
                                        <div className="p-6 rounded-3xl bg-brand-emerald/5 border border-brand-emerald/10">
                                            <div className="text-[10px] font-black text-brand-emerald uppercase tracking-widest mb-2">Результат</div>
                                            <p className="text-base text-brand-zinc/80 leading-relaxed font-bold">{c.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </BlockWrapper>
    );
};