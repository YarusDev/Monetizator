import { DynamicIcon } from '../ui/DynamicIcon';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const AntiTarget = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    return (
        <BlockWrapper id="anti_target" className="relative bg-brand-red/[0.02] border-y border-white/5 overflow-hidden">
            {/* Subtle red glow default */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-brand-red/[0.05] to-transparent pointer-events-none" />
            
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || ""} 
            />
            <div className="space-y-6 max-w-2xl mx-auto relative z-10">
                {(block?.content?.items || []).map((item: any, i: number) => {
                    const title = item.title || (typeof item === 'string' ? item.split?.(':')?.[0] : "");
                    const desc = item.description || (typeof item === 'string' ? item.split?.(':')?.[1] : "");
                    const iconName = item.icon || "AlertTriangle";
                    
                    return (
                        <div key={i} className="flex gap-6 items-center p-8 rounded-[2.5rem] bg-brand-red/[0.03] border border-brand-red/10 group hover:bg-brand-gold/[0.08] hover:border-brand-gold/30 transition-all shadow-2xl shadow-black/20">
                            <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center shrink-0 border border-brand-red/20 group-hover:scale-110 transition-transform">
                                <DynamicIcon name={iconName} className="w-7 h-7 text-brand-red" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-display font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{title}</h4>
                                <p className="text-brand-zinc/70 text-base leading-relaxed font-medium">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </BlockWrapper>
    );
};