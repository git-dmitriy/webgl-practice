import {useRef, useState, type ReactNode} from 'react'
import * as THREE from 'three'
import {createPortal, useFrame, useThree} from '@react-three/fiber'
import {useFBO, useGLTF, MeshTransmissionMaterial} from '@react-three/drei'
import {easing} from 'maath'

const SCENE_BG = '#ede6da'
const FBO_RENDER_PRIORITY = 2

type LensGLTF = {
    nodes: {
        Cylinder: THREE.Mesh
    }
}

type LensProps = {
    children: ReactNode
    damping?: number
}

export function Lens({children, damping = 0.14}: LensProps) {
    const ref = useRef<THREE.Mesh>(null)
    const {nodes} = useGLTF('/glb/lens-transformed2.glb') as unknown as LensGLTF
    const buffer = useFBO()
    const viewport = useThree((state) => state.viewport)
    const [scene] = useState(() => new THREE.Scene())

    useFrame((state, delta) => {
        const currentViewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 1])

        if (ref.current) {
            easing.damp3(
                ref.current.position,
                [
                    (state.pointer.x * currentViewport.width) / 2,
                    (state.pointer.y * currentViewport.height) / 2,
                    1,
                ],
                damping,
                delta,
            )
        }

        state.gl.setRenderTarget(buffer)
        state.gl.setClearColor(SCENE_BG)
        state.gl.render(scene, state.camera)
        state.gl.setRenderTarget(null)
    }, FBO_RENDER_PRIORITY)

    return (
        <>
            {createPortal(children, scene)}
            <mesh scale={[viewport.width, viewport.height, 1]}>
                <planeGeometry/>
                <meshBasicMaterial map={buffer.texture}/>
            </mesh>
            <mesh
                scale={Math.min(viewport.width, viewport.height) * 0.14}
                ref={ref}
                rotation-x={Math.PI / 2}
                geometry={nodes.Cylinder.geometry}
            >
                <MeshTransmissionMaterial
                    buffer={buffer.texture}
                    ior={1.14}
                    thickness={1.4}
                    anisotropy={0.14}
                    chromaticAberration={0.14}
                    distortion={0.14}
                    distortionScale={1.4}
                    temporalDistortion={0.14}
                />
            </mesh>
        </>
    )
}

useGLTF.preload('/glb/lens-transformed2.glb')
