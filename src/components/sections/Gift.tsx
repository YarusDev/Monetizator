import { MessageCircle } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { DynamicIcon } from '../ui/DynamicIcon';

export const Gift = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    
    return (
        <BlockWrapper id="gift">
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || ""} 
            />
            <div className="p-10 rounded-[50px] border border-brand-emerald/20 text-center relative overflow-hidden bg-brand-obsidian shadow-2xl">
                <div className="space-y-10 text-center mb-12">
                    {content.badge && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[10px] font-black uppercase tracking-widest animate-pulse mx-auto">
                            <DynamicIcon name="Sparkles" className="w-3 h-3" />
                            {content.badge}
                        </div>
                    )}
                    
                    {content.description && (
                        <p className="text-brand-zinc/60 text-lg max-w-xl mx-auto font-medium">
                            {content.description}
                        </p>
                    )}

                    {content.image && (
                        <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl mb-8 relative">
                            <img 
                                src={content.image?.startsWith('assets/') ? `/${content.image}` : content.image} 
                                alt="Gift" 
                                className="w-full h-auto opacity-90" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent" />
                        </div>
                    )}

                    {content.items && content.items.length > 0 && (
                        <div className="p-8 rounded-[40px] bg-brand-emerald/10 border border-brand-emerald/20 shadow-inner">
                            <div className="space-y-4">
                                {content.items.map((item: any, i: number) => {
                                    const itemText = typeof item === 'string' ? item : item.text;
                                    const itemIcon = typeof item === 'object' ? item.icon : 'CheckCircle2';

                                    return (
                                        <div key={i} className="flex items-center gap-4 text-white font-bold text-left">
                                            <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20">
                                                <DynamicIcon name={itemIcon} className="w-4 h-4 text-brand-emerald" />
                                            </div>
                                            <span>{itemText}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {content.footer && (
                        <p className="text-brand-zinc/50 text-sm leading-relaxed font-medium italic">
                            {content.footer}
                        </p>
                    )}

                    {content.attention && (
                        <p className="text-red-500 text-[10px] uppercase font-black tracking-widest leading-relaxed">
                            {content.attention}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => window.location.href = 'https://t.me/monetizator_osipuk'}
                    className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/30"
                >
                    {content.button_text || "ДЕЙСТВИЕ"}
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </BlockWrapper>
    );
};