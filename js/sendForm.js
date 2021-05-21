const server = 'https://jsonplaceholder.typicode.com/posts';

const sendData = (data, callback, falseCallBack) => {
  const request = new XMLHttpRequest();
  request.open('POST', server);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;
    if (request.status === 200 || request.status === 201) {
      const response = JSON.parse(request.responseText)
      callback(response.id);
    } else {
      falseCallBack(request.statusText)
      throw new Error(request.statusText)
    }
  });

  request.send(data);
};

const formElems = document.querySelectorAll('.form');

const formHandler = (form) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = {};

    const smallElem = document.createElement('small');
    const submitButtons = form.querySelectorAll('button');

    for (const { name, value } of form.elements) {
      if (name) {
        data[name] = value;
        if (!/\S/.test(data[name])) {
          smallElem.textContent = 'Заполните все поля';
          smallElem.style.color = 'red';
          form.append(smallElem);
          setTimeout(function () {
            smallElem.remove();
          }, 2000);
          return;
        }
      }
    }

    const blockSubmit = () => {
      submitButtons.forEach(submitButton => {
        submitButton.disabled = true;
        submitButton.style.background = 'gray';
        submitButton.style.cursor = 'not-allowed';
      })
    };

    const unblockSubmit = () => {
      submitButtons.forEach(submitButton => {
        submitButton.disabled = false;
        submitButton.style.background = 'linear-gradient(93.53deg, #ED3125 11.43%, #E8223A 80.79%)';
        submitButton.style.cursor = 'pointer';
      })
    };


    sendData(JSON.stringify(data),
      (id) => {
        smallElem.textContent = `Ваша заявка №: ${id}!
        В ближайшее время с Вами свяжемся!`;
        smallElem.style.color = 'green';
        form.append(smallElem);
        blockSubmit();
      }, (err) => {
        smallElem.textContent = `К сожалению технические неполадки, попробуйте отправить заявку позже.`;
        smallElem.style.color = 'red';
        form.append(smallElem);
        blockSubmit();
      });

    form.reset();
    setTimeout(function () {
      smallElem.remove();
      unblockSubmit();
    }, 5000);
  })
};

formElems.forEach(formHandler)
