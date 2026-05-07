import { DynamicIcon } from '../ui/DynamicIcon';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Method = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    const items = content.items || content.methods || [];

    return (
        <BlockWrapper id="method">
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || content.description || ""} 
            />
            <div className="space-y-6 max-w-2xl mx-auto">
                {items.map((item: any, i: number) => {
                    const title = item.title || (typeof item === 'string' ? item.split?.(':')?.[0] : "");
                    const desc = item.description || (typeof item === 'string' ? item.split?.(':')?.[1] : "");
                    const iconName = item.icon || "Target";
                    
                    return (
                        <div key={i} className="flex gap-6 items-center p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all shadow-2xl shadow-black/20">
                            <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20 group-hover:scale-110 transition-transform">
                                <DynamicIcon name={iconName} className="w-7 h-7 text-brand-emerald" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-display font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{i + 1}. {title}</h4>
                                <p className="text-brand-zinc/70 text-base leading-relaxed font-medium">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="max-w-2xl mx-auto mt-12 px-6">
                <button
                    onClick={() => document.getElementById('calc-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full h-20 emerald-gradient text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl shadow-brand-emerald/20"
                >
                    {content.button_text || "ДЕЙСТВИЕ"}
                </button>
            </div>
            <div id="calc-anchor" />
        </BlockWrapper>
    );
};