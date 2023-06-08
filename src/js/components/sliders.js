import Swiper, { Pagination } from 'swiper'
import '/node_modules/swiper/swiper.min.css'

export default class Sliders {
	constructor(element) {
		this.sliders = document.querySelectorAll(element)
		this.sliders.forEach((slider) => {
			this.initSlider(slider)
		})
	}

	initSlider(slider) {
		new Swiper(slider, {
			loop: true,
			modules: [Pagination],
			grabCursor: true,
			speed: 600,
			pagination: {
				el: slider.querySelector('.swiper-pagination'),
				clickable: true,
			},
		})
	}

	destroy() {
		this.sliders.forEach((slider) => {
			slider.swiper.destroy()
		})
	}
}
