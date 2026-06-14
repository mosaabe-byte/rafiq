import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvjntrowbowqlizvyngo.supabase.co';
const supabaseKey = 'sb_publishable_EZh-CUVzBuy0F2N5O0xv8Q_4maTRZAY';

export const supabase = createClient(supabaseUrl, supabaseKey);