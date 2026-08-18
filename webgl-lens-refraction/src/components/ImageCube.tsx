import {useRef, type HTMLAttributes, type MutableRefObject, type RefObject} from 'react'
import {
    ScrollScene,
    UseCanvas,
    useScrollbar,
    useScrollRig,
    styles,
    useImageAsTexture,
    type ScrollSceneChildProps,
} from '@14islands/r3f-scroll-rig'
import {useFrame} from '@react-three/fiber'
import {MeshWobbleMaterial} from '@react-three/drei'
import {a, useSpring, config} from '@react-spring/three'
import type {Mesh} from 'three'

type ImageCubeProps = HTMLAttributes<HTMLDivElement> & {
    src: string
}

type WebGLCubeProps = ScrollSceneChildProps & {
    img: RefObject<HTMLImageElement | null>
}

type WobbleMaterial = Mesh['material'] & {
    factor: number
}

export function ImageCube({src, ...props}: ImageCubeProps) {
    const el = useRef<HTMLDivElement>(null)
    const img = useRef<HTMLImageElement>(null)
    const {hasSmoothScrollbar} = useScrollRig()

    return (
        <>
            <div ref={el} {...props}>
                <img
                    className={styles.hiddenWhenSmooth}
                    ref={img}
                    src={src}
                    loading="eager"
                    decoding="async"
                    alt=""
                />
            </div>
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el as MutableRefObject<HTMLElement>}>
                        {(sceneProps: ScrollSceneChildProps) => (
                            <WebGLCube img={img} {...sceneProps} />
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </>
    )
}

function WebGLCube({img, scale, inViewport}: WebGLCubeProps) {
    const mesh = useRef<Mesh>(null)
    const texture = useImageAsTexture(img as RefObject<HTMLImageElement>)
    const {scroll} = useScrollbar()

    useFrame(() => {
        const material = mesh.current?.material as WobbleMaterial | undefined
        if (!material) return

        material.factor += scroll.velocity * 0.005
        material.factor *= 0.95
    })

    const spring = useSpring({
        scale: inViewport ? scale.times(1) : scale.times(0),
        config: inViewport ? config.wobbly : config.stiff,
        delay: inViewport ? 200 : 0,
    })

    return (
        <a.mesh ref={mesh} {...spring}>
            <boxGeometry args={[1, 1, 0.5, 64, 64]}/>
            <MeshWobbleMaterial
                factor={0}
                speed={2}
                color="#fff"
                map={texture}
                roughness={0.14}
                metalness={0}
                transparent
                depthTest
                depthWrite={false}
            />
        </a.mesh>
    )
}
