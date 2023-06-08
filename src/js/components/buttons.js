import { gsap } from 'gsap'

export default class Buttons {
	constructor(element) {
		this.buttons = document.querySelectorAll(element)
		this.buttons.forEach((btn) => {
			this.addOverShape(btn)
			btn.addEventListener('mouseenter', () => this.overEffect(btn, true))
			btn.addEventListener('mouseleave', () =>
				this.overEffect(btn, false)
			)
		})
	}

	addOverShape(btn) {
		// Add a svg shape to the button
		btn.innerHTML += `<svg class="btn-primary__shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path vector-effect="non-scaling-stroke" d="M 0 100 V 100 Q 50 100 100 100 V 100 z" />
        </svg>`
	}

	overEffect(btn, isOver) {
		const path = btn.querySelector('path')
		const tl = gsap.timeline()

		if (isOver) {
			tl.to(path, {
				attr: { d: 'M 0 100 V 90 Q 50 0 100 90 V 100 z' },
				ease: 'power1.in',
				duration: 0.13,
			})
			tl.to(path, {
				attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
				ease: 'power1.out',
				duration: 0.18,
			})
		} else {
			tl.to(path, {
				attr: { d: 'M 0 100 V 90 Q 50 0 100 90 V 100 z' },
				ease: 'power1.in',
				duration: 0.18,
			})
			tl.to(path, {
				attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
				ease: 'power1.out',
				duration: 0.13,
			})
		}
	}

	destroy() {
		this.buttons.forEach((btn) => {
			btn.removeEventListener('mouseenter', () =>
				this.overEffect(btn, true)
			)
			btn.removeEventListener('mouseleave', () =>
				this.overEffect(btn, false)
			)
		})
	}
}
