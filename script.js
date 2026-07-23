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

let lastScroll = 0

addEventListener('scroll', () => {
  const current = window.scrollY

  if (current < 80) {
    header.classList.remove('is-visible')
  } else if (current > lastScroll) {
    header.classList.add('is-visible')
  } else {
    header.classList.add('is-visible')
  }

  lastScroll = current
})