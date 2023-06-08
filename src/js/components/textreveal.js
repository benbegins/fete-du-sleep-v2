import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'splitting/dist/splitting.css'
import 'splitting/dist/splitting-cells.css'
import Splitting from 'splitting'

gsap.registerPlugin(ScrollTrigger)

export default class TextReveal {
	constructor(element) {
		this.elements = document.querySelectorAll(element)
		this.elements.forEach((element) => {
			element.hasAttribute('translate')
				? this.translate(element)
				: this.fadeLines(element)
		})
	}

	fadeLines(element) {
		this.splitLines(element).forEach((line, index) => {
			gsap.set(line, {
				opacity: 0,
			})

			gsap.to(line, {
				opacity: 1,
				duration: 0.4,
				delay: index * 0.05,
				ease: 'power1.inOut',
				scrollTrigger: {
					trigger: element,
					start: 'top 90%',
				},
			})
		})
	}

	translate(element) {
		this.splitLines(element).forEach((line, index) => {
			const words = []
			line.forEach((word) => {
				const span = document.createElement('span')
				span.classList.add('inner')
				span.innerHTML = word.innerHTML
				word.innerHTML = ''
				word.appendChild(span)
				words.push(span)
			})

			gsap.set(words, {
				yPercent: 100,
			})

			gsap.to(words, {
				yPercent: 0,
				duration: 0.75,
				delay: index * 0.1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: element,
					start: 'top 90%',
				},
			})
		})
	}

	splitLines(element) {
		Splitting({ target: element, by: 'lines' })

		const words = element.querySelectorAll('span')

		// regroup lines by their css variable --line-index property
		const lines = []
		words.forEach((line) => {
			const index = line.style.getPropertyValue('--line-index')
			if (!lines[index]) {
				lines[index] = []
			}
			lines[index].push(line)
		})

		return lines
	}
}
