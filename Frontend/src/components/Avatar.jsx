import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { button, useControls } from 'leva'
import React, { useEffect, useRef, useState } from 'react'
import { useAvatarState } from '../hooks/useAvatarState';
import facialExpressions from '../constants/facialExpressions';
import corresponding from '../constants/corresponding';
import { lerpMorphTarget, nextBlink, updateFacialMorphTargets, handleBlinking, updateLipSync } from '../utils/animationHelpers'
import { useChat } from '../hooks/useChat'
import { AvatarMesh } from './AvatarMesh';


let setupMode = false

export function Avatar(props) {
  const { nodes, materials, scene } = useGLTF('/models/me.glb')

  const { message, onMessagePlayed, chat } = useChat()
  const {
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
  } = useAvatarState();

  useEffect(() => {
    if (!message) {
      setAnimation('idle')
      return
    }
    setAnimation(message.animation)
    setFacialExpression(message.facialExpression)
    setLipsync(message.lipsync)
    const audio = new Audio('data:audio/mp3;base64,' + message.audio)
    audio.play()
    setAudio(audio)
    audio.onended = onMessagePlayed
  }, [message])

  const { animations } = useGLTF('/models/animations.glb')

  const group = useRef()
  const { actions, mixer } = useAnimations(animations, group)
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === 'idle')
      ? 'idle'
      : animations[0].name // Check if Idle animation exists otherwise use first animation
  )

  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play()
    return () => actions[animation].fadeOut(0.5)
  }, [animation])

  useFrame(() => {
    if (!setupMode) {
      updateFacialMorphTargets(scene, nodes, facialExpression, setupMode, set, facialExpressions);
    }
  
    handleBlinking(scene, blink, winkLeft, winkRight, setupMode, set);
  
    if (!setupMode && lipsync) {
      updateLipSync(scene, lipsync, audio, corresponding, setupMode, set);
    }
  });


  useControls('FacialExpressions', {
    chat: button(() => chat()),
    winkLeft: button(() => {
      setWinkLeft(true)
      setTimeout(() => setWinkLeft(false), 300)
    }),
    winkRight: button(() => {
      setWinkRight(true)
      setTimeout(() => setWinkRight(false), 300)
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (value) => setAnimation(value),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => setFacialExpression(value),
    },
    enableSetupMode: button(() => {
      setupMode = true
    }),
    disableSetupMode: button(() => {
      setupMode = false
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {}
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach(
        (key) => {
          if (key === 'eyeBlinkLeft' || key === 'eyeBlinkRight') {
            return // eyes wink/blink are handled separately
          }
          const value =
            nodes.EyeLeft.morphTargetInfluences[
              nodes.EyeLeft.morphTargetDictionary[key]
            ]
          if (value > 0.01) {
            emotionValues[key] = value
          }
        }
      )
      console.log(JSON.stringify(emotionValues, null, 2))
    }),
  })

  const [, set] = useControls('MorphTarget', () =>
    Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map(
        (key) => {
          return {
            [key]: {
              label: key,
              value: 0,
              min: nodes.EyeLeft.morphTargetInfluences[
                nodes.EyeLeft.morphTargetDictionary[key]
              ],
              max: 1,
              onChange: (val) => {
                if (setupMode) {
                  lerpMorphTarget(key, val, 1)
                }
              },
            },
          }
        }
      )
    )
  )

  useEffect(() => {
    nextBlink()
    return () => clearTimeout(blinkTimeout)
  }, [])

  return (
    <group {...props} dispose={null} ref={group}>
      <AvatarMesh nodes={nodes} materials={materials} />
    </group>
  )
}

useGLTF.preload('/models/me.glb')
useGLTF.preload('/models/animations.glb')
