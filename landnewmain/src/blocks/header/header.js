document.addEventListener("DOMContentLoaded", function() {

    // Находим элемент хедера
    const header = document.querySelector('header');

    // Обработчик события прокрутки страницы
    function handleScroll() {
        // Если вертикальная прокрутка больше 0, добавляем класс is-active, иначе удаляем
        if (window.scrollY > 0) {
            header.classList.add('is-active');
        } else {
            header.classList.remove('is-active');
        }
    }

    // Добавляем обработчик события прокрутки
    window.addEventListener('scroll', handleScroll);
    

    // Получаем элемент формы
    const form = document.getElementById('submit-your-application-form');




    
  //Валидация ФОРМЫ*****************************************

  // Функция для валидации формы
  function validateForm() {

    const infoInput = form.querySelector('textarea[name="info"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const routeFromInput = form.querySelector('input[name="from"]');
    const routeToInput = form.querySelector('input[name="to"]');

    const errors = {};

    // Проверка имени

    console.log("infoInput.value", infoInput.value);
    if (!infoInput.value) {
        errors.info = 'Введите информацию';
    }

    // Проверка номера телефона
    if (!phoneInput.value) {
        errors.phone = 'Введите номер телефона';
    }

    // Проверка поля route-from
    if (!routeFromInput.value) {
        errors.routeFrom = 'Введите место отправления';
    }

    // Проверка поля route-to
    if (!routeToInput.value) {
        errors.routeTo = 'Введите место назначения';
    }

    return errors;
  }

  // Пример использования
  function handleFormChange() {
    const btn = form.querySelector(".blue-btn")
    const errors = validateForm();

    if (errors.routeTo || errors.phone || errors.routeFrom || errors.routeTo || errors.info ) {
      btn.classList.add("is-disabled")
      btn.disabled = true;
    }else {
      btn.classList.remove("is-disabled")
      btn.disabled = false;
    }
  }

  // Привязываем обработчик изменения к каждому полю формы
  const formInputs = form.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('change', handleFormChange);
  });
  formInputs.forEach(input => {
    input.addEventListener('keyup', handleFormChange);
  });

  //Валидация ФОРМЫ*****************************************




  //ОТПРАВКА ФОРМЫ*****************************************\\

  const clearInputs = () => {
    const inputs = form.querySelectorAll(".input-group")
    inputs.forEach(function(el) {
      el.querySelector("input").value = ""
      el.classList.remove('input-group--focus')
      el.classList.remove('input-group--notempty')
    });
  }


  // Добавляем обработчик события submit
  form.addEventListener('submit', function(event) {




    const infoInput = form.querySelector('textarea[name="info"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const routeFromInput = form.querySelector('input[name="from"]');
    const routeToInput = form.querySelector('input[name="to"]');
    // Предотвращаем стандартное поведение формы (отправку по умолчанию)
    event.preventDefault();
    const btn = form.querySelector(".blue-btn")

    btn.disabled = true;
    // Здесь можно добавить код для валидации формы перед отправкой
    // Например, проверка на заполненность обязательных полей и др.

    // Отправляем форму с помощью fetch
    fetch('https://devapi.1f.ru/api/landing/request/with-trail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        info: infoInput.value,
        phone: phoneInput.value,
        from: routeFromInput.value,
        to: routeToInput.value,
      })
    })
    .then(response => {

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }


      return response.json();
    })
    .then(data => {
      infoInput.value = ""
      phoneInput.value = ""
      routeFromInput.value = ""
      routeToInput.value = ""
      openModal("modal-succ")
      clearInputs()
      btn.classList.add("is-disabled")
    })
    .catch(error => {
      infoInput.value = ""
      phoneInput.value = ""
      routeFromInput.value = ""
      routeToInput.value = ""
      console.error('Ошибка при отправке запроса:', error);
      btn.classList.add("is-disabled")
      clearInputs()
      throw new Error('Ошибка при отправке запроса:');

      // Добавьте здесь код для обработки ошибки
    });
  });
  //ОТПРАВКА ФОРМЫ*****************************************


  // //METRIKA
  // const ymEls = document.querySelectorAll(".ym-el")
  // ymEls.forEach( el => el.addEventListener("click", (e) => {
  //   const goal = e.target.dataset.goal
  //   ym(95302256,'reachGoal', goal)
  // }))
  // //METRIKA


});