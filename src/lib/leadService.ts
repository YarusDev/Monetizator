import { supabase } from './supabase';

export const leadService = {
  async submitLead(data: { name: string; contact: string; source_id?: string; metadata?: any }) {
    try {
      const { data: lead, error } = await supabase
        .from('m_leads')
        .insert([
          {
            name: data.name,
            contact: data.contact,
            source_code: data.source_id,
            metadata: {
              ...data.metadata,
              user_agent: navigator.userAgent,
              referrer: document.referrer,
              timestamp: new Date().toISOString()
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return lead;
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  }
};
