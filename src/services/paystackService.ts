import PaystackPop from '@paystack/inline-js';
import { API_BASE_URL } from '../config/api';

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback: (response: any) => void;
  onClose: () => void;
}

export interface PaymentData {
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  metadata?: Record<string, any>;
}

class PaystackService {
  private publicKey: string;

  constructor() {
    // Get Paystack public key from environment variables
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  }

  /**
   * Initialize Paystack payment
   */
  initializePayment(config: PaystackConfig): void {
    const handler = new PaystackPop();
    handler.newTransaction({
      key: config.key || this.publicKey,
      email: config.email,
      amount: config.amount * 100, // Convert to kobo (smallest currency unit)
      currency: config.currency || 'GHS',
      reference: config.reference,
      onSuccess: config.callback,
      onCancel: config.onClose,
    });
  }

  /**
   * Create payment reference
   */
  generateReference(): string {
    return `AFRI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Verify payment on the backend
   */
  async verifyPayment(reference: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/verify/${encodeURIComponent(reference)}`, {
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

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return ['NGN', 'GHS', 'USD', 'EUR', 'GBP'];
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'NGN'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }
}

export default new PaystackService(); 