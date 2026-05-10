import { NODE_ENV, NodeEnv } from '@/types';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const isSelfHosted = NODE_ENV === NodeEnv.SELF_HOSTED;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const shouldUseMockClient = isSelfHosted || import.meta.env.MODE === 'test' || !supabaseUrl || !supabaseKey;

// Create a mock client for self-hosted mode
const createMockClient = (): SupabaseClient =>
	({
		auth: {
			signIn: async () => ({ user: null, error: null }),
			signOut: async () => ({ error: null }),
			onAuthStateChange: () => ({ data: null, error: null }),
			getSession: async () => ({ data: null, error: null }),
		},
		from: () => ({
			select: async () => [],
			insert: async () => ({ data: null, error: null }),
			update: async () => ({ data: null, error: null }),
			delete: async () => ({ data: null, error: null }),
		}),
	}) as unknown as SupabaseClient;

const supabase = shouldUseMockClient ? createMockClient() : createClient(supabaseUrl, supabaseKey);

export default supabase;
