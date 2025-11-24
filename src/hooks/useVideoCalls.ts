import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VideoCall {
  id: string;
  stream_call_id: string;
  student_id: string;
  admin_id: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'missed';
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export const useVideoCalls = () => {
  const [calls, setCalls] = useState<VideoCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCalls((data || []) as VideoCall[]);
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast({
        title: 'Error',
        description: 'Failed to load video calls',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCall = async (adminId: string) => {
    try {
      const { data, error } = await supabase.functions
        .invoke('create-video-call', {
          body: { adminId },
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Video call created successfully',
      });

      fetchCalls();
      return data;
    } catch (error) {
      console.error('Error creating call:', error);
      toast({
        title: 'Error',
        description: 'Failed to create video call',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCallStatus = async (
    callId: string,
    status: VideoCall['status'],
    durationSeconds?: number
  ) => {
    try {
      const { error } = await supabase.functions
        .invoke('update-call-status', {
          body: { callId, status, durationSeconds },
        });

      if (error) throw error;

      fetchCalls();
    } catch (error) {
      console.error('Error updating call status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update call status',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCalls();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('video_calls_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_calls',
        },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    calls,
    isLoading,
    createCall,
    updateCallStatus,
    refreshCalls: fetchCalls,
  };
};