import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StreamClientProvider } from "./components/DoctorContext/StreamClientProvider.tsx";
import React from "react";
// Removed incorrect ReactDOM import

const Root = () => {
  const [userInfo, setUserInfo] = React.useState({
    id: localStorage.getItem("id"),
    name: localStorage.getItem("name"),
  });

  return (
    <StreamClientProvider userInfo={userInfo}>
      <App setUserInfo={setUserInfo} />
    </StreamClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
