import { Medal } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Expert = ({ block }: { block?: any }) => {
    return (
        <BlockWrapper className="bg-brand-charcoal/50">
            <SectionHeader 
                title={block?.title || "Лидер среды"} 
                subTitle={block?.subtitle || "Автор метода. Профессиональный нетворкер. Лидер деловой среды."} 
            />
            <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-12 group grayscale hover:grayscale-0 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-transparent to-transparent z-10" />
                <img src={block?.content?.image?.startsWith('assets/') ? `/${block.content.image}` : (block?.content?.image || "/assets/PhotoExpert.jpg")} alt="Sergey Osipuk" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute bottom-10 left-10 z-20">
                    <div className="font-mono text-[11px] text-brand-emerald font-black mb-3 uppercase tracking-widest">Founder // Protocol</div>
                    <div className="text-3xl font-black text-white uppercase tracking-tighter leading-none">СЕРГЕЙ ОСИПУК</div>
                </div>
            </div>
            <p className="text-brand-zinc/60 text-lg leading-[1.5] mb-10 font-medium">
                {block?.content?.intro || "Я не теоретик из YouTube. Моя экспертиза — это сплав жесткой бизнес-логики и мастерства коммуникаций:"}
            </p>
            <div className="space-y-6 mb-12">
                {(block?.content?.achievements || []).map((achievement: any, index: number) => {
                    const title = typeof achievement === 'object' ? achievement.title : achievement.split(':')[0];
                    const desc = typeof achievement === 'object' ? achievement.desc : achievement.split(':').slice(1).join(':').trim();
                    return (
                        <div key={index} className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 flex items-center justify-center shrink-0">
                                <Medal className="w-6 h-6 text-brand-emerald" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h4 className="font-display font-black text-white text-sm uppercase tracking-wider">{title}:</h4>
                                <p className="text-brand-zinc/70 text-sm leading-relaxed text-left">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {block?.content?.stats && (
                <div className="grid grid-cols-1 gap-4 mb-12">
                    {block.content.stats.map((stat: any, i: number) => (
                        <div key={i} className="p-6 rounded-3xl bg-brand-emerald/5 border border-brand-emerald/10 flex flex-col gap-1 items-center text-center">
                            <div className="text-2xl font-black text-brand-emerald uppercase tracking-tighter">{stat.value}</div>
                            <div className="text-[10px] text-brand-zinc/50 font-black uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}
            {block?.content?.description && (
                <p className="text-brand-zinc/50 text-sm italic mb-12 text-center">
                    {block.content.description}
                </p>
            )}
            <button
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all"
            >
                Посмотреть кейсы в цифрах
            </button>
        </BlockWrapper>
    );
};