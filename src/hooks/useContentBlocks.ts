import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentBlock {
    id: string;
    block_key: string;
    title: string;
    subtitle: string;
    content: any;
    is_active: boolean;
}

export const useContentBlocks = () => {
    const [blocks, setBlocks] = useState<Record<string, ContentBlock>>({});
    const [sortedBlocks, setSortedBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlocks = async () => {
            const { data } = await supabase
                .from('m_content_blocks')
                .select('*')
                .order('order_index', { ascending: true });
            
            if (data) {
                const blockMap = data.reduce((acc, block) => {
                    acc[block.block_key] = block;
                    return acc;
                }, {} as Record<string, ContentBlock>);
                setBlocks(blockMap);
                setSortedBlocks(data);
            }
            setLoading(false);
        };
        fetchBlocks();
    }, []);

    return { blocks, sortedBlocks, loading };
};
