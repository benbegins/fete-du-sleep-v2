import '../scss/style.scss'

// Library Imports
import Swup from 'swup'
import SwupJsPlugin from '@swup/js-plugin'
import SwupGaPlugin from '@swup/ga-plugin'
import SwupPreloadPlugin from '@swup/preload-plugin'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Components
import intro from './components/intro.js'
import Transition from './components/transition.js'
import Menu from './components/menu.js'
import Buttons from './components/buttons.js'
import Sliders from './components/sliders.js'
import Parallax from './components/parallax.js'
import TextReveal from './components/textreveal.js'
import contact from './components/contact.js'

// Global Vars
let lenis, menu, buttons, sliders, parallax, textreveal

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
	new Transition()

	// Lenis Scroll
	function raf(time) {
		lenis.raf(time)
		requestAnimationFrame(raf)
	}
	requestAnimationFrame(raf)

	// Contact Page
	if (document.querySelector('#main-container .page-contact')) {
		contact()
	}
}

intro(init)
