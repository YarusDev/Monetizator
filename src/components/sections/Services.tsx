import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { BlockWrapper } from '../ui/BlockWrapper';
import { SectionHeader } from '../ui/SectionHeader';
import { ProductCard } from '../ui/ProductCard';
import { supabase } from '../../lib/supabase';

interface Product {
    id: string;
    title: string;
    price: number;
    currency: string;
    description: string;
    order_index: number;
    is_active: boolean;
}

export const Services = ({ block }: { block?: any }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('m_products')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });
            
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-emerald" />
        </div>
    );

    // Группировка продуктов по эшелонам согласно документации
    const steps = [
        { label: 'Эшелон 1: Точечные решения', color: 'text-brand-emerald', items: products.slice(0, 2) },
        { label: 'Эшелон 2: Среда и стратегии', color: 'text-brand-gold', items: products.slice(2, 4) },
        { label: 'Эшелон 3: Ведение и рост', color: 'text-brand-emerald', items: products.slice(4) },
    ];

    return (
        <BlockWrapper id="services">
            <SectionHeader 
                title={block?.title || "Линейка продуктов"} 
                subTitle={block?.subtitle || "От точечной диагностики до системного сопровождения."} 
            />

            <div className="space-y-16">
                {steps.map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        {step.items.length > 0 && (
                            <>
                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                    <span className={`font-mono text-[11px] ${step.color} font-black uppercase tracking-[0.3em]`}>{step.label}</span>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                </div>

                                <div className="grid gap-6">
                                    {step.items.map((p) => (
                                        <ProductCard
                                            key={p.id}
                                            name={p.title} 
                                            price={`${p.price.toLocaleString()} ${p.currency === 'RUB' ? '₽' : p.currency}`}
                                            img={p.image_url || `/assets/${p.title.split(' ')[0]}.jpg`} 
                                            desc={p.description}
                                            accentColor={step.color.includes('gold') ? 'brand-gold' : 'brand-emerald'}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </BlockWrapper>
    );
};