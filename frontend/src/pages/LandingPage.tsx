import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Search,
  ShieldCheck,
} from "lucide-react"
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
    <main className="min-h-screen bg-[#F7F9FC] text-[#092354]">
      <section className="relative min-h-[680px] overflow-hidden bg-[#092354]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=2200&q=85)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#092354_5%,rgba(9,35,84,.86)_42%,rgba(9,35,84,.28)_100%)]" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col px-6 pt-6 pb-12 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-white">
              <img src="/school/logo.png" alt="Cordova Public College" className="h-11 w-11 rounded-full object-cover" />
              <span>
                <span className="block font-sans text-xl font-semibold tracking-tight">
                  CPC Item Desk
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-[#C8D5E8] uppercase">
                  Cordova Public College
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link
                to="/login"
                className="hidden text-white transition hover:text-[#D9B85A] sm:inline"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#D9B85A] px-4 py-2.5 font-semibold text-[#092354] transition hover:bg-[#E7CC7B]"
              >
                Create account
              </Link>
            </div>
          </nav>

          <div className="flex flex-1 items-center py-20 lg:max-w-3xl">
            <div>
              <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#D9B85A] uppercase">
                <span className="h-px w-8 bg-[#D9B85A]" /> Campus item recovery
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight text-white sm:text-7xl">
                A clearer way to find what belongs on campus.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#D5D0C8] sm:text-lg">
                The official Cordova Public College space for reporting lost items,
                checking found reports, and making verified claims.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D9B85A] px-5 py-3 font-semibold text-[#092354] transition hover:bg-[#E7CC7B]"
                >
                  Start a report <ArrowRight size={17} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-[#AFC0D9] px-5 py-3 font-semibold text-white transition hover:border-white"
                >
                  Browse with an account
                </Link>
              </div>
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-3 border-t border-[#52606A] pt-5 text-sm text-[#D5D0C8] sm:grid-cols-3 sm:gap-6">
            <div>
              <span className="block text-2xl font-semibold text-white">
                01
              </span>
              <span>Report clearly</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-white">
                02
              </span>
              <span>Search simply</span>
            </div>
            <div>
              <span className="block text-2xl font-semibold text-white">
                03
              </span>
              <span>Reconnect safely</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#9A7410] uppercase">
              Built for the CPC community
            </p>
            <h2 className="max-w-md font-serif text-4xl leading-tight text-[#092354] sm:text-5xl">
              Less searching. More useful details.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#5F5A50]">
              CPC Item Desk turns a stressful search into a simple sequence of
              useful actions, with the information you need in one place.
            </p>
            <ul className="mt-7 space-y-3">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-center gap-3 text-sm font-semibold text-[#26313F]"
                >
                  <CheckCircle2 size={18} className="text-[#0B2A6F]" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ number, title, text, icon: Icon }) => (
              <article
                key={number}
                className="border-t-2 border-[#D9B85A] pt-5"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#9A7410]">
                    {number}
                  </span>
                  <Icon size={20} className="text-[#0B2A6F]" />
                </div>
                <h3 className="text-lg font-semibold text-[#092354]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#83796A]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8EEF7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#0B2A6F] uppercase">
              A little help goes a long way
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-[#092354]">
              Start with one report and help close the loop.
            </h2>
          </div>
          <Link
            to="/register"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#092354] px-5 py-3 font-semibold text-white transition hover:bg-[#0B2A6F]"
          >
            Create your account <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-[#83796A] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <span className="font-semibold text-[#092354]">CPC Item Desk</span>
        <span>A trusted path from missing to found at Cordova Public College.</span>
      </footer>
    </main>
  )
}
