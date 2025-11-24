import { ReactNode } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

interface StreamVideoProviderProps {
  client: StreamVideoClient | null;
  children: ReactNode;
}

export const StreamVideoProvider = ({ client, children }: StreamVideoProviderProps) => {
  if (!client) {
    return <div>{children}</div>;
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
};