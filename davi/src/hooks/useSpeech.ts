import { useState } from "react";

export interface SpeechProps {
  lang: string;
  auto: boolean;
}

const useSpeech = ({ lang, auto }: Partial<SpeechProps>) => {
  const [initialized, toggleInit] = useState<boolean>(false);
  const [recognizer, setRecognizer] = useState(null);

  const SpeechController = () => {
    const init = () => {
      if (!initialized) {
        toggleInit(true);
        let speechRecognizer = new ((window as any).webkitSpeechRecognition ||
          (window as any).mozSpeechRecognition ||
          (window as any).msSpeechRecognition ||
          (window as any).oSpeechRecognition ||
          (window as any).SpeechRecognition)();
        speechRecognizer.language = lang || "en-US";
        speechRecognizer.autoplay = auto || false;
        setRecognizer(speechRecognizer);
      } else {
        return console.error("already initialized");
      }
    };

    return {
      recognizer,
      init,
    };
  };
  return [SpeechController];
};

export default useSpeech;
