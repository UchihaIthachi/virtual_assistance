import { useState } from 'react';

export const useAvatarState = () => {
  const [lipsync, setLipsync] = useState();
  const [audio, setAudio] = useState();
  const [facialExpression, setFacialExpression] = useState('');
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);

  return {
    lipsync, 
    setLipsync,
    audio,
    setAudio,
    facialExpression,
    setFacialExpression,
    blink,
    setBlink,
    winkLeft,
    setWinkLeft,
    winkRight,
    setWinkRight,
  };
};
