document.addEventListener('DOMContentLoaded', () => {

    let toggleList = document.querySelectorAll('.vacancy-item');
    toggleList.forEach(function(el) {
      let content = el.querySelector('.vacancy-item__content');
      let btn = el.querySelector('.vacancy-item__header');
      let inner = el.querySelector('.vacancy-item__inner');
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if ( el.classList.contains('is-active') ) {
          el.classList.remove('is-active');
          content.style.height = '';
        }else{
          el.classList.add('is-active');
          content.style.height = inner.offsetHeight+'px';
        }
      });
    });
  
});