import { API_BASE_URL } from '../config/api';

export interface MomoInitiateParams {
  phone: string;
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  metadata?: Record<string, any>;
}

class MomoService {
  generateReference(): string {
    return `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async initiatePayment(params: MomoInitiateParams): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/momo/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token')
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {}),
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to initiate Mobile Money payment');
    }
    return res.json();
  }

  async verifyPayment(reference: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/momo/verify/${encodeURIComponent(reference)}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(typeof window !== 'undefined' && localStorage.getItem('token')
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Verification failed');
    }
    return res.json();
  }
}

export default new MomoService();


