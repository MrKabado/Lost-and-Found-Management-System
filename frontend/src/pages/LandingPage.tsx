import { ArrowRight, CheckCircle2, ClipboardCheck, Search, ShieldCheck } from "lucide-react"
import { Link } from "react-router"

const steps = [
  {
    number: "01",
    title: "Report it",
    text: "Add the details that make a missing item recognizable, from where it was last seen to a clear description.",
    icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Search calmly",
    text: "Browse verified reports with useful filters instead of chasing scattered posts and message threads.",
    icon: Search,
  },
  {
    number: "03",
    title: "Return with proof",
    text: "Submit a claim with context and optional proof so the right owner can be reunited with their item.",
    icon: ShieldCheck,
  },
]

const highlights = [
  "One place for lost and found reports",
  "Clear claim review and status updates",
  "Private accounts for every report",
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F6F3EC] text-[#1B2430]">
      <section className="relative min-h-[680px] overflow-hidden bg-[#1B2430]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=2200&q=85)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#1B2430_5%,rgba(27,36,48,.86)_42%,rgba(27,36,48,.28)_100%)]" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-[#F6F3EC]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3963E] text-lg font-bold text-[#1B2430]">L</span>
              <span>
                <span className="block font-sans text-xl font-semibold tracking-tight">Lost&Found</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#D5D0C8]">Recovery system</span>
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login" className="hidden text-[#F6F3EC] transition hover:text-[#E3963E] sm:inline">Sign in</Link>
              <Link to="/register" className="rounded-lg bg-[#E3963E] px-4 py-2.5 font-semibold text-[#1B2430] transition hover:bg-[#F1AD5F]">Create account</Link>
            </div>
          </nav>

          <div className="flex flex-1 items-center py-20 lg:max-w-3xl">
            <div>
              <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E3963E]"><span className="h-px w-8 bg-[#E3963E]" /> Make the way back easier</p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight text-[#F6F3EC] sm:text-7xl">The fastest way back to what matters.</h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#D5D0C8] sm:text-lg">A focused recovery space for reporting lost items, finding what has been turned in, and making claims with confidence.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E3963E] px-5 py-3 font-semibold text-[#1B2430] transition hover:bg-[#F1AD5F]">Start a report <ArrowRight size={17} /></Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-lg border border-[#7D8990] px-5 py-3 font-semibold text-[#F6F3EC] transition hover:border-[#F6F3EC]">Browse with an account</Link>
              </div>
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-3 border-t border-[#52606A] pt-5 text-sm text-[#D5D0C8] sm:grid-cols-3 sm:gap-6">
            <div><span className="block text-2xl font-semibold text-[#F6F3EC]">01</span><span>Report clearly</span></div>
            <div><span className="block text-2xl font-semibold text-[#F6F3EC]">02</span><span>Search simply</span></div>
            <div><span className="block text-2xl font-semibold text-[#F6F3EC]">03</span><span>Reconnect safely</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C97A28]">A better handoff</p>
            <h2 className="max-w-md font-serif text-4xl leading-tight text-[#1B2430] sm:text-5xl">Less noise. More useful details.</h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#5F5A50]">Lost&Found turns a stressful search into a simple sequence of useful actions, with the information you need in one place.</p>
            <ul className="mt-7 space-y-3">
              {highlights.map((highlight) => <li key={highlight} className="flex items-center gap-3 text-sm font-semibold text-[#26313F]"><CheckCircle2 size={18} className="text-[#3F6C63]" />{highlight}</li>)}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ number, title, text, icon: Icon }) => <article key={number} className="border-t-2 border-[#E3963E] pt-5"><div className="mb-8 flex items-center justify-between"><span className="text-xs font-bold tracking-[0.16em] text-[#C97A28]">{number}</span><Icon size={20} className="text-[#3F6C63]" /></div><h3 className="text-lg font-semibold text-[#1B2430]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#83796A]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#E7EEEC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-20">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6C63]">Ready when you are</p><h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-[#1B2430]">Start with one report. Help close the loop.</h2></div>
          <Link to="/register" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#1B2430] px-5 py-3 font-semibold text-[#F6F3EC] transition hover:bg-[#26313F]">Create your account <ArrowRight size={17} /></Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-[#83796A] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16"><span className="font-semibold text-[#1B2430]">Lost&Found</span><span>A clearer path from missing to found.</span></footer>
    </main>
  )
}
