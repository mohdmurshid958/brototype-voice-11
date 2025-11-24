import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const clients = new Map<string, Set<WebSocket>>();

serve(async (req) => {
  const url = new URL(req.url);
  const callId = url.searchParams.get("callId");
  
  if (!callId) {
    return new Response("Missing callId parameter", { status: 400 });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log(`Client connected to call: ${callId}`);
    
    if (!clients.has(callId)) {
      clients.set(callId, new Set());
    }
    clients.get(callId)!.add(socket);
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`Message received for call ${callId}:`, message);

      // Broadcast to all clients in the same call
      const callClients = clients.get(callId);
      if (callClients) {
        const messageStr = JSON.stringify(message);
        callClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  socket.onclose = () => {
    console.log(`Client disconnected from call: ${callId}`);
    const callClients = clients.get(callId);
    if (callClients) {
      callClients.delete(socket);
      if (callClients.size === 0) {
        clients.delete(callId);
      }
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});
