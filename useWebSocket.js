import { useEffect, useRef } from 'react';

export default function useWebSocket(url, onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onmessage = event => onMessage(event.data);
    return () => ws.current && ws.current.close();
  }, [url, onMessage]);
}
