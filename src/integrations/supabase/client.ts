// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mailhnnjrnjvhtojufhp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1haWxobm5qcm5qdmh0b2p1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODY4ODgsImV4cCI6MjA1Mjg2Mjg4OH0.25yRdLZ782q4ZjTcvAxaSNtEPffEgmiocxNTOnbBtqA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);