const LANG_LABELS = {
  cpp: 'C++',
  python: 'Python',
  javascript: 'JavaScript',
  jsx: 'JSX',
  typescript: 'TypeScript',
  tsx: 'TSX',
  bash: 'Bash',
  json: 'JSON',
  glsl: 'GLSL',
  text: 'Text',
}

const SVG_NS = 'http://www.w3.org/2000/svg'

function buildIcon(kind) {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '14')
  svg.setAttribute('height', '14')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.75')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')

  switch (kind) {
    case 'copy': {
      const rect = document.createElementNS(SVG_NS, 'rect')
      rect.setAttribute('x', '9')
      rect.setAttribute('y', '9')
      rect.setAttribute('width', '12')
      rect.setAttribute('height', '12')
      rect.setAttribute('rx', '1.5')
      const path = document.createElementNS(SVG_NS, 'path')
      path.setAttribute('d', 'M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1')
      svg.append(rect, path)
      break
    }
    case 'check': {
      const path = document.createElementNS(SVG_NS, 'path')
      path.setAttribute('d', 'M20 6 9 17l-5-5')
      svg.appendChild(path)
      break
    }
  }
  return svg
}

export function enhanceCodeBlocks(container) {
  if (!container) return () => {}

  const blocks = container.querySelectorAll('pre[data-lang]:not([data-enhanced])')
  const cleanups = []

  blocks.forEach((pre) => {
    pre.dataset.enhanced = 'true'

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block'

    const header = document.createElement('div')
    header.className = 'code-block-header'

    const langEl = document.createElement('span')
    langEl.className = 'code-block-lang'
    langEl.textContent = LANG_LABELS[pre.dataset.lang] ?? pre.dataset.lang

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-block-copy'
    button.setAttribute('aria-label', 'Copy code')
    button.appendChild(buildIcon('copy'))

    let resetTimer
    const onClick = async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent)
      } catch {
        return
      }
      clearTimeout(resetTimer)
      button.classList.add('copied')
      button.replaceChildren(buildIcon('check'))
      button.setAttribute('aria-label', 'Copied')
      resetTimer = setTimeout(() => {
        button.classList.remove('copied')
        button.replaceChildren(buildIcon('copy'))
        button.setAttribute('aria-label', 'Copy code')
      }, 1600)
    }
    button.addEventListener('click', onClick)
    cleanups.push(() => {
      clearTimeout(resetTimer)
      button.removeEventListener('click', onClick)
    })

    header.append(langEl, button)
    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.append(header, pre)
  })

  return () => cleanups.forEach((fn) => fn())
}
