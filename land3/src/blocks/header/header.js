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
    const form = document.getElementById('main-form');



    // Получаем все элементы с классом radio-row__item
    const items = document.querySelectorAll('.radio-row__item');

    // Функция для удаления класса is-active со всех элементов
    function removeActiveClass() {
        items.forEach(item => {
            item.classList.remove('is-active');
        });
    }

    // Обработчик события клика по элементу
    function handleClick(event) {
      // Проверяем, что клик произошел непосредственно на элементе .radio-row__item
      if (event.target.classList.contains('radio-row__item')) {
          // Удаляем класс is-active со всех элементов
          removeActiveClass();
          // Добавляем класс is-active к элементу, по которому кликнули
          event.target.classList.add('is-active');
          const cond = event.target.dataset.text
          form.querySelector('input[name="conditions"]').value = cond
      }
      handleFormChange()
    }

    // Привязываем обработчик события к каждому элементу
    items.forEach(item => {
        item.addEventListener('click', handleClick);
    });


    
  //Валидация ФОРМЫ*****************************************

  // Функция для валидации формы
  function validateForm() {
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const routeFromInput = form.querySelector('input[name="route-form"]');
    const routeToInput = form.querySelector('input[name="route-to"]');
    const conditionsInput = form.querySelector('input[name="conditions"]');

    const errors = {};

    // Проверка имени
    if (!nameInput.value) {
        errors.name = 'Введите имя';
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

    // Проверка скрытого поля conditions
    if (!conditionsInput.value) {
        errors.conditions = 'Необходимо согласиться с условиями';
    }

    return errors;
  }

  // Пример использования
  function handleFormChange() {
    const btn = form.querySelector(".blue-btn")
    const errors = validateForm();

    if (errors.routeTo || errors.phone || errors.routeFrom || errors.routeTo || errors.conditions) {
      btn.classList.add("is-disabled")
      btn.disabled = true;
    }else {
      btn.classList.remove("is-disabled")
      btn.disabled = false;
    }
  }

  // Привязываем обработчик изменения к каждому полю формы
  const formInputs = form.querySelectorAll('input');
  formInputs.forEach(input => {
    input.addEventListener('change', handleFormChange);
  });
  formInputs.forEach(input => {
    input.addEventListener('keyup', handleFormChange);
  });

  //Валидация ФОРМЫ*****************************************




  //ОТПРАВКА ФОРМЫ*****************************************\\

  document.querySelector(".send-carriers").addEventListener("click", () => {
    console.log("YM1 NEW BUTTON");
    ym(95302256, "reachGoal", "request to carriers")
  })

  const clearInputs = () => {
    const inputs = form.querySelectorAll(".input-group")
    inputs.forEach(function(el) {
      el.querySelector("input").value = ""
      el.classList.remove('input-group--focus')
      el.classList.remove('input-group--notempty')
    });
  }

  form.querySelector('input[name="payments"]').addEventListener("change", () => {
    form.querySelector('input[name="route-form"]').focus()
  })

  // Добавляем обработчик события submit
  form.addEventListener('submit', function(event) {




    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const routeFromInput = form.querySelector('input[name="route-form"]');
    const routeToInput = form.querySelector('input[name="route-to"]');
    const conditionsInput = form.querySelector('input[name="conditions"]');
    const paymentsInput = form.querySelector('input[name="payments"]');
    // Предотвращаем стандартное поведение формы (отправку по умолчанию)
    event.preventDefault();
    const btn = form.querySelector(".blue-btn")

    btn.disabled = true;
    // Здесь можно добавить код для валидации формы перед отправкой
    // Например, проверка на заполненность обязательных полей и др.

    // Отправляем форму с помощью fetch
    fetch('https://api.1f.ru/api/telegram/order-landing-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value,
        phone: phoneInput.value,
        conditions: conditionsInput.value,
        route: `${routeFromInput.value} - ${routeToInput.value}`,
        payments: paymentsInput.checked? 1 : 0
      })
    })
    .then(response => {

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }


      return response.json();
    })
    .then(data => {
      nameInput.value = ""
      phoneInput.value = ""
      routeFromInput.value = ""
      routeToInput.value = ""
      conditionsInput.value = ""
      document.querySelector(".radio-row__item.is-active").classList.remove("is-active")
      openModal("modal-succ")
      clearInputs()
      btn.classList.add("is-disabled")
    })
    .catch(error => {
      nameInput.value = ""
      phoneInput.value = ""
      routeFromInput.value = ""
      routeToInput.value = ""
      conditionsInput.value = ""
      console.error('Ошибка при отправке запроса:', error);
      btn.classList.add("is-disabled")
      clearInputs()
      throw new Error('Ошибка при отправке запроса:');

      // Добавьте здесь код для обработки ошибки
    });
  });
  //ОТПРАВКА ФОРМЫ*****************************************


  //METRIKA
  const ymEls = document.querySelectorAll(".ym-el")
  ymEls.forEach( el => el.addEventListener("click", (e) => {
    const goal = e.target.dataset.goal
    ym(95302256,'reachGoal', goal)
  }))
  //METRIKA


});