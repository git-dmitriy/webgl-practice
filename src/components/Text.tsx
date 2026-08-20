import {createElement, useRef, type ElementType, type HTMLAttributes, type MutableRefObject} from 'react'
import {ScrollScene, UseCanvas, useScrollRig, styles} from '@14islands/r3f-scroll-rig'
import {MeshDistortMaterial} from '@react-three/drei'
import {WebGLText} from '@14islands/r3f-scroll-rig/powerups'

type TextProps = HTMLAttributes<HTMLElement> & {
    children: React.ReactNode
    wobble?: boolean
    font?: string
    as?: ElementType
}

export function Headline({children, ...props}: Omit<TextProps, 'font'>) {
    return (
        <Text font="fonts/Poppins-Medium.woff" {...props}>
            {children}
        </Text>
    )
}

export function Subtitle({children, ...props}: Omit<TextProps, 'font'>) {
    return (
        <Text font="fonts/PlayfairDisplay-Italic.woff" {...props}>
            {children}
        </Text>
    )
}

export const BodyCopy = Text

export function Text({
     children,
     wobble,
     className,
     font = 'fonts/Poppins-Regular.woff',
     as: Tag = 'span',
     ...props
 }: TextProps) {
    const el = useRef<HTMLElement>(null)
    const {hasSmoothScrollbar} = useScrollRig()
    const domClassName = [styles.transparentColorWhenSmooth, className]
        .filter(Boolean)
        .join(' ')

    return (
        <>
            {createElement(
                Tag,
                {
                    ref: el,
                    className: domClassName,
                    style: {display: 'block'},
                    ...props,
                },
                children,
            )}
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene
                        track={el as MutableRefObject<HTMLElement>}
                        inViewportMargin="50%"
                    >
                        {(sceneProps) => (
                            <WebGLText
                                el={el as MutableRefObject<HTMLElement>}
                                font={font}
                                {...sceneProps}
                                {...{glyphGeometryDetail: 16}}
                            >
                                {wobble && <MeshDistortMaterial speed={1.4} distort={0.06}/>}
                                {children}
                            </WebGLText>
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </>
    )
}
