import React from 'react';
import { MessageCircle, Send, Share2 } from 'lucide-react';
import { SpinningCoin } from '../ui/SpinningCoin';
import { SectionHeader } from '../ui/SectionHeader';

export const Footer = () => {
    return (
        <footer className="py-24 px-8 border-t border-white/5 bg-black/20 relative">
            <SpinningCoin className="mb-16" size="w-32 h-32" />
            <SectionHeader title="Перестаньте искать деньги далеко." subTitle="Давайте найдем их у вас под ногами." />

            <div className="grid gap-5 mb-20">
                <a href="https://t.me/monetizator_osipuk" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                        <MessageCircle className="w-8 h-8 text-brand-emerald" />
                    </div>
                    <div>
                        <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">Написать лично</div>
                        <div className="font-black text-white text-lg leading-none">@monetizator_osipuk</div>
                    </div>
                </a>

                <a href="https://t.me/+P3O1S_T2vR80NmIy" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                        <Send className="w-8 h-8 text-brand-emerald" />
                    </div>
                    <div>
                        <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">Telegram Канал</div>
                        <div className="font-black text-white text-lg leading-none">Зайти в канал</div>
                    </div>
                </a>

                <a href="https://wa.me/79219001331" className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 group transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-brand-emerald/20">
                        <Share2 className="w-8 h-8 text-brand-emerald" />
                    </div>
                    <div>
                        <div className="text-[11px] text-brand-emerald font-black uppercase tracking-widest mb-1">WhatsApp</div>
                        <div className="font-black text-white text-lg leading-none">Написать в WhatsApp</div>
                    </div>
                </a>
            </div>

            <div className="pt-24 flex flex-col items-center gap-6 opacity-20">
                <div className="font-mono text-[9px] uppercase tracking-[0.6em] text-center font-black leading-none">MONETIZATOR // PROTOCOL // 2026</div>
            </div>
        </footer>
    );
};