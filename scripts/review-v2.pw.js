// Playwright CLI evaluates this file as an expression.
// eslint-disable-next-line no-unused-expressions
async (page) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('http://localhost:3019/?v=mais-odonto-02')
  await page.locator('.hero__photo').evaluate(image => image.decode())
  const widths = []
  for (const width of [360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 })
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.mouse.click(3, 3)
    const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }))
    widths.push({ viewport: width, ...size })
    if (size.scrollWidth > size.width) throw new Error(`Horizontal overflow at ${width}`)
    if (width === 390 || width === 1440) {
      const label = width === 390 ? 'mobile-390' : 'desktop-1440'
      await page.screenshot({ path: `output/review-v2/${label}-hero.png` })
      for (const id of ['tratamentos', 'equipe', 'unidades']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded()
        await page.locator(`#${id}`).screenshot({ path: `output/review-v2/${label}-${id}.png`, style: '.site-header, .mobile-contact, .skip-link { visibility: hidden; }' })
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.locator('.hero .unit-choice').getByText('Centro', { exact: true }).click()
  if (!(await page.locator('.hero .action').getAttribute('href')).includes('5548998088800')) throw new Error('Centro WhatsApp mismatch')
  await page.locator('.hero .unit-choice').getByText('Rio Maina', { exact: true }).click()
  if (!(await page.locator('.hero .action').getAttribute('href')).includes('5548988616963')) throw new Error('Rio Maina WhatsApp mismatch')
  await page.getByRole('tab', { name: 'Próteses dentárias', exact: true }).click()
  await page.getByRole('tab', { name: 'Próteses dentárias', exact: true }).press('ArrowLeft')
  if (await page.getByRole('tab', { name: 'Implantes', exact: true }).getAttribute('aria-selected') !== 'true') throw new Error('Treatment keyboard failed')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click()
  await page.locator('#main-nav a').last().press('Tab')
  if (!(await page.locator('#main-nav a').first().evaluate(el => el === document.activeElement))) throw new Error('Menu focus trap failed')
  await page.keyboard.press('Escape')
  if (await page.getByRole('button', { name: 'Abrir menu', exact: true }).getAttribute('aria-expanded') !== 'false') throw new Error('Menu Escape failed')
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Abrir menu')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await page.locator('.hero__photo').evaluate(image => image.decode())
  await page.screenshot({ path: 'output/review-v2/mobile-reduced-motion.png' })
  const reduced = await page.evaluate(() => ({ preference: matchMedia('(prefers-reduced-motion: reduce)').matches, photoTransform: getComputedStyle(document.querySelector('.hero__photo')).transform }))
  const images = await page.locator('img').evaluateAll(items => items.map(image => ({ src: image.currentSrc, loaded: image.complete && image.naturalWidth > 0 })))
  if (images.some(image => !image.loaded)) throw new Error('Image loading failed')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.evaluate(() => window.scrollTo(0, 0))
  console.log(JSON.stringify({ widths, unitContacts: 'passed', treatmentKeyboard: 'passed', menuKeyboard: 'passed', reduced, images, errors }))
}
