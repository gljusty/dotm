import { Button } from "@mantine/core";
import { useEffect } from "react";
import useSpeech from "../hooks/useSpeech";

import "./App.css";

function App() {
  const [speechController] = useSpeech({ lang: "en-US" }),
    controller = speechController();
  useEffect(() => {
    controller.init();
  }, []);
  return (
    <div className="App">
      <Button />
    </div>
  );
}

export default App;
