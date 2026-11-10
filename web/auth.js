import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase-config.js';

const ACCOUNTS_KEY = 'kotori-local-accounts-v1';
const SESSION_KEY = 'kotori-local-session-v1';
const ITERATIONS = 210_000;
const encoder = new TextEncoder();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY;
export const cloudEnabled = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = cloudEnabled ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;
const bytesToBase64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const base64ToBytes = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));

async function emailId(email) {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(email.trim().toLowerCase()));
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: base64ToBytes(salt), iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
  return bytesToBase64(bits);
}
function accounts() { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); } catch { return {}; } }
function saveAccounts(value) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(value)); }
function publicLocalUser(user) { return { id: user.id, email: user.email, name: user.name }; }
function setSession(user) { const session = publicLocalUser(user); localStorage.setItem(SESSION_KEY, JSON.stringify(session)); return session; }
function publicCloudUser(user) { return { id: user.id, email: user.email || '', name: user.user_metadata?.display_name || user.email?.split('@')[0] || '日文學習者' }; }
export function progressKey(userId) { return `kotori-progress:${userId}`; }
export function sessionLocal() {
  try { const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); if (!session) return null; const record = Object.values(accounts()).find(item => item.id === session.id); return record ? publicLocalUser(record) : null; }
  catch { return null; }
}
export async function getSessionUser() {
  if (!cloudEnabled) return sessionLocal();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user ? publicCloudUser(data.session.user) : null;
}
export async function registerLocal({ name, email, password }) {
  if (cloudEnabled) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { data: { display_name: name.trim() }, emailRedirectTo: location.origin + import.meta.env.BASE_URL },
    });
    if (error) throw error;
    return { user: data.session ? publicCloudUser(data.user) : null, firstAccount: true, needsEmailConfirmation: !data.session };
  }
  const normalized = email.trim().toLowerCase(), items = accounts();
  if (items[normalized]) throw new Error('這個電子郵件已經註冊，請直接登入。');
  const salt = crypto.getRandomValues(new Uint8Array(16)), encodedSalt = bytesToBase64(salt);
  const record = { id: await emailId(normalized), email: normalized, name: name.trim(), salt: encodedSalt, verifier: await hashPassword(password, encodedSalt), iterations: ITERATIONS };
  const firstAccount = Object.keys(items).length === 0; items[normalized] = record; saveAccounts(items);
  return { user: setSession(record), firstAccount, needsEmailConfirmation: false };
}
export async function loginLocal({ email, password }) {
  if (cloudEnabled) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw error;
    return publicCloudUser(data.user);
  }
  const normalized = email.trim().toLowerCase(), record = accounts()[normalized];
  if (!record) throw new Error('找不到這個帳號，請先註冊。');
  const entered = await hashPassword(password, record.salt);
  if (entered !== record.verifier) throw new Error('密碼不正確，請再試一次。');
  return setSession(record);
}
export async function logoutLocal() {
  if (cloudEnabled) { const { error } = await supabase.auth.signOut(); if (error) throw error; }
  else localStorage.removeItem(SESSION_KEY);
}
export function hasLocalAccounts() { return Object.keys(accounts()).length > 0; }
export async function fetchCloudProgress(userId) {
  if (!cloudEnabled) return null;
  const { data, error } = await supabase.from('learner_progress').select('progress').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data?.progress || null;
}
export async function saveCloudProgress(userId, progress) {
  if (!cloudEnabled) return;
  const { error } = await supabase.from('learner_progress').upsert({ user_id: userId, progress, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) throw error;
}
