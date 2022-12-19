import { useState } from "react";

export interface SpeechProps {
  lang: string;
  auto: boolean;
}

const useSpeech = ({ lang, auto }: Partial<SpeechProps>): [any, any] => {
  const [initialized, toggleInit] = useState<boolean>(false);
  const [recognizer, setRecognizer] = useState(null);

  const SpeechController = () => {
    const init = () => {
      if (!initialized) {
        toggleInit(true);
        const grammar =
          "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
        let speechRecognizer = new ((window as any).webkitSpeechRecognition ||
          (window as any).mozSpeechRecognition ||
          (window as any).msSpeechRecognition ||
          (window as any).oSpeechRecognition ||
          (window as any).SpeechRecognition)();
        const grammarList = new (window as any).webkitSpeechGrammarList();
        grammarList.addFromString(grammar, 1);
        speechRecognizer.grammars = grammarList;
        speechRecognizer.continuous = true;
        speechRecognizer.lang = lang || "en-US";
        speechRecognizer.autoplay = auto || false;
        speechRecognizer.onstart = () => {
          console.log("started listening");
        };
        speechRecognizer.onsoundstart = () => {
          console.log("sound detected");
        };
        speechRecognizer.onresult = (e: any) => {
          console.log(e.results.length)
          console.log(e.results[e.results.length - 1][0].transcript);
          const el = document.querySelector("#_result")
          el!.innerHTML = e.results[e.results.length - 1][0].transcript
        };
        speechRecognizer.onend = () => {
          console.log("ended");
        };
        setRecognizer(speechRecognizer);
      } else {
        return console.error("already initialized");
      }
    };

    return {
      init,
    };
  };
  return [SpeechController, recognizer];
};

export default useSpeech;
