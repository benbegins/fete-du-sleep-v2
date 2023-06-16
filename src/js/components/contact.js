import axios from 'axios'

const contact = () => {
	const formContainer = document.querySelector('#contact-form')

	if (formContainer) {
		formContainer.addEventListener('submit', (e) => {
			e.preventDefault()

			formSubmitProgress()

			// Send form data
			const formData = new FormData(formContainer)
			axios
				.post(
					'/wp-admin/admin-ajax.php?action=get_contact_form',
					formData
				)
				.then((response) => {
					formSuccess(response.data)
				})
				.catch((error) => {
					console.error(error)
				})
		})
	}

	const formSubmitProgress = () => {
		// Add loading message
		if (formContainer.querySelector('.loading-message')) {
			const loadingMessage =
				formContainer.querySelector('.loading-message')
			loadingMessage.textContent = 'Envoi en cours...'
			loadingMessage.classList.remove('error')
		} else {
			const loadingMessage = document.createElement('p')
			loadingMessage.classList.add('loading-message')
			loadingMessage.textContent = 'Envoi en cours...'
			formContainer.appendChild(loadingMessage)
		}
	}

	const formSuccess = (response) => {
		// If error
		if (response.success === false) {
			// If bot
			if (response.data === 'bot') {
				formContainer.remove()
				return
			}

			formError(response.data)
			return
		}

		formContainer.reset()
		const loadingMessage = formContainer.querySelector('.loading-message')
		loadingMessage.textContent = response
		loadingMessage.classList.add('success')
		loadingMessage.classList.remove('error')

		// Remove submit button
		const submitButton = formContainer.querySelector(
			'button[type="submit"]'
		)
		submitButton.remove()
	}

	const formError = (response) => {
		const loadingMessage = formContainer.querySelector('.loading-message')
		loadingMessage.textContent = response
		loadingMessage.classList.add('error')
	}
}

export default contact
