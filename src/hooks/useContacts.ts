import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase
        .from('m_contacts')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (!error && data) {
        setContacts(data);
      }
      setLoading(false);
    }

    fetchContacts();
  }, []);

  return { contacts, loading };
}
