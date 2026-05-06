import { Users, TrendingUp, MessageCircle, Target, Handshake, BarChart3, Timer } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';

export const Method = () => {
    return (
        <BlockWrapper id="method">
            <SectionHeader title="Я сканирую ваш проект через 7 «линз» прибыли." subTitle="Деньги в 99% случаев не «приходят» из новой рекламы, а «просыпаются» внутри системы." />
            <div className="grid gap-4">
                {[
                    { n: "Клиентская база", i: Users, d: "Превращаем ваш «архив» в актив, который приносит деньги без вложений в трафик." },
                    { n: "Повторные продажи", i: TrendingUp, d: "Проектируем логичное продолжение после первой сделки." },
                    { n: "Рекомендации", i: MessageCircle, d: "Учимся управлять «сарафаном» системно и экологично." },
                    { n: "Добавочная ценность", i: Target, d: "Делаем высокий чек обоснованным и желанным для клиента." },
                    { n: "Коллаборации", i: Handshake, d: "Строим партнерства на взаимной выгоде без «кринжа» и спама." },
                    { n: "Скрытые услуги", i: BarChart3, d: "Упаковываем вашу экспертность, которая годами давалась «бонусом»." },
                    { n: "Старые клиенты", i: Timer, d: "Возвращаем тех, кто уже доверял вам деньги, через мягкую пользу." }
                ].map((item, i) => (
                    <div key={i} className="flex gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-emerald/20">
                            <item.i className="w-8 h-8 text-brand-emerald" />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-lg mb-2 uppercase tracking-tight leading-tight">{i + 1}. {item.n}</h4>
                            <p className="text-brand-zinc/50 text-base leading-relaxed font-medium">{item.d}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => document.getElementById('calc-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full h-18 emerald-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 mt-12 active:scale-95 transition-all shadow-xl shadow-brand-emerald/30"
            >
                Просканировать мой бизнес
            </button>
            <div id="calc-anchor" />
        </BlockWrapper>
    );
};