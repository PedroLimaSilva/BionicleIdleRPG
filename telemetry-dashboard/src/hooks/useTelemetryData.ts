import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { TelemetrySession } from '../types';

export function useSessions(limit = 1000) {
  const [data, setData] = useState<TelemetrySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('telemetry_sessions')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setData(data as TelemetrySession[]);
        setLoading(false);
      });
  }, [limit]);

  return { data, loading, error };
}

export function useErrorReports(limit = 200) {
  const [data, setData] = useState<TelemetrySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('telemetry_sessions')
      .select('*')
      .not('error_message', 'is', null)
      .order('received_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setData(data as TelemetrySession[]);
        setLoading(false);
      });
  }, [limit]);

  return { data, loading, error };
}
