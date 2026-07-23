import * as THREE from 'three'

document.documentElement.classList.add('js-ready')
document.getElementById('year').textContent = new Date().getFullYear()

const menuButton = document.querySelector('.menu-button')
const nav = document.querySelector('.site-nav')
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true'
  menuButton.setAttribute('aria-expanded', String(!open))
  nav?.classList.toggle('is-open', !open)
})

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false')
    nav?.classList.remove('is-open')
  })
})

// Word-by-word hover sweeps on selected headings
document.querySelectorAll('[data-heading-motion]').forEach(heading => {
  const words = heading.textContent.trim().split(/\s+/)
  heading.textContent = ''
  words.forEach((word, index) => {
    const span = document.createElement('span')
    span.className = 'word-sweep'
    span.textContent = word
    heading.append(span)
    if (index < words.length - 1) heading.append(' ')
  })
})

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

// GSAP motion system with visible native fallback
const animateWithGsap = () => {
  if (!window.gsap || !window.ScrollTrigger) return false

  gsap.registerPlugin(ScrollTrigger)
  gsap.set('.title-line > span', { yPercent: 115, rotate: 2 })
  gsap.set('.hero-eyebrow, .hero-intro, .hero-actions, .hero-note', {
    opacity: 0,
    y: 30
  })

  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  heroTl
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: .75 })
    .to('.title-line > span', {
      yPercent: 0,
      rotate: 0,
      duration: 1.15,
      stagger: .11
    }, '-=.35')
    .to('.hero-intro', { opacity: 1, y: 0, duration: .75 }, '-=.55')
    .to('.hero-actions', { opacity: 1, y: 0, duration: .7 }, '-=.55')
    .to('.hero-note', { opacity: 1, y: 0, duration: .85 }, '-=.62')

  document.querySelectorAll('[data-reveal]').forEach((el, index) => {
    if (el.matches('.hero-eyebrow,.hero-intro,.hero-actions,.hero-note')) return
    gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: .95,
      ease: 'power3.out',
      delay: (index % 3) * .035,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    })
  })

  document.querySelectorAll('.project-card').forEach(card => {
    const visual = card.querySelector('.project-visual > *')
    if (!visual) return
    gsap.fromTo(visual, { y: 30, rotate: -1 }, {
      y: -25,
      rotate: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    })
  })

  gsap.to('.ambient-orb-one', { x: 80, y: 50, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.to('.ambient-orb-two', { x: -70, y: -55, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  gsap.to('.freelance-orbit', { rotate: 360, duration: 16, repeat: -1, ease: 'none' })
  return true
}

const animateNative = () => {
  document.querySelectorAll('.title-line > span').forEach((line, index) => {
    line.animate([
      { transform: 'translateY(115%) rotate(2deg)' },
      { transform: 'translateY(0) rotate(0)' }
    ], { duration: 1100, delay: 180 + index * 130, fill: 'both', easing: 'cubic-bezier(.18,.8,.2,1)' })
  })

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.animate([
        { opacity: 0, transform: 'translateY(52px)', filter: 'blur(8px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
      ], { duration: 900, fill: 'forwards', easing: 'cubic-bezier(.2,.75,.2,1)' })
      observer.unobserve(entry.target)
    })
  }, { threshold: .12 })
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
}

if (!reduced && !animateWithGsap()) animateNative()
if (reduced) document.querySelectorAll('[data-reveal]').forEach(el => {
  el.style.opacity = '1'
  el.style.transform = 'none'
  el.style.filter = 'none'
})

// Card depth tilt
if (!reduced && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - .5
      const y = (event.clientY - rect.top) / rect.height - .5
      card.style.transform = `perspective(1100px) rotateX(${-y * 3.5}deg) rotateY(${x * 4}deg) translateY(-3px)`
    })
    card.addEventListener('pointerleave', () => {
      card.style.transform = ''
    })
  })
}

