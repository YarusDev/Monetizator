import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowRight } from 'lucide-react';

export const MenuPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const menuItems = [
        { label: 'Главная', id: 'home' },
        { label: 'Об эксперте', id: 'expert' },
        { label: 'Кейсы', id: 'cases' },
        { label: 'Манифест', id: 'manifesto' },
        { label: 'Анти-цели', id: 'antitarget' },
        { label: 'Метод 7 источников', id: 'method' },
        { label: 'Калькулятор', id: 'calculator' },
        { label: 'Услуги', id: 'services' },
        { label: 'Спецпредложение', id: 'gift' },
        { label: 'Контакты', id: 'contacts' },
    ];

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] bg-[#050505] flex flex-col w-screen h-screen left-0 top-0"
                >
                    {/* Header inside Menu */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-black text-brand-emerald uppercase tracking-tighter leading-none mb-1">МЕНЮ</span>
                            <span className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.4em] font-black">НАВИГАЦИЯ</span>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group active:scale-95 transition-all"
                        >
                            <X className="w-6 h-6 text-brand-emerald group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {/* Scrollable Content with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleScroll(item.id)}
                                    className="flex items-center justify-between p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-brand-emerald/10 hover:border-brand-emerald/30 transition-all group text-left"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-mono text-brand-zinc/30 font-black uppercase tracking-[0.2em]">0{index + 1}</span>
                                        <span className="text-xl font-display font-bold text-white uppercase tracking-tight group-hover:text-brand-emerald transition-colors">{item.label}</span>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-brand-zinc/10 group-hover:text-brand-emerald group-hover:translate-x-2 transition-all" />
                                </motion.button>
                            ))}
                        </nav>

                        {/* Contacts in Menu */}
                        <div className="mt-12 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                                    <MessageCircle className="w-6 h-6 text-brand-gold" />
                                </div>
                                <span className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] font-black">Связь напрямую</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <a href="https://t.me/monetizator_osipuk" className="w-full py-4 rounded-xl bg-brand-emerald text-black font-black uppercase text-[10px] tracking-widest text-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">Telegram</a>
                                <a href="https://wa.me/79119252525" className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest text-center">WhatsApp</a>
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
