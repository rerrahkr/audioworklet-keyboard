import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import type React from "react";
import { useHooks } from "./hooks";

function App(): React.JSX.Element {
  const {
    pitch,
    streamHasRun,
    handleKeyDown,
    handleKeyUp,
    handleSliderChange,
  } = useHooks();

  return (
    <>
      <CssBaseline />
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <Stack gap={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <VolumeDown />
          <Slider
            min={0}
            max={1}
            step={0.001}
            defaultValue={0.8}
            onChange={handleSliderChange}
          />
          <VolumeUp />
        </Stack>
        <Box>
          {streamHasRun ? (
            <Box sx={{ fontSize: "64px" }}>{pitch}</Box>
          ) : (
            <Box>{'Press "Enter" to start audio streaming'}</Box>
          )}
        </Box>
      </div>
    </>
  );
}

export default App;
