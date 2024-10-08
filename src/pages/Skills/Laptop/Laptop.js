import * as THREE from 'three'
import { forwardRef, useEffect,  useState} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF, SoftShadows, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import useRefs from 'react-use-refs'
import { skillsList } from '../skillsList'


const rsqw = (t, delta = 0.1, a = 1, f = 1 / (2 * Math.PI)) => (a / Math.atan(1 / delta)) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)

export function Laptop({ ...props }) {
    const scroll = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  const [group, mbp16, mbp14, keyLight, stripLight, fillLight, right] = useRefs()
  const [textureRed, textureBlue] = useTexture(['/Chroma Red.jpg', '/Chroma Blue.jpg'])

  useFrame((state, delta) => {
    const r1 = scroll.range(0 / 4, 1 / 4)
    const r2 = scroll.range(1 / 4, 1 / 4)
    const r3 = scroll.visible(4 / 5, 1 / 5)

    //mbp14.current.rotation.x = Math.PI - (Math.PI / 2) * rsqw(r1) - r2 * 0
    //group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (-Math.PI / 1.45) * r2, 4, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (-Math.PI / 4) * r2, 4, delta)

    group.current.scale.x = group.current.scale.y = group.current.scale.z = THREE.MathUtils.damp(group.current.scale.z, 1 + 0.24 * (1 - rsqw(r1)), 4, delta)
    keyLight.current.position.set(0.25 + -15 * (1 - r1), 4 + 11 * (1 - r1), 3 + 2 * (1 - r1))
   // left.current?.classList.toggle('show', r3)
    right.current?.classList.toggle('show', r3)
  })
  return (
    <>
      <spotLight position={[0, -width * 0.7, 0]} intensity={0.5} />
      <directionalLight ref={keyLight} castShadow intensity={6}>
        <orthographicCamera attachObject={['shadow', 'camera']} args={[-10, 10, 10, -10, 0.5, 30]} />
      </directionalLight>
      <group ref={group} position={[8, -height / 1.5, -5]} scale={0.5} {...props}>
        <spotLight ref={stripLight} position={[width * 2.5, 0, width]} angle={0.19} penumbra={1} intensity={0.25} />
        <spotLight ref={fillLight} position={[0, -width / 2.4, -width * 2.2]} angle={0.2} penumbra={1} intensity={2} distance={width * 3} />

        {/* <M1 ref={mbp14} texture={textureBlue} scale={width / 77} rotation={[0, Math.PI/2, 0]} position={[0, 0, 0]}> */}
        <M1 ref={mbp14} texture={textureBlue} scale={width / 77} rotation={[0, 0, 0]} position={[0, 0, 0]}>
          <Tag position={[0, 11, -11.5]} scale={1.4}  rotation={[0,0,0]}  {...props}/>
        </M1>
      </group>
    </>
  )
}




const M1 = forwardRef(({ texture, children, ...props }, ref) => {
    const { nodes, materials } = useGLTF('/models/mbp-v1-pipe.glb')
    return (
      <group {...props} dispose={null}>
        <group ref={ref} position={[0, -0.43, -11.35]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.back_1.geometry} material={materials.blackmatte} />
          <mesh receiveShadow castShadow geometry={nodes.back_2.geometry} material={materials.aluminium} />
          <mesh geometry={nodes.matte.geometry}>
            <meshLambertMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
        {children}
        <mesh geometry={nodes.body_1.geometry} material={materials.aluminium} material-color="#aaaaaf" material-envMapIntensity={0.2} />
        <mesh geometry={nodes.body_2.geometry} material={materials.blackmatte} />
      </group>
    )
  })
  
  const Tag = forwardRef(({ head, stat, expl, ...props }, ref) => {
    const { gl } = useThree();
    return (
        <Html {...props} style={{ userSelect: 'none' }} castShadow receiveShadow occlude="blending" transform portal={{ current: gl.domElement.parentNode }}>
          <iframe title="embed" width={850} height={550} src={skillsList[props.pageNum].websiteUrl} frameBorder={0} />
        </Html>
    )
  })
  