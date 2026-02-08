'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ensureAnonymAuth } from '@/firebase/auth';
import { AuthState } from '@/lib/types';

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextUid = await ensureAnonymAuth();
      setUid(nextUid);
    } catch (e) {
      setUid(null);
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthState>(
    () => ({ uid, loading, error, refresh }),
    [uid, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
