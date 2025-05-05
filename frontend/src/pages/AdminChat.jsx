import { Chat, LiveKitRoom } from "@livekit/components-react";
import '@livekit/components-styles';
import { useState, useEffect } from "react";

const LIVEKIT_URL = "wss://frontdesk-pvh88g0k.livekit.cloud";

export default function AdminChat() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    // Replace with your actual token server URL
    fetch("http://localhost:3001/api/operator-token?participantName=admin")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setToken(data.token);
      })
      .catch((err) => {
        console.error("Failed to fetch token", err);
      });
  }, []);

  if (!token) return <div>Loading...</div>;

  return(
  <LiveKitRoom data-lk-theme="default"
  serverUrl={LIVEKIT_URL} token={token} connect={true}>
       <Chat style={{ width: '100vw', height: '100vh' }}/>
    </LiveKitRoom>
  )

}
