class AtlasModal {
  constructor(title, text) {
    this.title = title;
    this.text = text;
    this.elem = document.createElement('div');
    this.elem.className = 'atlas__modal modal';
    this.render();
    this.elem.addEventListener('click', this.onThisClick.bind(this));
  }

  render() {
    this.elem.innerHTML = `<button class="modal__close" type="button" aria-label="Закрыть"><svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 2.45 25.55 0 14 11.55 2.45 0 0 2.45 11.55 14 0 25.55 2.45 28 14 16.45 25.55 28 28 25.55 16.45 14 28 2.45Z"/></svg></button>
    <div class="modal__title">${this.title}</div>
    <div class="modal__text">${this.text}</div>`;
  }

  close() {
    this.elem.remove()
  }

  onThisClick(e) {
    if (e.target.closest('.modal__close')) {
      this.close();
    }
    
  }
}

window.addEventListener('load', () => {
  const items = document.querySelectorAll('.atlas__item');

  if (items.length) {
    let modal = null;

    items.forEach(it => {
      it.onclick = e => {
        if (e.target.closest('.atlas__item-image')) {
          e.preventDefault();
          if (modal) {
            modal.close();
          }
          const title = it.querySelector('.atlas__item-title').textContent;
          const text =it.querySelector('.atlas__item-text').textContent;

          modal = new AtlasModal(title, text);
          document.body.appendChild(modal.elem);
        }
      }
    });
  }
})