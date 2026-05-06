import { Menu, X } from 'lucide-react';

export const Header = ({ onOpenMenu, isOpen, onClose, block }: { onOpenMenu: () => void; isOpen?: boolean; onClose?: () => void; block?: any }) => {

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-[1500] w-full max-w-[460px] px-6 py-5 bg-brand-obsidian/95 backdrop-blur-xl border-b border-x border-white/5">
            <div className="flex justify-between items-center max-w-[460px] mx-auto relative">
                
                {/* Logo Section - Left */}
                <div className="flex items-center">
                    <img 
                        src={block?.content?.image?.startsWith('assets/') ? `/${block.content.image}` : (block?.content?.image || "/assets/LogoCoin.png")} 
                        alt="Logo" 
                        className="w-14 h-14 object-contain filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                    />
                </div>

                {/* Center Text */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-xl font-display font-black text-brand-emerald uppercase tracking-tighter leading-none mb-1 whitespace-nowrap">
                        {block?.content?.logo_text || "МОНЕТИЗАТОР"}
                    </span>
                    <span className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.4em] font-black whitespace-nowrap">
                        {block?.content?.logo_sub || "СЕРГЕЙ ОСИПУК"}
                    </span>
                </div>

                <div className="flex items-center">
                    <button 
                        onClick={isOpen ? onClose : onOpenMenu}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-brand-emerald hover:bg-brand-emerald/10 transition-all active:scale-95"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </header>
    );
};
