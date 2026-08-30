import {
    ArrowUpRight,
    ArrowDown,
    Check,
    FileImage,
    LockKeyhole,
    Monitor,
    Sparkles,
} from 'lucide-react'

import {Link} from 'react-router-dom'
import {
    Image as ImageIcon,
    Download,
    Eye,
    Upload,
    ArrowRight
} from 'lucide-react'


function FlowStep({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-[#013b20] shadow-sm">
                {icon}
            </div>
            <span className="text-center font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
        </div>
    )
}

function LandingPage() {

    return (
        <main className="min-h-screen overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 bg-grid opacity-50" />





            <section id="top" className="relative z-0 mx-auto grid max-w-7xl pt-20 items-center gap-4 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28">
                <div>
                    <div className={"flex items-center gap-2 mb-10 justify-center"}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
                            <span className="grid grid-cols-3 gap-0.5">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <span key={i} className={`h-1.5 w-1.5 rounded-[1px] ${[0, 2, 4, 8].includes(i) ? 'bg-primary' : 'bg-accent'}`} />)}
                            </span>
                        </span>
                        <span className="font-mono text-xl font-bold tracking-[0.18em]">Pixadox </span>
                    </div>

                    <h1 className="max-w-3xl text-balance font-mono text-5xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-7xl lg:text-[5.8rem]">
                        Hide in<br /><span className="text-primary">plain sight.</span>
                    </h1>
                    <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                        Pixadox embeds secret text inside PNG images by shifting the smallest possible detail in their pixels, invisible to the human eye.
                    </p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Link to="/upload-encode" className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_var(--color-primary)] shadow-lg">
                            Encode some data <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                        <Link to="/upload-decode" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border/80 bg-card px-8 py-4 text-base font-bold transition-all hover:border-primary/30 hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md">
                            Decode an image <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="mt-6 pl-4">
                        <a href="#how-it-works" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Or scroll down to see the method <ArrowDown className="h-5 w-5" />
                        </a>
                    </div>
                    <div className="mt-10 flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-primary" /> no uploads</span><span className="h-3 w-px bg-border" /><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" /> No Data loss in image</span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
                    <div className="flex flex-col gap-10 rounded-[2rem] border-2 border-dashed border-[#013b20]/20 p-8 sm:p-10">

                        <div className="relative flex w-full flex-col">
            <span className="absolute -left-12 top-1/2 -rotate-90 -translate-y-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#013b20]">
                Encode
            </span>
                            <div className="flex w-full items-center justify-between">
                                <FlowStep icon={<ImageIcon size={20} />} label="Upload a PNG" />
                                <ArrowRight size={16} className="text-muted-foreground/50" strokeWidth={3} />
                                <FlowStep icon={<LockKeyhole size={20} />} label="Hide Your Data" />
                                <ArrowRight size={16} className="text-muted-foreground/50" strokeWidth={3} />
                                <FlowStep icon={<Download size={20} />} label="Download Encoded Image" />
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>

                        <div className="relative flex w-full flex-col">
            <span className="absolute -left-12 top-1/2 -rotate-90 -translate-y-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#013b20]">
                Decode
            </span>
                            <div className="flex w-full items-center justify-center gap-12">
                                <FlowStep icon={<Upload size={20} />} label="Upload a Encoded Image" />
                                <ArrowRight size={16} className="text-muted-foreground/50" strokeWidth={3} />
                                <FlowStep icon={<Eye size={20} />} label="Extract Your Data" />
                            </div>
                        </div>

                    </div>
                </div>

            </section>


            <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
                <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">The method</p>
                        <h2 className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                            Smallest change.
                        </h2>
                    </div>
                    <p className="max-w-sm leading-7 text-muted-foreground">
                        Pixadox works at the pixel level, not the network level. That means your secret never reaches a serve.
                    </p>
                </div>
                <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
                    <Feature icon={<FileImage />} title="Choose a PNG Image" text="Upload the image directly from your device. Image stays on device." />
                    <Feature icon={<Sparkles />} title="Choose A Message" text="Your secreset gets encoded into the image, which only pixadox can see (password protection comming soon)." />
                    <Feature icon={<Monitor />} title="Share the image" text="The result looks exactly the same. Only Pixadox knows the difference." />
                </div>
            </section>

        </main>
    )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="bg-card p-7 sm:p-9"><div className="mb-12 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">{icon}</div><h3 className="font-mono text-lg font-bold">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p></article> }



export default LandingPage