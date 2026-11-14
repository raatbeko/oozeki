// Чат-жардамчы үчүн сайттын картасын api/_siteMap.ts файлына жазат.
// Vercel'дин функциясы src/ ичиндеги файлдарды импорттой албайт, ошон үчүн карта алдын ала даярдалат.
// Ишке түшүрүү: npm run sitemap (build'де да автомат иштейт)
import { writeFileSync } from 'node:fs'
import { buildSiteMap } from '../src/content/siteMap'

const out = `// АВТОМАТ ТҮЗҮЛГӨН ФАЙЛ — колго оңдобо. Жаңыртуу: npm run sitemap
export const SITE_MAP = ${JSON.stringify({ ky: buildSiteMap('ky'), ru: buildSiteMap('ru') }, null, 2)} as const
`
writeFileSync(new URL('../api/_siteMap.ts', import.meta.url), out)
console.log('api/_siteMap.ts жаңыртылды')
