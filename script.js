const year = document.getElementById('year')

if (year) {
  year.textContent = new Date().getFullYear()
}

const menuButton = document.querySelector('.menu-button')
const nav = document.querySelector('.site-nav')

menuButton?.addEventListener('click', () => {
  const isOpen =
    menuButton.getAttribute('aria-expanded') === 'true'

  menuButton.setAttribute('aria-expanded', String(!isOpen))
  nav?.classList.toggle('is-open', !isOpen)
})

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false')
    nav?.classList.remove('is-open')
  })
})

const header = document.querySelector('.site-header')
const hero = document.querySelector('.hero')

if (header && hero) {
  const updateHeader = () => {
    const trigger = hero.offsetHeight * 0.25
    const scrollPosition = window.scrollY

    header.classList.toggle(
      'is-visible',
      scrollPosition > trigger
    )

    header.classList.toggle(
      'is-scrolled',
      scrollPosition > trigger + 60
    )
  }

  window.addEventListener('scroll', updateHeader, {
    passive: true
  })

  window.addEventListener('resize', updateHeader)

  updateHeader()
}