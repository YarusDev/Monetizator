import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';

export const MenuPopup = ({ isOpen, onClose, config }: { isOpen: boolean; onClose: () => void; config?: any }) => {
    const { contacts: globalContacts } = useContacts();
    const items = config?.navigation || [];
    const headerContacts = config?.contacts || [];

    const renderIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
        return <IconComponent size={20} />;
    };

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

    const activeContacts = headerContacts
        .map((l: any) => {
            const global = globalContacts.find(gc => gc.id === l.contact_id);
            if (global) return { ...global, ...l };
            return null;
        })
        .filter((c: any) => c && c.value && c.is_active && c.is_visible !== false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[1000] bg-[#050505] flex flex-col w-full max-w-[460px] left-1/2 -translate-x-1/2 border-x border-white/5"
                >
                    {/* Scrollable Content with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-[100px] pb-12">
                        <div className="max-w-[460px] mx-auto px-6">
                            <nav className="flex flex-col gap-3">
                                {items.map((item: any, index: number) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => {
                                            const anchor = item.anchor || item.id;
                                            const targetId = anchor?.startsWith('#') ? anchor.substring(1) : anchor;
                                            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                                            onClose();
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="w-full p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-emerald/30 hover:bg-brand-emerald/5 transition-all group flex items-center gap-6"
                                    >
                                        <span className="font-mono text-[10px] text-brand-emerald font-black opacity-40 group-hover:opacity-100 transition-opacity">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-xl font-display font-black text-white uppercase tracking-tight group-hover:text-brand-emerald transition-colors">
                                            {item.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </nav>

                            {/* Contact Links in Menu */}
                            <div className="mt-16 pt-10 border-t border-white/5 flex flex-col gap-4">
                                {activeContacts.length > 0 ? (
                                    activeContacts.map((contact: any, i: number) => {
                                        const href = formatHref(contact.value || contact.url, contact.type);
                                        const isPhone = href.startsWith('tel:');
                                        const isEmail = href.startsWith('mailto:');

                                        return (
                                            <a 
                                                key={i}
                                                href={href} 
                                                target={isPhone || isEmail ? "_self" : "_blank"} 
                                                rel="noopener noreferrer"
                                                className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-5 hover:bg-white/5 transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald group-hover:scale-110 transition-transform">
                                                    {renderIcon(contact.icon)}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.1em]">{contact.label}</span>
                                                    <span className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[200px]">
                                                        {(contact.value || contact.url || '').replace(/^https?:\/\//, '').replace('t.me/', '@').replace('mailto:', '')}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })
                                ) : (
                                    <a 
                                        href="/admin/cms?tab=contacts"
                                        className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-3 group hover:border-brand-emerald/30 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-emerald">
                                            <Icons.Plus size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Заполнить контакты</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(255, 255, 255, 0.02);
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #10b981;
                            border-radius: 10px;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
