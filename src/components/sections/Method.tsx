import { DynamicIcon } from '../ui/DynamicIcon';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Method = ({ block }: { block?: any }) => {
    return (
        <BlockWrapper id="method">
            <SectionHeader title={block?.title || "Я сканирую ваш проект через 7 «линз» прибыли."} subTitle={block?.subtitle || "Деньги в 99% случаев не «приходят» из новой рекламы, а «просыпаются» внутри системы."} />
            <div className="grid gap-4">
                {(block?.content?.items || []).map((item: any, i: number) => {
                    const title = item.title || item.split?.(':')?.[0] || "";
                    const desc = item.description || item.split?.(':')?.[1] || "";
                    const iconName = item.icon || "Target";
                    
                    return (
                        <div key={i} className="flex gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-emerald/20">
                                <DynamicIcon name={iconName} className="w-8 h-8 text-brand-emerald" />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{i + 1}. {title}</h4>
                                <p className="text-brand-zinc/50 text-base leading-relaxed font-medium">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => document.getElementById('calc-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-18 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 mt-12 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
            >
                Просканировать мой бизнес
            </button>
            <div id="calc-anchor" />
        </BlockWrapper>
    );
};