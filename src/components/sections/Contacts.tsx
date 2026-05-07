import { BlockWrapper } from '../ui/BlockWrapper';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SectionHeader } from '../ui/SectionHeader';
import { SpinningCoin } from '../ui/SpinningCoin';
import { useContacts } from '../../hooks/useContacts';

export const Contacts = ({ block }: { block?: any }) => {
    const { contacts: globalContacts, loading } = useContacts();
    const content = block?.content || {};
    const links = content.links || [];

    // Format URL based on type (Smart Recognition)
    const formatHref = (value: string, type: string) => {
        if (!value) return '#';
        if (type === 'phone' || value.match(/^(\+7|8|7)\d{10}$/)) {
            const cleanPhone = value.replace(/\D/g, '');
            return `tel:+${cleanPhone}`;
        }
        if (type === 'email' || value.includes('@')) {
            return `mailto:${value}`;
        }
        if (value.startsWith('http')) return value;
        if (value.startsWith('t.me/')) return `https://${value}`;
        if (value.startsWith('@')) return `https://t.me/${value.substring(1)}`;
        return value;
    };

    if (loading) return null;

    // Filter and sort links based on block settings
    const activeLinks = links
        .map((l: any) => {
            const global = globalContacts.find(gc => gc.id === l.contact_id);
            if (global) return { ...global, ...l };
            return null;
        })
        .filter((c: any) => c && c.value && c.is_active && c.is_visible !== false);

    return (
        <BlockWrapper id="contacts" className="py-24 px-8 border-t border-white/5 bg-black/20 relative overflow-hidden">
            <SpinningCoin className="mb-16" size="w-32 h-32" />
            <SectionHeader 
                title={content.title || "СВЯЗАТЬСЯ СО МНОЙ"} 
                subTitle={content.cta_text || "ВЫБЕРИТЕ УДОБНЫЙ СПОСОБ СВЯЗИ"} 
            />

            <div className="grid gap-4 max-w-2xl mx-auto">
                {activeLinks.length > 0 ? (
                    activeLinks.map((link: any, i: number) => {
                        const href = formatHref(link.value || link.url, link.type);
                        const isPhone = href.startsWith('tel:');
                        const isEmail = href.startsWith('mailto:');

                        return (
                            <a
                                key={i}
                                href={href}
                                target={isPhone || isEmail ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 group transition-all hover:bg-white/[0.06]"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 border border-brand-emerald/20 group-hover:scale-110 transition-transform">
                                    <DynamicIcon name={link.icon || 'Link'} className="w-7 h-7 text-brand-emerald" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-brand-emerald font-black uppercase tracking-[0.2em] mb-1">
                                        {link.label?.toUpperCase() || 'CONTACT'}
                                    </div>
                                    <div className="font-display font-black text-white text-xl leading-none">
                                        {(link.value || link.url || '').replace(/^https?:\/\//, '').replace('t.me/', '@').replace('mailto:', '')}
                                    </div>
                                </div>
                            </a>
                        );
                    })
                ) : (
                    <a 
                        href="/admin/cms?tab=contacts"
                        className="p-12 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-4 group hover:border-brand-emerald/30 transition-all"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald group-hover:scale-110 transition-transform">
                            <DynamicIcon name="Plus" className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-black text-white uppercase tracking-widest mb-1">Заполнить контакты</div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Добавьте способы связи в панели управления</p>
                        </div>
                    </a>
                )}
            </div>
        </BlockWrapper>
    );
};
