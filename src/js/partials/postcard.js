window.addEventListener('load', () => {
  const postcard = document.querySelector('.postcard');

  if (postcard) {
    const postcardButtons = postcard.querySelectorAll('.postcard__btn');
    const postcardCard = postcard.querySelector('.postcard__card');
    const postcardCardSource = postcardCard.querySelector('.postcard__card-image source');
    const postcardCardImage = postcardCard.querySelector('.postcard__card-image img');
    
    const postcardCardText = postcardCard.querySelector('.postcard__card-text');
    const postcardSend = postcard.querySelector('.postcard__send');
    const postcardModal = postcard.querySelector('.postcard__modal');
    const postcardModalForm = postcardModal.querySelector('.postcard__modal form');
    const postcardModalFormButton = postcardModalForm.querySelector('.postcard__modal-send');


    const ModifierClass = {
      CARD_PRELOADER: 'preloaded',
      CARD_TEXT_NOPADDING: 'no-padding',
    }

    //console.log(postcardButtons)
    //console.log(postcardModalForm.email)

    postcardButtons.forEach(it => {
      it.onclick = () => {
        const disabledButton = postcard.querySelector('.postcard__btn[disabled]');

        if (disabledButton) {
          disabledButton.disabled = false;
        }

        it.blur();
        it.disabled = true;

        const cardId = it.dataset.cardId;
        const cardText = it.dataset.cardText;
        const cardMod = it.dataset.cardMod;

        postcardModalForm.cardId.value = cardId;
        changePostcard(cardId, cardText, cardMod);

        /*loadPostcardImages(cardId, () => {
          alert('done!')
        })*/
      }
    });
    
    postcardModalForm.email.onblur = function() {
      const isValid = validateForm();

      if (isValid) {
        postcardModalFormButton.disabled = false;
      } else {
        postcardModalFormButton.disabled = true;
      }
    }

    postcardModalForm.email.oninput = function() {
      const isValid = validateForm();

      if (isValid) {
        postcardModalFormButton.disabled = false;
      } else {
        postcardModalFormButton.disabled = true;
      }
    }

    postcardSend.onclick = () => {
      const overlay = setOverlay(closeModal);
      document.body.appendChild(overlay);
      postcardModal.classList.add('shown')
    }

    postcardModal.onclick = e => {
      if (e.target.closest('.postcard__modal-close')) {
        closeModal()
      }
    }

    postcardModalForm.onsubmit = e => {
      e.preventDefault();

      const isValid = validateForm();

      if (isValid) {
        const formData = new FormData(postcardModalForm);
        const body = {};

        formData.forEach((value, key) => {
          body[key] = value;
        });

        fetch('/send_email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
        })
        .then(response => {
          if (response.status !== 200) {
            throw new Error('Network status is not 200');
          }

          return response.json();
        })
        .then(data => {
          const message = document.querySelector('.postcard__modal-message');
          message.classList.add('shown');

          if (data.error_no === 0) {
            message.textContent = 'Спасибо, ваше письмо было отправлено';

          } else if (data.error_no > 0) {
              message.style.color = 'red';
              message.textContent = data.error_text;
          }
        })
      }


    }

    splitTextIntoParts(postcardCardText);
    
    function closeModal() {
      const overlay = document.querySelector('.overlay');
      overlay.remove();
      postcardModal.classList.remove('shown');
      const message = document.querySelector('.postcard__modal-message');
          message.classList.remove('shown');
    }

    function changePostcard(id, text, mod) {
      const preloader = postcardCard.querySelector('.postcard__card-overlay')
      postcardCard.classList.add(ModifierClass.CARD_PRELOADER);

      preloader.ontransitionend = () => {
        preloader.ontransitionend = null;
        postcardCard.className = 'postcard__card postcard__card--' + mod;

        postcardCardText.classList.remove(ModifierClass.CARD_TEXT_NOPADDING);
        
        postcardCardText.innerHTML = text;
        splitTextIntoParts(postcardCardText);
        postcardCardText.classList.add(ModifierClass.CARD_TEXT_NOPADDING);

        loadPostcardImages(id, () => {
          postcardCardImage.src = `images/postcard/cards/${id}.png`;
          postcardCardSource.setAttribute('srcset', `images/postcard/cards/${id}-mobile.png`)
          postcardCard.classList.remove(ModifierClass.CARD_PRELOADER);
        });

      }


      // . добавляем оверлей с прелоадером
      // . добавляем класс карточке
      // . загружаем картинки и добавляем в src
      // . вставляем текст и разбиваем его на спаны
      // . убираем прелоадер

    }

    function loadPostcardImages(name, cb) {
      return Promise.all([
        new Promise((res, rej) => {
          const image = new Image();

          image.onload = () => {
            res(true);
          }
          image.onerror = () => {
            res(false)
          }

          image.src = `images/postcard/cards/${name}.png`;
        }),
        new Promise((res, rej) => {
          const image = new Image();

          image.onload = () => {
            res(true);
          }
          image.onerror = () => {
            res(false)
          }

          image.src = `images/postcard/cards/${name}-mobile.png`;
        })
        .then(results => {
          console.log(results)
          cb();
        })
      ])
    }

    function splitTextIntoParts(el, text) {
      console.log(el.offsetWidth)
			let tmp = document.createElement('p');
			tmp = el.cloneNode(true);
			tmp.style.width = el.offsetWidth + 'px';
			tmp.style.position = 'absolute';
			tmp.style.left = '-2000px';
			tmp.innerHTML = 'foo';
			document.body.appendChild(tmp);

			let content = el.textContent.split(''),
					oneLineHeight = tmp.scrollHeight,
					lines = [],
					i = 0;

			while (i < content.length) {
				let line = tmp.innerHTML = '';

				while (i < content.length && tmp.scrollHeight <= oneLineHeight) {
					tmp.innerHTML = line += content[i++];
				}

				let lineEndIndex = i === content.length ? i : line.lastIndexOf(' ') + 1;
				lines.push( content.splice(0, lineEndIndex).join('') );
				i = 0;
			}
			tmp.remove();
			el.innerHTML = lines.map(function(line) {
		
				return el.hasAttribute('data-wrapper-class') ? '<span class="' + el.dataset.wrapperClass + '">' + line + '</span>' : '<span>' + line + '</span>';

			}).join('');
      
		}

    function validateForm() {
      const value = postcardModalForm.email.value;
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return  value !== '' && re.test(String(value).toLowerCase());
    }
  }

  function setOverlay(cb) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = cb;
    return overlay;
  }

  /*function getScrollbarWidth() {
    var block = $('<div>').css({'height':'50px','width':'50px'});
    var indicator = $('<div>').css({'height':'200px'});

    const block = document.createElement('div');
    block.style.width = '50px';
    block.style.height = '50px';

    const indicator = document.createElement('div');
    indicator.style.height = '200px';
    block.appendChild(indicator);

    document.body.appendChild(block);

    var w1 = block.scrollHeight;//$('div', block).innerWidth();
    
    block.css('overflow-y', 'scroll');

    var w2 = $('div', block).innerWidth();
    $(block).remove();

    return (w1 - w2);
  }*/
});
