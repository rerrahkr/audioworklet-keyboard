export type Pitch =
  | "C"
  | "C#"
  | "D"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "Bb"
  | "B";

export type KeyOnEvent = {
  type: "keyOn";
  pitch: Pitch;
};

export type KeyOffEvent = {
  type: "keyOff";
  pitch: Pitch;
};
