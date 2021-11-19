window.addEventListener('load', () => {
  const header = document.querySelector('.header');

  if (header) {
    const menu = header.querySelector('.menu');
    const menuToggle = menu.querySelector('.menu__toggle');

    const ModClass = {
      HEADER: 'header--bg',
      MENU: 'menu--opened'
    }

    menuToggle.onclick = () => {
      header.classList.toggle(ModClass.HEADER);
      menu.classList.toggle(ModClass.MENU);
    }
  }

  //
  //
})