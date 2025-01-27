import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  Sky,
  useGLTF,
  Html, OrbitControls, Plane, Stars ,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";

const Pumpkin = (props) => {

  const { nodes, materials } = useGLTF(
    "/models/pumpkin.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
        position={[1.0, 0.3, 0.0]}
      />
    </group>
  );
};

const DynamicSky = () => {
  const [sunPosition, setSunPosition] = useState([5, 10, 5]); // Default day position
  const [turbidity, setTurbidity] = useState(8); // Default clear sky

  useEffect(() => {
    const updateSky = () => {
      const hour = new Date().getHours();

      if (hour < 6 || hour > 18) {
        // Night
        setSunPosition([0, -10, 0]); // Sun below the horizon
        setTurbidity(20); // High turbidity for a dark sky
      } else if (hour < 9 || hour > 15) {
        // Sunrise/Sunset
        setSunPosition([10, 5, -10]); // Low sun angle
        setTurbidity(10); // Softer light
      } else {
        // Daytime
        setSunPosition([5, 10, 5]); // High sun position
        setTurbidity(8); // Clearer sky
      }
    };

    updateSky(); // Run on initial render
    const interval = setInterval(updateSky, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return <Sky sunPosition={sunPosition} turbidity={turbidity} />;
};

useGLTF.preload(
  "/models/pumpkin.glb"
);

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] =
    useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(
        () => {
          setLoadingText(
            (loadingText) => {
              if (
                loadingText.length > 2
              ) {
                return ".";
              }
              return loadingText + ".";
            }
          );
        },
        800
      );
      return () =>
        clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text
        fontSize={0.14}
        anchorX={"left"}
        anchorY={"bottom"}
        position={[0.0, 0.1, 0.0]}
      >
        {loadingText}
        <meshBasicMaterial
          attach="material"
          color="white"
        />
      </Text>
    </group>
  );
};

// Add Infinite Floor Component
const Floor = () => {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]} // Rotate the plane to lie flat
      position={[0, 0, 0]} // Center the floor at the origin
    >
      <planeGeometry args={[1000, 1000]} /> {/* Huge size for infinite effect */}
      <meshStandardMaterial
        color="#90CAF9" // Very light blue
        metalness={0.05} // Minimal metallic effect for subtle gloss
        roughness={0.8} // Keep it matte-like
      />
    </mesh>
  );
};


export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={cameraControls} />
      <DynamicSky />
      {/* <Stcars radius={100} depth={50} count={5000} factor={4} saturation={0} /> */}
      <directionalLight castShadow position={[10, 10, 10]} intensity={1} />
      <Environment preset="park" />
      <Suspense fallback={<Html>Loading...</Html>}>
        <Dots />
        <Avatar />
        <Pumpkin />
      </Suspense>
      <Floor />
      <ContactShadows opacity={0.7} />
    </>
  );
};
