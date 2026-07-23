document.documentElement.classList.add('js-ready')

const year = document.getElementById('year')

if (year) {
  year.textContent = new Date().getFullYear()
}

const menuButton = document.querySelector('.menu-button')
const nav = document.querySelector('.site-nav')

menuButton?.addEventListener('click', () => {
  const isOpen =
    menuButton.getAttribute('aria-expanded') === 'true'

  menuButton.setAttribute(
    'aria-expanded',
    String(!isOpen)
  )

  nav?.classList.toggle('is-open', !isOpen)
})

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute(
      'aria-expanded',
      'false'
    )

    nav?.classList.remove('is-open')
  })
})

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const revealElements =
  document.querySelectorAll('[data-reveal]')

if (
  reducedMotion ||
  !('IntersectionObserver' in window)
) {
  revealElements.forEach(element => {
    element.classList.add('is-visible')
  })
} else {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px'
    }
  )

  revealElements.forEach(element => {
    revealObserver.observe(element)
  })
}