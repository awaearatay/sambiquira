/* [EDITAR] Preencha somente os dados oficiais da casa. */
const casa = {
  enderecoConfirmado: '',
  whatsapp: '', // Inclua o código do país e o DDD, só com dígitos.
  instagram: '', // Use o nome de usuário, sem @.
  horarioTexto: '',
  horariosSchema: [] // Horários confirmados no formato OpeningHoursSpecification.
};

/* Permite ativar as notas quando o aparelho está em movimento reduzido. */
const controleNotas = document.querySelector('#controle-notas');
const sobreMusical = document.querySelector('#sobre');
controleNotas.hidden = false;
controleNotas.addEventListener('click', () => {
  const ativadas = sobreMusical.classList.toggle('notas-ativadas');
  controleNotas.textContent = ativadas ? 'Pausar notas' : 'Animar notas';
});

/* Repete os cartões visuais para fechar o ciclo de cada carrossel. */
const vitrineDestaques = document.querySelector('#vitrine-destaques');
// Nas larguras com dois cartões, os carrosséis sempre iniciam sozinhos.
const reduzirDestaques = matchMedia('(min-width: 60rem) and (prefers-reduced-motion: reduce)');
const janelasDestaques = vitrineDestaques.querySelectorAll('.vitrine-janela');

janelasDestaques.forEach(janela => {
  const lista = janela.querySelector('.vitrine-lista');
  const copia = lista.cloneNode(true);
  copia.setAttribute('aria-hidden', 'true');
  copia.inert = true;
  lista.after(copia);
});

function aplicarPreferenciaDestaques() {
  const animar = !reduzirDestaques.matches;
  vitrineDestaques.toggleAttribute('data-movimento', animar);
  janelasDestaques.forEach(janela => {
    if (animar) janela.scrollLeft = 0;
    janela.tabIndex = animar ? -1 : 0;
  });
}

aplicarPreferenciaDestaques();
reduzirDestaques.addEventListener('change', aplicarPreferenciaDestaques);

/* Menu para celular */
const menu = document.querySelector('#menu-toggle');
const navegacao = document.querySelector('#navegacao');
function abrirMenu(aberto) {
  menu.setAttribute('aria-expanded', String(aberto));
  navegacao.dataset.aberto = String(aberto);
}
menu.addEventListener('click', () => abrirMenu(menu.getAttribute('aria-expanded') !== 'true'));
navegacao.querySelectorAll('a').forEach(link => link.addEventListener('click', () => abrirMenu(false)));
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    abrirMenu(false);
    menu.focus();
  }
});

/* Galeria ampliável, com fechamento por Escape e pelo botão */
const galeria = document.querySelector('#foto-modal');
document.querySelectorAll('[data-foto]').forEach(botao => {
  botao.addEventListener('click', () => {
    const foto = botao.querySelector('img');
    const ampliada = document.querySelector('#foto-ampliada');
    ampliada.src = foto.currentSrc || foto.src;
    ampliada.alt = foto.alt;
    document.querySelector('#foto-legenda').textContent = botao.dataset.foto;
    galeria.showModal();
  });
});

/* Canais oficiais e configuração do mapa */
const whatsapp = casa.whatsapp ? 'https://wa.me/' + casa.whatsapp : '';
const instagram = casa.instagram ? 'https://www.instagram.com/' + encodeURIComponent(casa.instagram) + '/' : '';
const canais = { whatsapp, instagram };
const nomes = { whatsapp: 'WhatsApp', instagram: 'Instagram' };
const contato = document.querySelector('#contato-modal');
document.querySelectorAll('[data-contato]').forEach(botao => {
  const canal = botao.dataset.contato;
  if (canais[canal]) {
    const link = document.createElement('a');
    link.className = botao.className;
    link.href = canais[canal];
    link.target = '_blank';
    link.rel = 'noopener';
    const rotulo = botao.getAttribute('aria-label');
    if (rotulo) link.setAttribute('aria-label', rotulo);
    link.append(...botao.childNodes);
    botao.replaceWith(link);
    return;
  }
  botao.addEventListener('click', () => {
    document.querySelector('#contato-titulo').textContent = nomes[canal];
    document.querySelector('#contato-mensagem').textContent = 'O ' + nomes[canal] + ' oficial da casa está a confirmar.';
    contato.showModal();
  });
});
if (whatsapp && instagram) document.querySelector('#nota-contato').hidden = true;
if (casa.horarioTexto) document.querySelector('#horario').textContent = casa.horarioTexto;
const esquema = document.querySelector('#schema-casa');
const dados = JSON.parse(esquema.textContent);
if (casa.enderecoConfirmado) {
  document.querySelector('#rua').textContent = casa.enderecoConfirmado;
  document.querySelector('#nota-endereco').hidden = true;
  dados.address.streetAddress = casa.enderecoConfirmado;
  const consulta = encodeURIComponent(casa.enderecoConfirmado + ', Bento Ribeiro, Rio de Janeiro RJ');
  document.querySelector('#link-mapa').href = 'https://www.google.com/maps/search/?api=1&query=' + consulta;
  const mapa = document.querySelector('#mapa');
  mapa.title = 'Localização do Sambiquira no Google Maps';
  mapa.src = 'https://maps.google.com/maps?q=' + consulta + '&z=17&output=embed';
}
if (casa.horariosSchema.length) dados.openingHoursSpecification = casa.horariosSchema;
if (instagram) dados.sameAs = [instagram];
esquema.textContent = JSON.stringify(dados);
