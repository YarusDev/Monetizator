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
    image_url?: string;
    order_index: number;
    is_active: boolean;
}

export const Services = ({ block }: { block?: any }) => {
    const content = block?.content || {};
    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('m_products')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });
            
            if (data) setDbProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-emerald" />
        </div>
    );

    const getHydratedProduct = (p: any) => {
        const pTitle = (p.title || '').trim().toLowerCase();
        const dbP = dbProducts.find(item => {
            if (p.id && item.id === p.id) return true;
            const dbTitle = (item.title || '').trim().toLowerCase();
            return dbTitle === pTitle || dbTitle.includes(pTitle) || pTitle.includes(dbTitle);
        });
        
        if (!dbP) return p;
        return {
            ...p,
            id: dbP.id,
            image_url: dbP.image_url || p.image_url,
            image: dbP.image_url || p.image || p.image_url,
            description: p.description || dbP.description,
            price: p.price || dbP.price,
            currency: p.currency || dbP.currency
        };
    };

    let steps: any[] = [];

    if (block?.content?.echelons) {
        steps = block.content.echelons.map((e: any, i: number) => ({
            label: e.title || "",
            description: e.description,
            color: i === 1 ? 'text-brand-gold' : 'text-brand-emerald',
            accentColor: i === 1 ? 'brand-gold' : 'brand-emerald',
            items: (e.products || []).map(getHydratedProduct).filter((p: any) => p && p.title)
        }));
    } else {
        // If no echelons, just show hydrated products directly if they exist in content
        const contentProducts = block?.content?.products || [];
        if (contentProducts.length > 0) {
            steps = [{
                label: "",
                items: contentProducts.map(getHydratedProduct)
            }];
        }
    }

    return (
        <BlockWrapper id="services">
            <SectionHeader 
                title={content.title || ""} 
                subTitle={content.subtitle || ""} 
            />

            <div className="space-y-20">
                {steps.map((step, idx) => (
                    <div key={idx} className="space-y-10">
                        {step.items.length > 0 && (
                            <>
                                {step.label && (
                                    <div className="space-y-4 text-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-[1px] flex-1 bg-white/5" />
                                            <span className={`font-mono text-[11px] ${step.color || 'text-brand-emerald'} font-black uppercase tracking-[0.3em]`}>{step.label}</span>
                                            <div className="h-[1px] flex-1 bg-white/5" />
                                        </div>
                                        {step.description && (
                                            <p className="text-brand-zinc/40 text-[10px] uppercase font-bold tracking-widest max-w-xs mx-auto leading-relaxed">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-6">
                                    {step.items.map((p: any, pIdx: number) => (
                                        <ProductCard
                                            key={p.id || pIdx}
                                            name={p.title} 
                                            price={typeof p.price === 'number' ? `${p.price.toLocaleString()} ${p.currency === 'RUB' ? '₽' : p.currency || '₽'}` : p.price}
                                            img={p.image_url || p.image} 
                                            desc={p.description}
                                            accentColor={step.accentColor || 'brand-emerald'}
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