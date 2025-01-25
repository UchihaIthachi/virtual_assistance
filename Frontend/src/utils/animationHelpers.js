// utils/animationHelpers.js
import * as THREE from 'three';

export const lerpMorphTarget = (scene, target, value, speed = 0.1, setupMode, set) => {
  if (!scene) {
    console.error('Scene is not defined!');
    return;
  }

  scene.traverse((child) => {
    if (child.isSkinnedMesh && child.morphTargetDictionary) {
      const index = child.morphTargetDictionary[target];
      if (index === undefined || child.morphTargetInfluences[index] === undefined) {
        return;
      }
      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        child.morphTargetInfluences[index],
        value,
        speed
      );

      if (!setupMode && set) {
        try {
          set({
            [target]: value,
          });
        } catch (e) {
          console.error('Error in setting morph target:', e);
        }
      }
    }
  });
};

export const nextBlink = (setBlink) => {
    if (!setBlink) {
      console.error('setBlink is not defined');
      return;
    }
  
    const blinkTimeout = setTimeout(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
      nextBlink(setBlink);
    }, THREE.MathUtils.randInt(1000, 5000));
  
    return blinkTimeout;
  };
  
  export function updateFacialMorphTargets(scene, nodes, facialExpression, setupMode, set, facialExpressions) {
    Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
      if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') return;
      const mapping = facialExpressions[facialExpression];
      const value = mapping && mapping[key] ? mapping[key] : 0;
      lerpMorphTarget(scene, key, value, 0.1, setupMode, set);
    });
  }
  
  export function handleBlinking(scene, blink, winkLeft, winkRight, setupMode, set) {
    lerpMorphTarget(scene, 'eyeBlinkLeft', blink || winkLeft ? 1 : 0, 0.5, setupMode, set);
    lerpMorphTarget(scene, 'eyeBlinkRight', blink || winkRight ? 1 : 0, 0.5, setupMode, set);
  }
  
  export function updateLipSync(scene, lipsync, audio, corresponding, setupMode, set) {
    if (setupMode) return;
  
    const appliedMorphTargets = [];
    const currentAudioTime = audio?.currentTime || 0;
  
    lipsync?.mouthCues?.forEach((cue) => {
      if (currentAudioTime >= cue.start && currentAudioTime <= cue.end) {
        appliedMorphTargets.push(corresponding[cue.value]);
        lerpMorphTarget(scene, corresponding[cue.value], 1, 0.2, setupMode, set);
      }
    });
  
    Object.values(corresponding).forEach((value) => {
      if (!appliedMorphTargets.includes(value)) {
        lerpMorphTarget(scene, value, 0, 0.1, setupMode, set);
      }
    });
  }
  
  