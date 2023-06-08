import { gsap } from 'gsap'

const path = document.querySelector('.intro .path')
const page = document.querySelector('#main-container')
const introIcon = document.querySelector('.intro-icon')

export default function intro(init) {
	const base = 'M 0 0 V 100 Q 50 100 100 100 V 0 z'
	const start = 'M 0 0 V 75 Q 50 100 100 75 V 0 z'
	const end = 'M 0 0 V 0 Q 50 0 100 0 V 0 z'

	gsap.set(path, { attr: { d: base } })
	gsap.set(page, { opacity: 0 })

	const tl = gsap.timeline()

	tl.to(path, {
		attr: { d: start },
		ease: 'power2.in',
		duration: 0.5,
		delay: 0.25,
	})
	tl.to(path, {
		attr: { d: end },
		ease: 'power2.out',
		duration: 0.5,
	})

	tl.to(
		introIcon,
		{
			opacity: 0,
			yPercent: -250,
			duration: 0.65,
			ease: 'power2.in',
		},
		'-=1'
	)

	tl.to(
		'.intro-overlay',
		{
			opacity: 0,
			duration: 0.35,
			ease: 'power1.in',
		},
		'-=0.35'
	)

	setTimeout(() => {
		launchPage(init)
	}, 950)
}

const launchPage = (init) => {
	init()
	gsap.to(page, {
		opacity: 1,
		duration: 0.5,
		ease: 'power1.inOut',
	})
}
