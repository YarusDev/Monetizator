export interface Lead {
  id: string;
  name: string;
  contact: string;
  status: string;
  created_at: string;
  metadata: any;
  note?: string;
}

export interface Client {
  id: string;
  full_name: string;
  telegram: string;
  email: string;
  phone: string;
  total_spent: number;
  type: 'person' | 'company';
  history: any[];
  created_at: string;
}

export interface Deal {
  id: string;
  client_id: string;
  lead_id: string;
  amount: number;
  product_name: string;
  status: string;
  note: string;
  is_repeat: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  client_id: string;
  lead_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface Stage {
  id: string;
  key: string;
  title: string;
  color: string;
  order_index: number;
}
