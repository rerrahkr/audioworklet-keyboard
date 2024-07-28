import type React from "react";
import { useRef, useState } from "react";
import processorUrl from "./my-processor.ts?worker&url";
import type { KeyOffEvent, KeyOnEvent, Pitch } from "./types";

const keyToPitchMap = new Map<string, Pitch>([
  ["KeyZ", "C"],
  ["KeyS", "C#"],
  ["KeyX", "D"],
  ["KeyD", "Eb"],
  ["KeyC", "E"],
  ["KeyV", "F"],
  ["KeyG", "F#"],
  ["KeyB", "G"],
  ["KeyH", "G#"],
  ["KeyN", "A"],
  ["KeyJ", "Bb"],
  ["KeyM", "B"],
]);

async function createAudioWorkletNode(
  audioContext: AudioContext
): Promise<AudioWorkletNode | undefined> {
  try {
    // Load the processor into the worker thread.
    await audioContext.audioWorklet.addModule(processorUrl);
    return new AudioWorkletNode(audioContext, "my-processor");
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export function useHooks() {
  const [streamHasRun, setStreamRun] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext>();
  const audioWorkletNodeRef = useRef<AudioWorkletNode>();

  const [pitch, setPitch] = useState<Pitch>();

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.repeat) {
      return;
    }

    if (e.code === "Enter") {
      runStream()
        .then(() => {
          setStreamRun(true);
        })
        .catch();
      return;
    }

    const newPitch = keyToPitchMap.get(e.code);
    if (newPitch) {
      // Send key-on message to processor through message port.
      audioWorkletNodeRef.current?.port.postMessage({
        type: "keyOn",
        pitch: newPitch,
      } satisfies KeyOnEvent);

      setPitch(newPitch);
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    const keyPitch = keyToPitchMap.get(e.code);
    if (keyPitch && keyPitch === pitch) {
      // Send key-off message to processor through message port.
      audioWorkletNodeRef.current?.port.postMessage({
        type: "keyOff",
        pitch: keyPitch,
      } satisfies KeyOffEvent);

      setPitch(undefined);
    }
  }

  async function runStream() {
    if (audioContextRef.current) {
      return;
    }

    audioContextRef.current = new AudioContext();

    audioWorkletNodeRef.current = await createAudioWorkletNode(
      audioContextRef.current
    );
    if (!audioWorkletNodeRef.current) {
      window.alert("AudioWorklet cloud not be initialized!");
      await audioContextRef.current.close();
      audioContextRef.current = undefined;
      return;
    }
    audioWorkletNodeRef.current.connect(audioContextRef.current.destination);

    await audioContextRef.current.resume();
    window.alert("Start streaming...");
  }

  function handleSliderChange(_e: Event, value: number | number[]) {
    if (Array.isArray(value)) {
      return;
    }

    // Set gain parameter by AudioParam.
    const gainParam = audioWorkletNodeRef.current?.parameters.get("gain");
    if (!gainParam || !audioContextRef.current) {
      return;
    }

    // Do liner transition to prevent sounding click noise.
    gainParam.linearRampToValueAtTime(
      value,
      audioContextRef.current.currentTime + 0.1
    );
  }

  return {
    pitch,
    streamHasRun,
    handleKeyDown,
    handleKeyUp,
    handleSliderChange,
  };
}
