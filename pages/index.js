import { Flex, Text, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Link } from "@chakra-ui/react";
import Head from "next/head";

import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import React, { useRef, useEffect, useState, Suspense } from "react";
import "../styles/App.scss";
import { Section } from "../components/section";
import state from "../components/state";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useProgress, useGLTFLoader } from "drei";
import { a, useTransition } from "@react-spring/web";
import { useInView } from "react-intersection-observer";




const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  );
};

const HTMLContent = ({
  domContent,
  children,
  bgColor,
  modelPath,
  positionx,
  positiony,
  positionz,
  scale_value,
  caroffset,
}) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.005));
  const [refItem, inView] = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView, bgColor]);
  return (
    <Section factor={1.5} offset={0.7}>
      <group position={[positionx, positiony, positionz]} scale={[scale_value,scale_value,scale_value]}>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className='container'>
            <h1 className='title'>{children}</h1>
          </div>
        </Html>
        <mesh ref={ref} position={[0, -250-caroffset, 0]}>
          <Model url={modelPath} />
        </mesh>
      </group>
    </Section>
  );
};

function Loader() {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className='loading' style={{ opacity }}>
          <div className='loading-bar-container'>
            <a.div className='loading-bar' style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
  );
}

export default function Home() {
  const {isAuthenticated, user, isAuthenticating, authenticate, logout, isLoggingOut} = useMoralis()
  const [events] = useState();
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);


  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Login | Dashboard3</title>
        </Head>
        <Flex direction="column" justifyContent="center" alignItems="center" width="100vw" height="100vh">
          <Text fontSize="5xl" fontWeight="bold" color="navy">Welcome to MetaRent</Text>
          
          <Button colorScheme="twitter" size="lg" mt="6" onClick={() => authenticate({
            signingMessage: "Require your signature for MetaRent"
          })} disabled={isAuthenticating}>Login with Metamask</Button>
        </Flex>
      </>
    )
  }
  return (
    <>
    <Head>
      <title>MetaRent</title>
    </Head>
    <Flex direction="column" width="100vw" height="100vh">
      <Header isAuthenticated={isAuthenticated} isAuthenticating={isAuthenticating} user={user} authenticate={authenticate} logout={logout} isLoggingOut={isLoggingOut} />
  
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [0, 0, 150], fov: 70 }}
        >
        {/* Lights Component */}
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent
            domContent={domContent}
            bgColor='#f15946'
            modelPath='/chevrolet.gltf'
            positionx={0}
            positiony={250}
            positionz={-50}
            caroffset={200}
            scale_value={0.3}>
            <span>Chevrolet</span>
            <span>Corvette (C7)</span>
            <button className="button"> Book Me!!!</button>

          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#571ec1'
            modelPath='/nissan.gltf'
            positionx={0}
            positiony={0}
            positionz={-50}
            caroffset={900}
            scale_value={0.12}>
            <span>Nissan</span>
            <span>Skyline GT-R(C110) Kenmeri</span>
            <button className="button"> Book Me!!!</button>

          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor='#636567'
            modelPath='/toyota.gltf'
            positionx={0}
            positiony={-250}
            positionz={-50}
            caroffset={0}
            scale_value={0.55}>
            <span>Toyota</span>
            <span>AE86 Black Limited Kouki</span>
            
          <button className="button"> Book Me!!!</button>


          </HTMLContent>
        </Suspense>
      </Canvas>
      <Loader />
      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={onScroll}
        {...events}>
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100 - 10}vh` }} />
      </div>
  
    </Flex>
   </>
  )
}