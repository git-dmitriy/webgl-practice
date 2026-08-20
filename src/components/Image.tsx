import {Suspense, useRef, type HTMLAttributes, type MutableRefObject, type RefObject} from 'react'
import {
    UseCanvas,
    useScrollRig,
    useImageAsTexture,
    styles,
    type ScrollSceneChildProps,
} from '@14islands/r3f-scroll-rig'
import {ParallaxScrollScene} from '@14islands/r3f-scroll-rig/powerups'
import {Image as DreiImage, Circle} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {clamp} from 'three/src/math/MathUtils.js'
import {DoubleSide, type Mesh} from 'three'

type ImageProps = HTMLAttributes<HTMLDivElement> & {
    src: string
    parallaxSpeed?: number
}

type WebGLImageProps = Pick<ScrollSceneChildProps, 'scrollState' | 'scale'> & {
    imgRef: RefObject<HTMLImageElement | null>
}

type ImageShaderMaterial = {
    grayscale: number
    zoom: number
    opacity: number
}

export function Image({src, parallaxSpeed = 1, ...props}: ImageProps) {
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
                    <ParallaxScrollScene track={el as MutableRefObject<HTMLElement>} speed={parallaxSpeed}>
                        {(sceneProps: ScrollSceneChildProps) => (
                            <Suspense fallback={<LoadingIndicator scale={sceneProps.scale}/>}>
                                <WebGLImage imgRef={img} {...sceneProps} />
                            </Suspense>
                        )}
                    </ParallaxScrollScene>
                </UseCanvas>
            )}
        </>
    )
}

function WebGLImage({imgRef, scrollState, scale}: WebGLImageProps) {
    const ref = useRef<Mesh>(null)
    const texture = useImageAsTexture(imgRef as RefObject<HTMLImageElement>)

    useFrame(() => {
        const material = ref.current?.material
        if (!material || Array.isArray(material) || !('grayscale' in material)) return

        const shader = material as unknown as ImageShaderMaterial
        shader.grayscale = clamp(1 - scrollState.visibility ** 3, 0, 1)
        shader.zoom = 1 + scrollState.progress * 0.66
        shader.opacity = clamp(scrollState.viewport * 3, 0, 1)
    })

    return (
        <DreiImage
            ref={ref}
            texture={texture}
            transparent
            scale={[scale.x, scale.y]}
        />
    )
}

function LoadingIndicator({scale}: { scale: vec3 }) {
    const box = useRef<Mesh>(null)

    useFrame(({clock}) => {
        if (box.current) {
            box.current.rotation.y = clock.getElapsedTime() * 5
        }
    })

    return (
        <group scale={scale.xy.times(0.05).min()}>
            <Circle ref={box}>
                <meshNormalMaterial side={DoubleSide}/>
            </Circle>
            <Circle>
                <meshNormalMaterial side={DoubleSide}/>
            </Circle>
        </group>
    )
}
