import { DynamicIcon } from '../ui/DynamicIcon';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const AntiTarget = ({ block }: { block?: any }) => {
    return (
        <BlockWrapper id="anti_target" className="bg-red-500/[0.02] border-y border-red-500/10">
            <SectionHeader 
                title={block?.title || "С кем мы не сработаемся"} 
                subTitle={block?.subtitle || "Я ценю свое время и ваш результат. Поэтому я работаю не со всеми."} 
            />
            <div className="space-y-6">
                {(block?.content?.items || []).map((item: any, i: number) => {
                    const title = item.title || item.split?.(':')?.[0] || "";
                    const desc = item.description || item.split?.(':')?.[1] || "";
                    const iconName = item.icon || "AlertTriangle";
                    
                    return (
                        <div key={i} className="flex gap-6 p-8 rounded-[40px] bg-red-500/[0.03] border border-red-500/10 group">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                <DynamicIcon name={iconName} className="w-7 h-7 text-red-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{title}</h4>
                                <p className="text-brand-zinc/50 text-base leading-relaxed font-medium">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </BlockWrapper>
    );
};