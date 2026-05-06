import { motion, AnimatePresence } from 'motion/react';

export const MenuPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const menuItems = [
        { label: 'Главная', id: 'home' },
        { label: 'Об экспертизе', id: 'expert' },
        { label: 'Кейсы с цифрами', id: 'cases' },
        { label: 'Чем отличаюсь', id: 'manifesto' },
        { label: 'С кем не сработаемся', id: 'antitarget' },
        { label: 'Мой метод', id: 'method' },
        { label: 'Калькулятор прибыли', id: 'calculator' },
        { label: 'Услуги и цены', id: 'services' },
        { label: 'Спецпредложение', id: 'gift' },

        { label: 'Контакты', id: 'contacts' },

    ];



    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-y-0 left-1/2 -translate-x-1/2 z-[1000] bg-[#050505] flex flex-col w-full max-w-[460px] border-x border-white/5"
                >
                    {/* Scrollable Content with Custom Scrollbar */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-[100px] pb-12">
                        <div className="max-w-[460px] mx-auto px-6">
                            <nav className="flex flex-col gap-3">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={item.label}
                                        onClick={() => {
                                            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
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
                            <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                                <a href="https://t.me/osipuk_s" target="_blank" className="h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-brand-zinc hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                                    Telegram
                                </a>
                                <a href="https://wa.me/79000000000" target="_blank" className="h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-brand-zinc hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                                    WhatsApp
                                </a>
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
