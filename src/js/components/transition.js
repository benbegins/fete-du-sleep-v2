import gsap from 'gsap'

export default class Transition {
	constructor() {
		this.links = document.querySelectorAll('a')

		this.links.forEach((link) => {
			// Check if link is internal
			if (link.hostname === window.location.hostname) {
				link.addEventListener('click', (e) => {
					e.preventDefault()
					this.transitionOut(e)
				})
			}
		})
	}

	transitionOut(event) {
		// const bg = document.querySelector(".page-transition")
		// gsap.to(bg, {
		// 	opacity: 1,
		// 	duration: 0.25,
		// 	ease: "linear",
		// 	onComplete: () => {
		// 		const href = e.target.tagName === "IMG" ? e.target.parentElement.href : e.target.href
		// 		window.location.href = href
		// 	},
		// })

		let path = document.querySelector('.transition .path')

		const base = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'
		const start = 'M 0 100 V 50 Q 50 15 100 50 V 100 z'
		const end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'

		const tl = gsap.timeline({
			onComplete: changePage,
		})

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

		function changePage() {
			// console.log(event.target.tagName)

			let href = null
			let element = event.target

			while (element) {
				if (element.href) {
					href = element.href
					break
				}
				element = element.parentElement
			}

			window.location.href = href
		}
	}
}
