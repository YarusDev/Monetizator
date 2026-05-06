export const Footer = () => {
    return (
        <footer className="py-16 px-8 bg-black/40 border-t border-white/5 relative overflow-hidden">
            <div className="flex flex-col items-center gap-12 max-w-[460px] mx-auto">
                
                {/* Legal Section */}
                <div className="flex flex-col items-center gap-6 w-full opacity-30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-white font-black">ИП ОСИПУК С.В.</div>
                        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-brand-zinc">ИНН: 780436856525 // ОГРНИП: 323784700143891</div>
                    </div>

                    <div className="flex gap-8">
                        <a href="#" className="font-mono text-[8px] uppercase tracking-widest hover:text-brand-emerald transition-colors">Политика конфиденциальности</a>
                        <a href="#" className="font-mono text-[8px] uppercase tracking-widest hover:text-brand-emerald transition-colors">Договор оферты</a>
                    </div>

                    <div className="font-mono text-[8px] uppercase tracking-[0.6em] text-center font-black">
                        MONETIZATOR // 2026 © Все права защищены
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full p-8 rounded-[30px] bg-white/[0.02] border border-white/5 mt-4">
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src="assets/logoyarusdev.png" 
                            alt="Yarusdev" 
                            className="h-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000" 
                            style={{ animation: 'softPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                        />
                        <style>{`
                            @keyframes softPulse {
                                0%, 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(255,255,255,0.4)); }
                                50% { opacity: 0.7; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
                            }
                        `}</style>
                        <p className="text-[10px] font-black text-brand-zinc/30 uppercase tracking-[0.3em]">Сделано Yarusdev</p>
                    </div>
                    <a 
                        href="https://t.me/BelskiyAndrey?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%AF%20%D0%BE%D1%82%20%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D1%8F%20%D0%9E%D1%81%D0%B8%D0%BF%D1%83%D0%BA%D0%B0.%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%81%D0%B0%D0%B9%D1%82%20%D1%81%D0%BE%20%D1%81%D0%BA%D0%B8%D0%B4%D0%BA%D0%BE%D0%B9%2050%25%20%D0%BF%D0%BE%20%D0%BF%D1%80%D0%BE%D0%BC%D0%BE%D0%BA%D0%BE%D0%B4%D1%83%20%D0%A1%D0%95%D0%A0%D0%93%D0%95%D0%99"
                        className="px-8 py-4 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-[10px] text-brand-emerald font-black uppercase tracking-widest hover:bg-brand-emerald hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        Хочу такой сайт со скидкой 50%
                    </a>
                </div>

            </div>
        </footer>
    );
};