import {Suspense, useRef} from 'react'
import {GlobalCanvas, SmoothScrollbar} from '@14islands/r3f-scroll-rig'
import {Environment, Loader} from '@react-three/drei'
import {BodyCopy, Headline, Subtitle} from './components/Text'
import {Image} from './components/Image'
import {ImageCube} from './components/ImageCube'
import {Lens} from './components/Lens'
import {SiteHeader} from './components/SiteHeader'
import {SiteFooter} from './components/SiteFooter'

export default function App() {
    const eventSource = useRef<HTMLDivElement>(null)

    return (
        <div ref={eventSource}>
            <SiteHeader/>
            <GlobalCanvas
                debug={false}
                scaleMultiplier={0.01}
                eventSource={eventSource}
                eventPrefix="client"
                flat
                camera={{fov: 14}}
                style={{pointerEvents: 'none'}}
            >
                {(globalChildren) => (
                    <Lens>
                        <Suspense fallback={null}>
                            <Environment files="env/empty_warehouse_01_1k.hdr"/>
                            {globalChildren}
                        </Suspense>
                    </Lens>
                )}
            </GlobalCanvas>
            <SmoothScrollbar
                enabled
                disablePointerOnScroll={false}
                config={{syncTouch: true}}
            />
            <article>
                <header className="container">
                    <div className="hero">
                        <Headline as="h2" wobble>
                            ALPINE REFRACTION
                        </Headline>
                        <BodyCopy as="p" className="hero__lede">
                            Grey rock, a green slope, a waterfall, snow. Move the
                            cursor: the lens refracts the pixels under it.
                        </BodyCopy>
                    </div>
                </header>
                <section className="container">
                    <Image src="images/mountain-grey.jpg" className="figure-landscape"/>
                </section>
                <section className="container">
                    <h3>
                        <Subtitle>The page is still HTML and CSS.</Subtitle>
                        <em>
                            <Subtitle>
                                WebGL only tracks those blocks and draws a copy.
                            </Subtitle>
                        </em>
                    </h3>
                    <BodyCopy as="p">
                        Scroll to keep the photos in place. The canvas sits on top
                        so the lens can bend the image, not the markup.
                    </BodyCopy>
                </section>
                <section className="pair">
                    <Image
                        src="images/mountain-green.jpg"
                        className="figure-narrow"
                        parallaxSpeed={1.08}
                    />
                    <Image
                        src="images/waterfall.jpg"
                        className="figure-wide"
                        parallaxSpeed={0.92}
                    />
                </section>
                <section className="container">
                    <BodyCopy as="p" className="lede">
                        The snow-capped mountain photo is a box.
                        Scroll faster and the mesh wiggles with scroll velocity.
                    </BodyCopy>
                </section>
                <section>
                    <ImageCube src="images/mountain-snow.jpg" className="figure-cube"/>
                </section>
                <section className="pair">
                    <Image
                        src="images/mountain-trees-landscape.jpg"
                        className="figure-wide"
                        parallaxSpeed={0.92}
                    />
                    <Image
                        src="images/mountain-trees-portrait.jpg"
                        className="figure-narrow"
                        parallaxSpeed={1.08}
                    />
                </section>
                <section className="container">
                    <h3>
                        <Subtitle>A demo project exploring progressive WebGL enhancement:</Subtitle>
                        <em>
                            <Subtitle>
                                scroll-bound images,
                                parallax, and a refracting lens over alpine photography.
                            </Subtitle>
                        </em>
                    </h3>
                    <BodyCopy as="p">
                        React Three Fiber, r3f-scroll-rig, and a transmission lens
                        over Unsplash mountain photos.
                    </BodyCopy>
                </section>
                <SiteFooter/>
            </article>
            <Loader
                containerStyles={{
                    background: 'transparent',
                    top: 'auto',
                    bottom: 0,
                    height: '5px',
                }}
                innerStyles={{background: 'white', width: '100vw', height: '5px'}}
                barStyles={{background: '#8b5a3c', height: '100%'}}
            />
        </div>
    )
}
