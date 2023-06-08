import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class Parallax {
	constructor(element) {
		this.elements = document.querySelectorAll(element)

		this.elements.forEach((element) => {
			window.innerWidth >= 1024 ? this.parallax(element) : null
		})
	}

	parallax(element) {
		const speed = parseFloat(element.dataset.speed)
		speed ? speed : 5

		// Scale up if element is an image
		if (element.tagName === 'IMG') {
			gsap.set(element, { scale: 1.15 })
		}

		gsap.fromTo(
			element,
			{
				y: `-${speed * (window.innerHeight / 100)}`,
			},
			{
				y: `${speed * (window.innerHeight / 100)}`,
				ease: 'linear',
				scrollTrigger: {
					trigger: element,
					scrub: true,
					start: 'top bottom',
					end: 'bottom top',
				},
			}
		)
	}
}
