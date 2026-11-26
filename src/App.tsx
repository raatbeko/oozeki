import { Link, usePath, useTitle, focusHash } from './router'
import { Header, Footer } from './components/Layout'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { GuidesList, GuidePage } from './pages/Guides'
import { Prompts } from './pages/Prompts'
import { Ji } from './pages/Ji'
import { Sozduk } from './pages/Sozduk'
import { Konsultaciya } from './pages/Konsultaciya'
import { ReelsTemplate } from './pages/ReelsTemplate'
import { useEffect } from 'react'
import { useContent } from './content/useContent'
import { useTr } from './i18n'
import { OrnamentBackground } from './components/OrnamentBackground'
import { ChatWidget } from './components/ChatWidget'

function NotFound() {
  const tr = useTr()
  useTitle(tr('Табылган жок', 'Не найдено'))
  return (
    <main className="mx-auto grid max-w-xl place-items-center px-4 py-32 text-center">
      <p className="font-serif text-7xl font-bold text-accent">404</p>
      <p className="mt-4 text-lg">{tr('Мындай бет жок экен.', 'Такой страницы нет.')}</p>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-white">
        {tr('Башкы бетке', 'На главную')}
      </Link>
    </main>
  )
}

function Route({ path }: { path: string }) {
  const { guideBySlug } = useContent()
  if (path === '/') return <Home />
  if (path === '/start') return <Start />
  if (path === '/guides') return <GuidesList />
  if (path === '/prompts') return <Prompts />
  if (path === '/ji') return <Ji />
  if (path === '/sozduk') return <Sozduk />
  if (path === '/konsultaciya') return <Konsultaciya />
  if (path === '/reels-template') return <ReelsTemplate />
  const m = path.match(/^\/guides\/([\w-]+)$/)
  if (m) {
    const g = guideBySlug(m[1])
    if (g) return <GuidePage key={g.slug} guide={g} />
  }
  return <NotFound />
}

export default function App() {
  const path = usePath()
  const tr = useTr()
  // Шилтемеде #якорь болсо — бет чыккандан кийин ошого түшөбүз
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (id) focusHash(id)
  }, [path])
  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
        {tr('Негизги бөлүккө өтүү', 'Перейти к содержанию')}
      </a>
      <OrnamentBackground />
      <Header path={path} />
      <div id="content">
        <Route path={path} />
      </div>
      <Footer />
      <ChatWidget />
    </>
  )
}
