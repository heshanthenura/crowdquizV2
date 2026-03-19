const WS_URL = "wss://crowdquiz-workers.heshanthenura.workers.dev/ws";

type OnlineCountListener = (count: number) => void;

let ws: WebSocket | null = null;
let onlineCount = 0;
const listeners = new Set<OnlineCountListener>();

function connect() {
  if (globalThis.window === undefined) return;

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  ws = new WebSocket(WS_URL);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (typeof data?.count === "number") {
        onlineCount = data.count;
        listeners.forEach((listener) => listener(onlineCount));
      }
    } catch {}
  };

  ws.onclose = () => {
    ws = null;
  };

  ws.onerror = () => ws?.close();
}

export function subscribeToOnlineCount(listener: OnlineCountListener) {
  listeners.add(listener);
  listener(onlineCount);
  connect();

  return () => {
    listeners.delete(listener);
  };
}

export function getOnlineCount() {
  return onlineCount;
}
