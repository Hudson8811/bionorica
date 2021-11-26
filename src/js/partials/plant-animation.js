window.addEventListener('load', () => {
  const plants = document.querySelectorAll('.hero-plant');

  if (plants.length) {

    plants.forEach(plant => {
      const paths = plant.querySelectorAll('.test-path');
      const pathBg = plant.querySelector('.path-bg');

      paths.forEach(path => {
        pathPrepare(path);
      });

      plant.style.opacity = '1';

      const tl = gsap.timeline({
        delay: .7,
        onComplete: () => {
          gsap.to(pathBg, {opacity: 1, duration: 1.5});
        }
      });
      
      paths.forEach((path, index) => {
        tl.to(path, {strokeDashoffset: 0, duration: 2, onComplete: () => {
          path.setAttribute('fill', '#8BC53F');
          gsap.to(path, {fillOpacity: 1, duration: 1.5})
        }}, (index > 0 ? '-=2' : '') )
      });
    });
    
    
    //const paths = document.querySelectorAll('.animated path');

    //console.log(paths)

    //const startBtn = document.querySelector('.start');
    //const resetBtn = document.querySelector('.reset');

    //startBtn.onclick = animate;
    //resetBtn.onclick = reset;
    //const testPathLength = testPath.getTotalLength();


    function animate() {
      testPath.forEach(path => {
        pathPrepare(path);
        //console.log(path.getTotalLength());
      });

      const tl = gsap.timeline({ onComplete: () => {
        gsap.to('.path-bg', {opacity: 1, duration: 1.5});
      }})
      
      testPath.forEach((path, index) => {
        tl.to(path, {strokeDashoffset: 0, duration: 2, onComplete: () => {
          path.setAttribute('fill', '#8BC53F');
          gsap.to(path, {fillOpacity: 1, duration: 1.5})
        }}, (index > 0 ? '-=2' : '') )
      });
    }

    function reset() {
      paths.forEach(it => {
        it.removeAttribute('style');

        if (it.classList.contains('test-path')) {
          it.setAttribute('fill', 'none');
        }
      })
    }

  
  }

  function pathPrepare(el) {
    const lineLength = el.getTotalLength();
    el.style.strokeDasharray = lineLength;
    el.style.strokeDashoffset = lineLength;
  }

  function reduceStrokeWidth(width, duration) {

  }
})