import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ockjaboenzpwwhzlsvdj.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ja2phYm9lbnpwd3doemxzdmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1MDMwNTgsImV4cCI6MjAyODA3OTA1OH0.hqvQbK0ydgz75DszpuZWjfufpxky9qZi21G5qCtm4eE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});