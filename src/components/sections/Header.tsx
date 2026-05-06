import { useState } from 'react';
import { MenuPopup } from '../ui/MenuPopup';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-[150] w-full px-6 py-4 bg-brand-obsidian/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex justify-between items-center max-w-[460px] mx-auto">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-emerald/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <img src="assets/LogoCoin.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-display font-black text-white uppercase tracking-tighter leading-none">МОНЕТИЗАТОР</span>
                        <span className="font-mono text-[7px] text-brand-emerald uppercase tracking-[0.3em] font-black opacity-70">Protocol v2.4</span>
                    </div>
                </div>

                {/* Hamburger Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all"
                >
                    <div className="w-5 h-0.5 bg-brand-emerald rounded-full group-hover:w-6 transition-all" />
                    <div className="w-5 h-0.5 bg-brand-emerald rounded-full" />
                    <div className="w-3 h-0.5 bg-brand-emerald rounded-full self-start ml-3 group-hover:w-5 transition-all" />
                </button>
            </div>

            {/* Reuse the Popup Menu logic */}
            <MenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
};
