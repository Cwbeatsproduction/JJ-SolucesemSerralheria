const _home = document.body.getAttribute('site-home');
const _phpmailer = `${_home}/theme/templates/includes/phpmailer/`;

async function show(selector) {
	await document.querySelectorAll(selector).forEach((e, i) => e.style.display = 'block');
}

const __ws_copy_selector = '.footer-copy, .copy-sole, .copy',
	__ws_whats_selector = '.whats-fixo, .whatsapp-fixo, .fixo-whatsapp, .link-whats-web',
	max_width = 990;
const __ws_select = selector => document.querySelectorAll(selector),
	__ws_reset_whats_attrs = async () => __ws_select(__ws_whats_selector).forEach(w => w.style = '');

async function __ws_fix_whats_height() {
	let cur_width = Math.min(screen.width, window.innerWidth);
	if (cur_width > max_width)
		return __ws_reset_whats_attrs();

	let body = document.body, html = document.documentElement;
	let scroll = window.scrollY,
		documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
		window_height = Math.min(screen.height, window.innerHeight);

	documentHeight = documentHeight - window_height;

	let copy = __ws_select(__ws_copy_selector), whats = __ws_select(__ws_whats_selector), offset = 0;
	copy.forEach(c => {
		let height = c.getBoundingClientRect().height;
		if (height > offset)
			offset = height;
	});

	whats.forEach(w => {
		if (!w.style.transition)
			w.style.transition = '.4s';
		let { height } = w.getBoundingClientRect();
		w.style.bottom = scroll + offset - height / 2 >= documentHeight ? offset + 'px' : '';
	});
}

window.addEventListener('load', () => __ws_fix_whats_height());
window.addEventListener('scroll', () => __ws_fix_whats_height());

async function hide(selector) {
	await document.querySelectorAll(selector).forEach((e, i) => e.style.display = 'none');
}

document.addEventListener('submit', function (e) {
	let classList = Array.from(e.target.classList);
	if (!classList.includes('formulario-js')) {
		return;
	}

	let trigger = e.target.getAttribute('data-trigger');
	if (!trigger) {
		trigger = 'contato';
	}

	e.preventDefault(e);
	show('.loading-js');

	const formData = new FormData(e.target);

	formData.append('trigger', trigger);

	EnviarMensagem();
	async function EnviarMensagem() {
		await fetch(`${_phpmailer}enviar.php`, { body: formData, method: 'post', cache: 'no-cache' }).then(d => d.json()).then(d => {
			console.log(d);
			if (d.status) {
				alert("Sua mensagem foi enviada com sucesso!! \nObrigado.");
				location.reload();
			} else {
				switch (d.statusText) {
					case "error":
						alert("Desculpe! Sua mensagem não foi enviada. \nFavor tente novamente!");
						break;
					case 'email-invalid':
						alert('Digite um endereço de e-mail valido para continuar');
						break;
					case 'sem-captcha':
						alert('Selecione o captcha para continuar.');
						break;
					case 'nao-autenticado':
						alert('Ocorreu um erro ao realizar a autenticação do captcha.\nTente novamente mais tarde!');
						break;
					case "robo":
						location.reload();
						break;
					default:
						alert('Houve um erro inesperado.\nTente novamente mais tarde!');
						// Descomentar para Debug
						// console.log(`statusText: ${d.statusText}`);
						break;
				}
			}

			hide(".loading-js");
		}).catch(e => {
			// Descomentar para Debug
			// console.log(e);
			alert('Erro ao realizar conexão com servidor, tente novamente mais tarde.');
			hide(".loading-js");
		});
	}
})