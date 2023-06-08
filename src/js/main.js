import '../scss/style.scss'

// Library Imports
import Swup from 'swup'
import SwupJsPlugin from '@swup/js-plugin'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Components
import intro from './components/intro.js'
import { transitionIn, transitionOut } from './components/transition.js'
import Menu from './components/menu.js'
import Buttons from './components/buttons.js'
import Sliders from './components/sliders.js'
import Parallax from './components/parallax.js'
import TextReveal from './components/textreveal.js'

// Global Vars
let lenis, menu, buttons, sliders, parallax, textreveal

// Init Swup
const options = [
	{
		from: '(.*)',
		to: '(.*)',
		in: (next, infos) => {
			transitionIn(next)
		},
		out: (next, infos) => {
			transitionOut(next)
		},
	},
]

const swup = new Swup({
	plugins: [new SwupJsPlugin(options)],
	containers: ['#main-container'],
})

// Play when visit page for the first time
const once = () => {
	intro(init)
}

// Play on every page load
const init = () => {
	window.scrollTo(0, 0)

	// Init Components
	lenis = new Lenis({ duration: 1.2 })
	menu = new Menu(lenis)
	buttons = new Buttons('.btn-primary')
	sliders = new Sliders('.slider')
	parallax = new Parallax('.parallax')
	textreveal = new TextReveal('.text-reveal')

	// Lenis Scroll
	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)
}

// Play on every page unload
const unload = () => {
	ScrollTrigger.killAll()
	lenis.destroy()
	menu.destroy()
	buttons.destroy()
	sliders.destroy()
}

// Init on page load
if (document.readyState === 'complete') {
	once()
} else {
	document.addEventListener('DOMContentLoaded', () => {
		once()
	})
}

// Init on page change
swup.on('contentReplaced', init)

// Unload on page change
swup.on('willReplaceContent', unload)
