export const WHATSAPP_NUMBER = '923334813016';

export interface QuoteDetails {
  sku?: string;
  quantity?: string;
  city?: string;
}

export function generalMessage(d: QuoteDetails = {}): string {
  return (
    'Hello ZZ Group, I would like information and pricing for one of your products. ' +
    `Product/SKU: ${d.sku ?? '[Insert Code]'}. ` +
    `Required quantity: ${d.quantity ?? '[Insert Quantity]'}. ` +
    `Delivery city: ${d.city ?? '[Insert City]'}.`
  );
}

export function productQuoteMessage(d: QuoteDetails): string {
  return (
    `Hello ZZ Group, I am interested in bulk pricing for SKU ${d.sku ?? '[Product Code]'}. ` +
    `Required quantity: ${d.quantity ?? '[Quantity]'}. ` +
    `Delivery city: ${d.city ?? '[City]'}. ` +
    'Please confirm specifications, availability, price and delivery details.'
  );
}

export function whatsappLink(message: string, phone: string = WHATSAPP_NUMBER): string {
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappLink(d: QuoteDetails): string {
  return whatsappLink(productQuoteMessage(d));
}