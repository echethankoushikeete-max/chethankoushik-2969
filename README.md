# LIFEOS — I AM LIFEOS

This is the final integrated landing interface for LIFEOS.

## What is included
- Original-style living portrait in the center, using the supplied portrait engine and image set.
- Cursor-following eyes, blinking, expressions, drag/stretch interactions, idle acts and portrait effects.
- Custom cursor ring + hover effects.
- LIFEOS branding replacing Mina.
- Marquee, About, Services and sticky Projects sections.
- Enter LIFEOS / Live Project buttons open the real LIFEOS workspace at `/workspace`.
- Workspace includes LIFE MODE, STUDY MODE, camera capture and the existing local Ollama `lifeos` API route.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

The public landing interface can load the remote portrait/image assets used by the supplied design. The AI workspace still points to local Ollama (`http://localhost:11434`) until a hosted AI backend is configured.
