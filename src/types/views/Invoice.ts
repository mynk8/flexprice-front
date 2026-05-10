/**
 * View Types — Invoice
 * ======================
 * These types represent the *composed shape* consumed by UI components.
 * They are NOT raw API DTOs — they add meaningful domain extensions.
 *
 * Key principle: never pass a raw API return type as a table generic T.
 * Always wrap it in a view type so the component owns the shape contract.
 */

import type { Invoice } from '@/models/Invoice';
import type { Customer } from '@/models/Customer';

/**
 * InvoiceWithSubscriptionCustomer
 * -------------------------------
 * Used when the subscription's owning customer differs from the invoice's billing customer.
 * This happens in multi-entity setups where you invoice the employer but the subscription
 * belongs to the customer entity. The subscription_customer is hydrated via expand=subscription_customer.
 *
 * This avoids the caller having to dig into `invoice.subscription.customer` — that nested
 * path is an implementation detail of how the backend resolves the expand.
 */
export type InvoiceWithSubscriptionCustomer = Invoice & {
	/** Hydrated via `expand=subscription_customer` when subscription_customer_id != customer_id */
	subscription_customer?: Customer;
};

/**
 * InvoiceForList
 * --------------
 * Shape consumed by the invoice list table (and any list-level table).
 * Compose extensions here rather than spreading raw DTO fields.
 *
 * This type anchors the contract at the view layer — if the API shape changes,
 * only this file needs to change, not every component that uses Invoice data.
 */
export type InvoiceForList = InvoiceWithSubscriptionCustomer;

/**
 * InvoiceForDetail
 * ----------------
 * Shape consumed by the invoice detail page.
 * Add richer computed/decorated fields here as the detail page grows.
 */
export type InvoiceForDetail = InvoiceForList & {
	/** True when the invoice has been voided and replaced by a recalculated_invoice_id */
	isVoided: boolean;
	/** True when overpaid_amount > 0 — the customer paid more than was due */
	isOverpaid: boolean;
};

const _invoiceForDetailComputedFields = (invoice: Invoice): Omit<InvoiceForDetail, keyof Invoice> => ({
	isVoided: invoice.recalculated_invoice_id !== undefined,
	isOverpaid: (invoice.overpaid_amount ?? 0) > 0,
});

/** Helper to build a fully-typed InvoiceForDetail from a raw Invoice */
export const toInvoiceForDetail = (invoice: Invoice): InvoiceForDetail => ({
	...invoice,
	..._invoiceForDetailComputedFields(invoice),
});
