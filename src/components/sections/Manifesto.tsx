import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { DynamicIcon } from '../ui/DynamicIcon';

export const Manifesto = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    
    return (
        <BlockWrapper id="manifesto">
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || ""} 
                align="center" 
            />
            <div className="space-y-12 max-w-2xl mx-auto">
                <div className="space-y-6">
                    {(content.items || []).map((item: any, i: number) => {
                        const title = item.title || (typeof item === 'string' ? item.split?.(':')?.[0] : "");
                        const text = item.text || (typeof item === 'string' ? item.split?.(':')?.[1] : item.text);
                        const icon = item.icon || 'ScrollText';

                        return (
                            <div key={i} className="flex gap-6 items-center p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group shadow-2xl shadow-black/20">
                                <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-brand-red">
                                    <DynamicIcon name={icon} className="w-7 h-7" />
                                </div>
                                <div className="flex flex-col gap-1 text-left">
                                    {title && <h4 className="font-display font-black text-white text-lg uppercase tracking-tight leading-tight">{title}:</h4>}
                                    <p className="text-brand-zinc/70 text-base leading-relaxed font-medium">{text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {content.footer && (
                    <div className="text-center space-y-4 px-6">
                        <div className="h-px w-12 bg-brand-red/30 mx-auto" />
                        <p className="text-brand-zinc/50 text-sm italic font-medium leading-relaxed">
                            {content.footer}
                        </p>
                    </div>
                )}

                <div className="px-6 pb-4">
                    <button
                        onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/20"
                    >
                        {content.button_text || "ДЕЙСТВИЕ"}
                    </button>
                </div>
            </div>
        </BlockWrapper>
    );
};