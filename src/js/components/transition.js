import { gsap } from 'gsap'

export function transitionIn(next) {
	const currentPage = document.querySelector('#main-container')
	const header = currentPage.querySelector('.site-header')
	gsap.fromTo(
		currentPage,
		{ opacity: 0 },
		{
			opacity: 1,
			duration: 0.75,
			ease: 'power1.inOut',
			onComplete: next,
		}
	)
	gsap.fromTo(
		header,
		{ yPercent: -50, opacity: 0 },
		{
			yPercent: 0,
			opacity: 1,
			duration: 0.75,
			delay: 0.25,
			ease: 'power2.out',
			onComplete: () => {
				header.style.transform = 'none'
			},
		}
	)
}

export function transitionOut(next) {
	let path = document.querySelector('.transition .path')

	const base = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'
	const start = 'M 0 100 V 50 Q 50 15 100 50 V 100 z'
	const end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'

	const tl = gsap.timeline({ onComplete: next })

	tl.to(path, {
		attr: { d: start },
		ease: 'power2.in',
		duration: 0.6,
	})
	tl.to(path, {
		attr: { d: end },
		ease: 'power2.out',
		duration: 0.4,
	})
	tl.fromTo(
		'.transition-overlay',
		{ opacity: 0 },
		{ opacity: 0.35, duration: 0.6, ease: 'power1.in' },
		'-=1'
	)
	tl.play(0)
}
