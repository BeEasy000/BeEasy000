# DCRZ Studio animation

`dcrz-scene.cjs` contains the camera, house and stylized Toyota GT86 geometry and the deterministic 42.7-second sequence. The house forms and turns first; the car follows with circular wheel tracing, a front-to-back body reveal, glass and details, and a complete turn.

Regenerate the README images with Node.js and Python 3 with Pillow 11.3.0:

```sh
python3 -m pip install Pillow==11.3.0
python3 scripts/render-dcrz.py
```

The renderer uses Arial/Menlo on macOS or Liberation Sans/DejaVu Sans Mono on Linux. It produces 600 × 240 GIFs at 20 fps for both GitHub themes, plus PNG posters for `prefers-reduced-motion`. Static intervals may be stored as a single frame with a longer delay. The README displays images only; it does not run JavaScript.

The generated files are `assets/project-dcrz-{dark,light}.gif` and `assets/project-dcrz-{dark,light}-still.png`.
