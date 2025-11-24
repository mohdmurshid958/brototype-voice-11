import { useState, useEffect } from 'react';
import { StreamVideoClient, User as StreamUser } from '@stream-io/video-react-sdk';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStreamVideo = () => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initStreamClient = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get profile for user name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        // Get Stream token
        const { data: tokenData, error: tokenError } = await supabase.functions
          .invoke('generate-stream-token');

        if (tokenError || !tokenData) {
          console.error('Error generating token:', tokenError);
          toast({
            title: 'Error',
            description: 'Failed to initialize video client',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const streamUser: StreamUser = {
          id: user.id,
          name: profile?.full_name || user.email || 'User',
          image: profile?.avatar_url,
        };

        const videoClient = new StreamVideoClient({
          apiKey: tokenData.apiKey,
          user: streamUser,
          token: tokenData.token,
        });

        setClient(videoClient);
      } catch (error) {
        console.error('Error initializing Stream client:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize video client',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initStreamClient();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, []);

  return { client, isLoading };
};