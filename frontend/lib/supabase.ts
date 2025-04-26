import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://msqrphwdheoogpedtocn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcXJwaHdkaGVvb2dwZWR0b2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDY0NzAsImV4cCI6MjA2MTE4MjQ3MH0.LuVeFilB9yigFcuLya5cgagbzhoXkEjNQt2vN2h4GoQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})