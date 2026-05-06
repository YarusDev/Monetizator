import { ExternalLink } from 'lucide-react';

export const ProductCard = ({ name, price, img, desc, accentColor = "brand-emerald", cta = "Подробнее" }: any) => {
    const isGold = accentColor === "brand-gold";
    return (
        <div className={`glass-card overflow-hidden group flex flex-col h-full border-white/10 ${isGold ? 'bg-brand-gold/[0.02] border-brand-gold/20' : ''}`}>
            <div className="aspect-video overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4 gap-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight flex-1">{name}</h4>
                    <span className={`font-mono font-black text-lg whitespace-nowrap ${isGold ? 'text-brand-gold' : 'text-brand-emerald'}`}>{price}</span>
                </div>
                <p className="text-base text-brand-zinc/50 leading-relaxed mb-8 flex-1 font-medium">{desc}</p>
                <button
                    onClick={() => window.location.href = `https://t.me/monetizator_osipuk?text=${encodeURIComponent(`Интересует ${name}`)}`}
                    className={`w-full h-14 border rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isGold
                        ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                >
                    {cta} <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};