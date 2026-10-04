# Signal Theatre

A rotating four-screen Three.js cinema built from the original project media.

The viewer sits near the middle of the room while the cinema rotates from one curved screen to the next. The latest version keeps a little space between screens, uses the original textured floor with a restrained reflection, and defaults to the widest framing so the room remains visible.

## Interaction
- Previous / next screen rotates the cinema
- Scroll or use the controls to zoom
- Each screen change returns to the wide default view

## Original media
- `building.jpeg`
- `castleGif.mp4`
- `houseGif.mp4`
- `sky2Gif.mp4`
- `floorTexture.jpg`

## Techniques
- curved cylinder geometry
- video textures
- screen-to-screen rotation
- reflective textured floor
- interactive field of view
- responsive WebGL rendering

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```
