import { useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export const useAvatarAnimations = (animations, group) => {
  const { actions, mixer } = useAnimations(animations, group);

  const setAnimation = (animation) => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation]?.fadeOut(0.5);
  };

  useEffect(() => {
    const idleAnimation = animations.find((a) => a.name === 'idle')?.name || animations[0]?.name;
    setAnimation(idleAnimation);
  }, [animations]);

  return { actions, setAnimation };
};
