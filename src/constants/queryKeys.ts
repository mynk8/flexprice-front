type QueryParams = Record<string, unknown>;

export const QUERY_KEYS = {
	environments: {
		all: () => ['environments'] as const,
	},

	customers: {
		all: () => ['customers'] as const,
		list: (filters: QueryParams = {}, page = 1) => [...QUERY_KEYS.customers.all(), 'list', page, filters] as const,
		detail: (id: string) => [...QUERY_KEYS.customers.all(), id] as const,
	},

	subscriptions: {
		all: () => ['subscriptions'] as const,
		detail: (id: string) => [...QUERY_KEYS.subscriptions.all(), id] as const,
		entitlements: (id: string) => [...QUERY_KEYS.subscriptions.detail(id), 'entitlements'] as const,
		usage: (id: string) => [...QUERY_KEYS.subscriptions.detail(id), 'usage'] as const,
	},

	plans: {
		all: () => ['plans'] as const,
		list: (params?: QueryParams) =>
			params ? ([...QUERY_KEYS.plans.all(), 'list', params] as const) : ([...QUERY_KEYS.plans.all(), 'list'] as const),
		detail: (id: string) => [...QUERY_KEYS.plans.all(), id] as const,
	},

	features: {
		all: () => ['features'] as const,
		detail: (id: string) => [...QUERY_KEYS.features.all(), id] as const,
	},

	invoices: {
		all: () => ['invoices'] as const,
		list: (filters?: QueryParams) =>
			filters ? ([...QUERY_KEYS.invoices.all(), 'list', filters] as const) : ([...QUERY_KEYS.invoices.all(), 'list'] as const),
		detail: (id: string) => [...QUERY_KEYS.invoices.all(), id] as const,
	},

	creditNotes: {
		all: () => ['creditNotes'] as const,
		detail: (id: string) => [...QUERY_KEYS.creditNotes.all(), id] as const,
	},

	connections: {
		all: () => ['connections'] as const,
		byProvider: (provider: string) => [...QUERY_KEYS.connections.all(), provider] as const,
	},

	metrics: {
		dashboard: (orgId: string) => ['metrics', 'dashboard', orgId] as const,
		mrr: (orgId: string) => [...QUERY_KEYS.metrics.dashboard(orgId), 'mrr'] as const,
		usage: (orgId: string, period: string) => [...QUERY_KEYS.metrics.dashboard(orgId), 'usage', period] as const,
	},
} as const;

export type QueryKeys = typeof QUERY_KEYS;