// Futuristic light cursor with delayed trail
const core = document.querySelector('.cursor-core')
const aura = document.querySelector('.cursor-aura')
if (core && aura && matchMedia('(pointer:fine)').matches && !reduced) {
  let mx = innerWidth / 2
  let my = innerHeight / 2
  let ax = mx
  let ay = my
  let lastTrail = 0
  addEventListener('pointermove', event => {
    mx = event.clientX
    my = event.clientY
    core.style.transform = `translate(${mx - 4}px,${my - 4}px)`
    const now = performance.now()
    if (now - lastTrail > 42) {
      lastTrail = now
      const dot = document.createElement('i')
      dot.className = 'cursor-trail'
      dot.style.left = `${mx - 4}px`
      dot.style.top = `${my - 4}px`
      document.body.append(dot)
      dot.animate([
        { opacity: .8, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(.1) translateY(8px)' }
      ], { duration: 520, easing: 'ease-out' }).onfinish = () => dot.remove()
    }
  })
  const follow = () => {
    ax += (mx - ax) * .115
    ay += (my - ay) * .115
    aura.style.transform = `translate(${ax - 27}px,${ay - 27}px)`
    requestAnimationFrame(follow)
  }
  follow()
  document.querySelectorAll('a,button,[data-tilt],.word-sweep').forEach(el => {
    el.addEventListener('pointerenter', () => aura.classList.add('is-active'))
    el.addEventListener('pointerleave', () => aura.classList.remove('is-active'))
  })
}

// Three.js hero scene
const initThree = () => {
  const canvas = document.getElementById('hero-canvas')
  if (!canvas || !window.THREE || reduced) return false

  const wrap = canvas.parentElement
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100)
  camera.position.z = 6.2

  const group = new THREE.Group()
  scene.add(group)

  const geo = new THREE.IcosahedronGeometry(1.58, 3)
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff7a3d,
    wireframe: true,
    transparent: true,
    opacity: .38
  })
  const mesh = new THREE.Mesh(geo, mat)
  group.add(mesh)

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.82, 1),
    new THREE.MeshBasicMaterial({ color: 0xa7b97b, wireframe: true, transparent: true, opacity: .12 })
  )
  group.add(shell)

  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffad78, transparent: true, opacity: .28, side: THREE.DoubleSide })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, .012, 8, 180), ringMat)
  ring.rotation.x = 1.05
  ring.rotation.y = .35
  group.add(ring)

  const count = 520
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 2.4 + Math.random() * 2.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x8c7a67, size: .018, transparent: true, opacity: .5 }))
  scene.add(particles)

  let targetX = 0
  let targetY = 0
  addEventListener('pointermove', event => {
    targetX = (event.clientX / innerWidth - .5) * .55
    targetY = (event.clientY / innerHeight - .5) * .35
  })

  const resize = () => {
    const width = wrap.clientWidth
    const height = wrap.clientHeight
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
  }
  resize()
  new ResizeObserver(resize).observe(wrap)

  const clock = new THREE.Clock()
  const render = () => {
    const t = clock.getElapsedTime()
    group.rotation.y += (targetX - group.rotation.y) * .025
    group.rotation.x += (-targetY - group.rotation.x) * .025
    mesh.rotation.y += .0028
    mesh.rotation.z = Math.sin(t * .42) * .12
    shell.rotation.x -= .0012
    shell.rotation.y += .0015
    ring.rotation.z += .0018
    particles.rotation.y = t * .018
    const pulse = 1 + Math.sin(t * 1.25) * .025
    mesh.scale.setScalar(pulse)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
  return true
}

if (!initThree()) {
  const canvas = document.getElementById('hero-canvas')
  if (canvas) canvas.style.background = 'radial-gradient(circle at 62% 42%, rgba(255,122,61,.22), transparent 34%), radial-gradient(circle at 72% 58%, rgba(167,185,123,.18), transparent 30%)'
}
