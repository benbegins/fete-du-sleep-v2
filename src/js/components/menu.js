export default class Menu {
	constructor(lenis) {
		// DOM elements
		this.body = document.querySelector('body')
		this.menu = document.querySelector('.site-header .menu')
		this.burger = this.menu.querySelector('.burger-button')
		this.mainMenu = this.menu.querySelector('#primary-navigation')
		this.btnsSubmenu = this.menu.querySelectorAll('.btn-submenu')
		this.overlay = document.querySelector('.overlay-menu')

		// Lenis
		this.lenis = lenis

		// Event listeners
		this.burger.addEventListener('click', () => this.toggleMenu(this.lenis))
		this.btnsSubmenu.forEach((btn) =>
			btn.addEventListener('click', () => this.toggleSubmenu(btn))
		)
		this.overlay.addEventListener('mouseenter', () => {
			this.closeSubmenu(this.btnsSubmenu, this.overlay)
		})
	}

	toggleMenu() {
		const isExpanded = this.burger.getAttribute('aria-expanded') === 'true'
		this.burger.setAttribute('aria-expanded', !isExpanded)
		this.mainMenu.setAttribute('aria-expanded', !isExpanded)
		this.menu.classList.toggle('open')
		isExpanded ? this.lenis.start() : this.lenis.stop()
	}

	toggleSubmenu(btn) {
		const isExpanded = btn.getAttribute('aria-expanded') === 'true'
		btn.setAttribute('aria-expanded', !isExpanded)
		btn.nextElementSibling.setAttribute('aria-expanded', !isExpanded)
		// Animation
		btn.nextElementSibling.style.maxHeight = isExpanded
			? '0px'
			: btn.nextElementSibling.scrollHeight + 'px'

		this.overlay.classList.toggle('active')
		// Overflow hidden on body
		isExpanded ? this.lenis.start() : this.lenis.stop()
	}

	closeSubmenu(btns, overlay) {
		// const btnsSubmenu = document.querySelectorAll('.btn-submenu')
		btns.forEach((btn) => {
			btn.setAttribute('aria-expanded', false)
			btn.nextElementSibling.setAttribute('aria-expanded', false)
			btn.nextElementSibling.style.maxHeight = '0px'
		})
		overlay.classList.remove('active')
		this.lenis.start()
	}

	destroy() {
		this.burger.removeEventListener('click', () => this.toggleMenu(lenis))
		this.btnsSubmenu.forEach((btn) =>
			btn.removeEventListener('click', () => this.toggleSubmenu(btn))
		)
		this.overlay.removeEventListener('mouseenter', () => {
			this.closeSubmenu(this.btnsSubmenu, this.overlay)
		})
	}
}
