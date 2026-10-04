# Signal Theatre

An immersive Three.js cinema study built from the original project assets: curved video surfaces, reflective flooring, and an inside-the-room camera perspective.

Originally explored in 2022 and revisited in 2026 as part of a small creative-coding collection.

## Interaction
- Drag to look around the cylindrical cinema
- Scroll to adjust field of view
- Use the on-screen controls to move between screens or reset the view
- The scene rotates very slowly when idle

## Original media
The refreshed study intentionally keeps the original project media:
- `castleGif.mp4`
- `houseGif.mp4`
- `sky2Gif.mp4`
- `building.jpeg`
- `floorTexture.jpg`

## Techniques
- Curved cylinder geometry
- Video textures
- Reflective floor
- Custom pointer controls
- Responsive WebGL rendering

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```
