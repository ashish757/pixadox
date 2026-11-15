import {
    ArrowDown,
    Check,
    FileImage,
    LockKeyhole,
    Monitor,
    Sparkles,
} from 'lucide-react'

import {Link} from 'react-router-dom'


import "./landingPage.css";


function LandingPage() {

    return (
        <main className="min-h-screen overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 bg-grid opacity-50" />


            <section id="top" className="min-h-screen flex flex-col items-center justify-center">

                <div className={"mt-auto"}/>
                    <h1 className="text-balance font-mono text-5xl font-bold leading-[1.02] tracking-[0.6em] sm:text-7xl lg:text-[5.8rem]">
                        PIXA<span className="text-primary">DOX</span>
                    </h1>
                    <p className="mt-7 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                        Pixadox embeds secret text inside PNG images by shifting the smallest possible detail in their pixels, invisible to the human eye.
                    </p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Link to="/upload-encode" className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_var(--color-primary)] shadow-lg">
                            Encode image (text, doc, audio, image)
                        </Link>
                        <Link to="/upload-decode" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border/80 bg-card px-8 py-4 text-base font-bold transition-all hover:border-primary/30 hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md">
                            Decode  image
                        </Link>
                    </div>


                    <div className="mt-10 flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-primary" /> no uploads</span><span className="h-3 w-px bg-border" /><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> No Data loss in image</span>
                    </div>

                <div className="mt-6 w-full pl-4 text-center mt-auto">
                    <a href="#how-it-works" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        scroll down to see the method <ArrowDown className="h-5 w-5" />
                    </a>
                </div>

            </section>





            <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28 min-h-screen">
                <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">The method</p>
                        <h2 className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                            Steganography
                        </h2>
                    </div>
                    <p className="max-w-sm leading-7 text-muted-foreground">
                        Pixadox manipulates the pixel on client. <br/> Your secret and images never reaches  server.
                    </p>
                </div>
                <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
                    <Feature icon={<FileImage />} title="Choose a PNG Image" text="Upload the image directly from your device. Image stays on device." />
                    <Feature icon={<Sparkles />} title="Choose A Message" text="Your secreset gets encoded into the image, which only pixadox can decode with you entering the password the dicphier the data." />
                    <Feature icon={<Monitor />} title="Share the image" text="The result looks exactly the same. Only Pixadox knows the difference." />
                </div>
            </section>

        </main>
    )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="bg-card p-7 sm:p-9"><div className="mb-12 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">{icon}</div><h3 className="font-mono text-lg font-bold">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p></article> }



export default LandingPage

