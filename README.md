# Voxly - AI Transcriber

Plain HTML, CSS and JavaScript. No build step.

## Run it (recommended: local server)
    cd voxly
    python3 -m http.server 8000
then open http://localhost:8000 in Chrome or Edge. (Opening index.html directly also works, but a server is more reliable.)

## Real transcription (file to text)
When you upload an audio/video file and press Transcribe, Voxly loads the Whisper "tiny.en" speech model
in your browser (transformers.js from the jsDelivr CDN, model from Hugging Face) and transcribes the file ON YOUR DEVICE.
- Needs internet the first time (about 40 MB model download, then cached).
- English only (whisper-tiny.en). For other languages use the multilingual model `Xenova/whisper-tiny` in script.js.
- Long files can take a few minutes. Songs with loud music are transcribed less accurately than speech.
- If the model cannot load, Voxly shows a clearly labelled SAMPLE transcript instead (never presented as your file's content).

## Other features
- Live dictation: real, uses the browser Web Speech API (mic permission needed).
- Text to video: real animated video rendered in the browser (Canvas + MediaRecorder), downloadable.
- Link translator: pasted text translation and AI summaries use `window.AI` in script.js, which only works inside Claude.
  Replace `window.AI` with a call to your own backend or AI API to make them work anywhere.
- Link preview (pasting a URL) is a sample result: browsers cannot read other sites' videos. Needs a backend.

## Files
index.html, styles.css, script.js

## Device and browser support
- Layout: responsive from small phones (320px) to large desktops and TVs; supports notches (safe areas), touch and mouse, reduced motion.
- Browsers: current Chrome, Edge, Safari (iOS 14.5+ / macOS) and Firefox. Older browsers lose some visual effects but still work.
- Live dictation: Chrome, Edge, Safari. Not available in Firefox (a message is shown).
- Text to video: saves .webm (Chrome/Edge/Firefox) or .mp4 (Safari).
- On-device transcription: best on desktop Chrome/Edge; phones may be slow on long files.
- Downloads (.txt, .srt, video) work on all modern browsers; inside Claude they go through its save prompt (.srt is saved as .srt.txt there).
