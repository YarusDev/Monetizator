import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Share2 } from 'lucide-react';

interface MenuPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MenuPopup = ({ isOpen, onClose }: MenuPopupProps) => {
    const menuItems = [
        { label: 'Главная', id: 'home' },
        { label: 'Об авторе', id: 'expert' },
        { label: 'Кейсы', id: 'cases' },
        { label: 'Манифест', id: 'manifesto' },
        { label: 'Анти-цели', id: 'antitarget' },
        { label: 'Метод', id: 'method' },
        { label: 'Калькулятор', id: 'calculator' },
        { label: 'Услуги', id: 'services' },
        { label: 'Подарок', id: 'gift' },
        { label: 'Контакты', id: 'contacts' },
    ];

    const handleScroll = (id: string) => {
        onClose();
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-brand-obsidian/95 backdrop-blur-xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-[0_0_12px_#10b981]" />
                            <span className="font-mono text-[11px] text-brand-emerald uppercase tracking-[0.4em] font-black">МЕНЮ</span>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar">
                        <div className="space-y-2 mb-16">
                            {menuItems.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleScroll(item.id)}
                                    className="w-full text-left py-4 text-2xl font-display font-black text-white uppercase tracking-tighter hover:text-brand-emerald transition-colors flex items-center justify-between group"
                                >
                                    {item.label}
                                    <div className="h-px flex-1 bg-white/5 mx-4 group-hover:bg-brand-emerald/20 transition-colors" />
                                    <span className="font-mono text-[10px] text-brand-zinc/30">0{i + 1}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Contacts Duplicate */}
                        <div className="space-y-6">
                            <div className="font-mono text-[10px] text-brand-emerald font-black uppercase tracking-widest opacity-50">Контакты</div>
                            <div className="grid gap-4">
                                <a href="https://t.me/monetizator_osipuk" className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <MessageCircle className="w-5 h-5 text-brand-emerald" />
                                    <span className="font-bold text-white uppercase tracking-wider text-xs">@monetizator_osipuk</span>
                                </a>
                                <a href="https://wa.me/79219001331" className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                                    <Share2 className="w-5 h-5 text-brand-emerald" />
                                    <span className="font-bold text-white uppercase tracking-wider text-xs">WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer in Menu */}
                    <div className="p-8 border-t border-white/5 opacity-30">
                        <div className="font-mono text-[9px] uppercase tracking-[0.6em] text-center font-black">MONETIZATOR // 2026</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
