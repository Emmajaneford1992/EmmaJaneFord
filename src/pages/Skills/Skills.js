import { Html, Float, GradientTexture, MeshPortalMaterial, PresentationControls, Svg, Text, useScroll } from '@react-three/drei';
import { extend, useFrame, useThree  } from '@react-three/fiber';
import { geometry } from 'maath';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { skillsList } from './skillsList';
import { useSpring } from '@react-spring/core'
import { suspend } from 'suspend-react';
import '../../util';


import {Laptop} from './Laptop/Laptop'

import { HandPrompt } from '../../components/HandPrompt';
import { Dots } from '../../components/Dots';
import WobblyBlob from '../../components/WobblyBlob';
import { Arrows } from '../../components/Arrows';


const bold = import('@pmndrs/assets/fonts/inter_bold.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

extend(geometry)

export default function Skills({...props}) {
  const [{ background, fill }, set] = useSpring({ background: '#f0f0f0', fill: '#202020' }, [])

  return (
    <>
      <PresentationControls snap global zoom={0.8} rotation={[0, 0, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 9, Math.PI / 9]}>
        <group position={[-2,2,-5]}>
          <Float floatIntensity={3} rotationIntensity={0.5}>
            <Laptop  {...props}/>
            <Dots   {...props} numOfPages={props.numOfPages} positionY={-3.7} handleClick={props.updateScroll}/>
            <Arrows {...props} positionX={1.9} positionY={-3.7} handleClick={props.arrowClicked}/>
            <Title {...props}/>
          </Float>
          <Rig rotation={[0, 0, 0]} scale = {0.32} position={[0,0,0]} {...props}>
              <WobblyBlob {...props}  opacity={1} colour={skillsList[props.pageNum].hex} scale={5} scaleHover={6}/>
              <Carousel {...props} />
          </Rig>
          <HandPrompt {...props} position={[1,-3.5,3]}/>
        </group>
      </PresentationControls>
    </>
  )
}

export function Rig({...props}) {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.z = -(props.pageNumFlt) * (Math.PI / 4.5) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    state.camera.lookAt(0, 0, 0) // Look at center
  })
  return <group ref={ref} {...props} />
}

export function Carousel({...props}) {
  const radius = 8;
  const count = 9;
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      num = {i}
      count = {count}
      radius = {radius}
      pos={[Math.sin(((i-3) / count) * Math.PI * 2) * -radius,  Math.cos(((i-3) / count) * Math.PI * 2) * radius,0]}
      rot={[0, 0, 0]}
      pageNum={props.pageNum}
      pageNumFlt = {props.pageNumFlt}
      numOfPages = {props.numOfPages}
    />
  ))
}

function Card({rot = [0,0,0], pos =[0,0,0],  ...props }){
  const groupRef = useRef();

  const [cardNum, setCardNum] = useState(0);
  const [url, setUrl] = useState('');
  const [opacity, setOpacity] = useState(0)
  const [title, setTitle] = useState('');
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);

  useFrame((state, delta) => {
    let cNum = (Math.floor(((props.pageNum+4.5) - props.num)/ props.count) * props.count) + props.num;
    cNum = cNum < 0 ?  cNum + props.numOfPages :  cNum = cNum > props.numOfPages -1 ? cNum - props.numOfPages : cNum
    if(props.pageNum == cNum){
    //console.log('cNum: ',cNum, 'title: ',skillsList[cNum].title,  'url ', skillsList[cNum].websiteUrl );
    }


    // let cNum = (Math.floor(((props.pageNum+4.5) - props.num)/ props.count) * props.count) + props.num;
    // cNum = cNum > props.numOfPages ? cNum - props.numOfPages : cNum < 1 ?  cNum + props.numOfPages : cNum;
    groupRef.current.rotation.z = (props.pageNumFlt) * (Math.PI / 4.5);
   
    let op = Math.abs(((((props.pageNumFlt) - props.num + props.count) % props.count) /props.count)-0.5)*3-0.5;
    setOpacity( op )
    setCardNum(cNum)
    setUrl(skillsList[cNum].url);
  })
  return (

    <group ref ={groupRef} position={pos} rotation={rot} scale={2}>    
      <mesh position={[0,0,-0.2]} url={url} >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial attach="material" map={texture} transparent={true} opacity={opacity} side={THREE.FrontSide}/>
      </mesh>
    </group>

  )
}

function Title({...props}) {
  const { gl } = useThree();
  const [styles, setStyles] = useState(null);
  useFrame((state, delta) => {
    setStyles({ transform: 'translateX(-'+((props.pageNumFlt)*100)+'px)'  })
  })
  return (
      <Html transform portal={{ current: gl.domElement.parentNode }}>
        <div className='titleScroll'>
          <div className='titleScrollSlider' style={styles}>
            {skillsList.map((skill, i) => (
              <h1 key={skill.id}>{skillsList[i].title}</h1>
            ))}
          </div>
        </div>
      </Html>
  )
}


// export function Lists() {
//   return Array.from({ length: 17 }, (_, i) => (
//     <h1>{skillsList[i+1].title}</h1>
//   ))
// }