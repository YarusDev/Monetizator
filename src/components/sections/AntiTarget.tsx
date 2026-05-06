import { AlertTriangle } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const AntiTarget = () => {
    return (
        <BlockWrapper className="bg-red-500/[0.02] border-y border-red-500/10">
            <SectionHeader title="С кем мы не сработаемся" subTitle="Я ценю свое время и ваш результат. Поэтому я работаю не со всеми." />
            <div className="space-y-6">
                {[
                    { t: "Искатели «волшебных таблеток»", d: "Если вы ждете, что деньги посыпятся с неба без вашего участия и изменений в продукте." },
                    { t: "Любители «бесплатного»", d: "Если вы не готовы инвестировать время и ресурсы в развитие собственной системы монетизации." },
                    { t: "Закрытые к новому", d: "Если вы считаете, что «и так всё знаете», и не готовы тестировать нестандартные связки." }
                ].map((item, i) => (
                    <div key={i} className="flex gap-6 p-8 rounded-[40px] bg-red-500/[0.03] border border-red-500/10 group">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                            <AlertTriangle className="w-7 h-7 text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{item.t}</h4>
                            <p className="text-brand-zinc/50 text-base leading-relaxed font-medium">{item.d}</p>
                        </div>
                    </div>
                ))}
            </div>
        </BlockWrapper>
    );
};