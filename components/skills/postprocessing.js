import { HalfFloatType, Vector2 } from 'three';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect, VignetteEffect } from 'postprocessing';
// Smooth selective bloom + subtle vignette (removed unseeded temporal NoiseEffect to eliminate per-frame grain flicker).
export function createPost(renderer, scene, cam, { mobile }) {
  const composer = new EffectComposer(renderer, { frameBufferType: HalfFloatType, multisampling: mobile ? 0 : 4 });
  const bloom = new BloomEffect({ intensity: .85, luminanceThreshold: .72, luminanceSmoothing: .45, mipmapBlur: true });
  const ca = new ChromaticAberrationEffect({ offset: new Vector2(.0004, .0004), radialModulation: false });
  composer.addPass(new RenderPass(scene, cam));
  composer.addPass(new EffectPass(cam, bloom, new VignetteEffect({ offset: .25, darkness: .58 })));
  composer.addPass(new EffectPass(cam, ca));
  let on = true;
  return {
    setSize: (w, h) => composer.setSize(w, h), render: dt => composer.render(dt), dispose: () => composer.dispose(),
    warp(w) { const o = on ? .0004 + .0055 * w : 0; ca.offset.set(o, o); }, low() { on = false; },
  };
}
