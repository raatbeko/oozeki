import { Link, usePath, useTitle } from './router'
import { Header, Footer } from './components/Layout'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { GuidesList, GuidePage } from './pages/Guides'
import { Prompts } from './pages/Prompts'
import { Ji } from './pages/Ji'
import { guideBySlug } from './content/guides'
import { OrnamentBackground } from './components/OrnamentBackground'

function NotFound() {
  useTitle('Табылган жок')
  return (
    <main className="mx-auto grid max-w-xl place-items-center px-4 py-32 text-center">
      <p className="font-serif text-7xl font-bold text-accent">404</p>
      <p className="mt-4 text-lg">Мындай бет жок экен.</p>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-white">
        Башкы бетке
      </Link>
    </main>
  )
}

function Route({ path }: { path: string }) {
  if (path === '/') return <Home />
  if (path === '/start') return <Start />
  if (path === '/guides') return <GuidesList />
  if (path === '/prompts') return <Prompts />
  if (path === '/ji') return <Ji />
  const m = path.match(/^\/guides\/([\w-]+)$/)
  if (m) {
    const g = guideBySlug(m[1])
    if (g) return <GuidePage key={g.slug} guide={g} />
  }
  return <NotFound />
}

export default function App() {
  const path = usePath()
  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        Негизги бөлүккө өтүү
      </a>
      <OrnamentBackground />
      <Header path={path} />
      <div id="content">
        <Route path={path} />
      </div>
      <Footer />
    </>
  )
}
