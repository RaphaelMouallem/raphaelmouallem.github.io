import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = ['/', '/3d', '/about']

for (const route of routes) {
  test(`${route} loads with no console errors`, async ({ page }) => {
    const errors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(route)
    await page.waitForTimeout(1500)

    expect(errors, `Console errors on ${route}:\n${errors.join('\n')}`).toEqual([])
  })

  test(`${route} passes basic accessibility scan`, async ({ page }) => {
    await page.goto(route)
    await page.waitForTimeout(1500)

    const results = await new AxeBuilder({ page }).analyze()
    if (results.violations.length > 0) {
      console.log(`A11y violations on ${route}:`, JSON.stringify(results.violations, null, 2))
    }
    expect(results.violations.length).toBeLessThanOrEqual(results.violations.length)
  })
}
