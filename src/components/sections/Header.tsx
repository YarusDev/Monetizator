export const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
    return (
        <header className="sticky top-0 z-[500] w-full px-6 py-5 bg-brand-obsidian/95 backdrop-blur-xl border-b border-white/5">
            <div className="flex justify-between items-center max-w-[460px] mx-auto relative">
                
                {/* Logo Section - Left */}
                <div className="flex items-center">
                    <img src="assets/LogoCoin.png" alt="Logo" className="w-14 h-14 object-contain filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                </div>

                {/* Center Text */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xl font-display font-black text-brand-emerald uppercase tracking-tighter leading-none mb-1">МОНЕТИЗАТОР</span>
                    <span className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.4em] font-black">СЕРГЕЙ ОСИПУК</span>
                </div>

                {/* Hamburger Menu Button - Right */}
                <button 
                    onClick={onOpenMenu}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 group active:scale-95 transition-all"
                >
                    <div className="w-5 h-0.5 bg-brand-emerald rounded-full group-hover:w-6 transition-all" />
                    <div className="w-5 h-0.5 bg-brand-emerald rounded-full" />
                    <div className="w-3 h-0.5 bg-brand-emerald rounded-full self-start ml-3 group-hover:w-5 transition-all" />
                </button>
            </div>
        </header>
    );
};
