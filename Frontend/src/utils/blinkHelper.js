import * as THREE from 'three';

export const handleBlink = (setBlink) => {
  let blinkTimeout;
  const nextBlink = () => {
    blinkTimeout = setTimeout(() => {
      setBlink(true);
      setTimeout(() => {
        setBlink(false);
        nextBlink();
      }, 200);
    }, THREE.MathUtils.randInt(1000, 5000));
  };
  nextBlink();
  return () => clearTimeout(blinkTimeout);
};
