import { SpinningCoin } from '../ui/SpinningCoin';
import { SectionHeader } from '../ui/SectionHeader';
import { BlockWrapper } from '../ui/BlockWrapper';
import { DynamicIcon } from '../ui/DynamicIcon';

export const Contacts = ({ block }: { block?: any }) => {
    const contactItems = block?.content?.items || [
        { label: "Написать лично", value: "@monetizator_osipuk", icon: "MessageCircle", link: "https://t.me/monetizator_osipuk" },
        { label: "Telegram Канал", value: "Зайти в канал", icon: "Send", link: "https://t.me/+P3O1S_T2vR80NmIy" },
        { label: "WhatsApp", value: "Написать в WhatsApp", icon: "Share2", link: "https://wa.me/79219001331" }
    ];

    return (
        <BlockWrapper id="contacts" className="py-24 px-8 border-t border-white/5 bg-black/20 relative">
            <SpinningCoin className="mb-16" size="w-32 h-32" />
            <SectionHeader 
                title={block?.title || "Перестаньте искать деньги далеко."} 
                subTitle={block?.subtitle || "Давайте найдем их у вас под ногами."} 
            />

            <div className="grid gap-5">
                {contactItems.map((item: any, i: number) => (
                    <a 
                        key={i} 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                            <DynamicIcon name={item.icon || 'MessageCircle'} className="w-8 h-8 text-brand-emerald" />
                        </div>
                        <div>
                            <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">{item.label}</div>
                            <div className="font-black text-white text-lg leading-none">{item.value}</div>
                        </div>
                    </a>
                ))}
            </div>
        </BlockWrapper>
    );
};
