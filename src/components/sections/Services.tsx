import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { ProductCard } from '../ui/ProductCard';

export const Services = () => {
    return (
        <BlockWrapper id="services">
            <SectionHeader title="Линейка продуктов" subTitle="От точечной диагностики до системного сопровождения." />

            <div className="space-y-16">
                {/* Эшелон 1 */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="font-mono text-[11px] text-brand-emerald font-black uppercase tracking-[0.3em]">Шаг 1: Диагностика</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="grid gap-6">
                        <ProductCard
                            name="Диагностика (60 мин)" price="5 000 ₽" img="assets/Диагностика.jpg"
                            desc="Глубокий разбор текущих активов и поиск 3-х точек быстрого роста."
                        />
                        <ProductCard
                            name="Мастермайнд-блиц" price="от 1 990 ₽" img="assets/Мастермайнд-блиц.jpg"
                            desc="Формат-разведка для тех, кто хочет познакомиться с методом в деле."
                        />
                    </div>
                </div>

                {/* Эшелон 2 */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="font-mono text-[11px] text-brand-gold font-black uppercase tracking-[0.3em]">Шаг 2: Среда</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="grid gap-6">
                        <ProductCard
                            name="Мастермайнд (Сборный)" price="5 000 ₽" img="assets/Мастермайнд.jpg"
                            desc="Игра + коллективный разум. Генерируем 50+ идей для вашего бизнеса за встречу."
                            accentColor="brand-gold"
                        />
                        <ProductCard
                            name="Стратегическая сессия" price="15 000 ₽" img="assets/Стратегическая сессия.jpg"
                            desc="Проектируем воронку ресурсов и партнерств на ближайшие 3 месяца."
                            accentColor="brand-gold"
                        />
                    </div>
                </div>

                {/* Эшелон 3 */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="font-mono text-[11px] text-brand-emerald font-black uppercase tracking-[0.3em]">Шаг 3: Масштаб</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="grid gap-6">
                        <ProductCard
                            name="Групповое наставничество" price="от 20 000 ₽" img="assets/Шаг 3.jpg"
                            desc="Работа в мини-группе: внедрение инструментов под моим присмотром."
                            cta="Зайти в продукт"
                        />
                        <ProductCard
                            name="Ведение стратегии" price="от 30 000 ₽" img="assets/Мастермайнд.jpg"
                            desc="Я становлюсь вашим архитектором монетизации на постоянной основе."
                            cta="Обсудить условия"
                        />
                        <ProductCard
                            name="Индивидуальное сопровождение" price="от 50 000 ₽" img="assets/Стратегическая сессия.jpg"
                            desc="Полноценное внедрение всех инструментов до твердого результата."
                            cta="Зайти в сопровождение"
                        />
                    </div>
                </div>
            </div>
        </BlockWrapper>
    );
};