document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('hero-form');

    // Функция для валидации формы
    function validateForm() {

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
  
      const errors = {};
  
      // Проверка имени
  
      console.log("nameInput.value", nameInput.value);
      if (!nameInput.value) {
          errors.name = 'Введите информацию';
      }
  
      // Проверка номера телефона
      if (!phoneInput.value) {
          errors.phone = 'Введите номер телефона';
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




    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    // Предотвращаем стандартное поведение формы (отправку по умолчанию)
    event.preventDefault();
    const btn = form.querySelector(".blue-btn")

    btn.disabled = true;
    // Здесь можно добавить код для валидации формы перед отправкой
    // Например, проверка на заполненность обязательных полей и др.

    // Отправляем форму с помощью fetch
    fetch('https://devapi.1f.ru/api/landing/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value,
        phone: phoneInput.value,
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
      openModal("modal-succ")
      clearInputs()
      btn.classList.add("is-disabled")
    })
    .catch(error => {
      nameInput.value = ""
      phoneInput.value = ""
      console.error('Ошибка при отправке запроса:', error);
      btn.classList.add("is-disabled")
      clearInputs()
      throw new Error('Ошибка при отправке запроса:');

      // Добавьте здесь код для обработки ошибки
    });
  });
})