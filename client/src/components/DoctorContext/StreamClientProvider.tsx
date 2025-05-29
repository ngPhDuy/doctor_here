// src/components/DoctorContext/StreamClientProvider.tsx
import React, { useEffect, useState, ReactNode } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";

interface StreamClientProviderProps {
  userInfo: {
    id: string | null;
    name: string | null;
  };
  children: React.ReactNode;
}

export const StreamClientProvider: React.FC<StreamClientProviderProps> = ({
  userInfo,
  children,
}) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("id")
  );

  useEffect(() => {
    const connectStream = async () => {
      const role = localStorage.getItem("role");
      if (!role || role !== "bs") return; // ❌ Không phải bác sĩ thì không làm gì

      setIsDoctor(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/video_call/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: localStorage.getItem("id") }),
        }
      );

      const data = await response.json();
      console.log("Token:", data);
      localStorage.setItem("apiKey", data.api_key);
      localStorage.setItem("streamToken", data.token);

      const user = {
        id: localStorage.getItem("id") as string,
        name: localStorage.getItem("fullName") as string,
        image: localStorage.getItem("avtUrl") as string,
      };

      const client = StreamVideoClient.getOrCreateInstance({
        apiKey: data.api_key,
        user,
        token: data.token,
      });
      setClient(client);

      return;
    };

    connectStream();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [userInfo]);

  if (!isDoctor) {
    return <>{children}</>; // 🟡 Không phải bác sĩ thì render như thường
  }

  if (!client) return null;

  console.log("StreamVideoClient", client);

  return <StreamVideo client={client}>{children}</StreamVideo>;
};
