const wsUri = "wss://echo-ws-service.herokuapp.com";

const chat = document.getElementById("chat");
const btnSend = document.querySelector(".send_button");
const btnGeo = document.querySelector(".geolocation");

let websocket;

function writeToScreen(message) {
    let pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    chat.appendChild(pre);
};

function writeMessage(message) {
    let mes = document.createElement("p");
    mes.innerHTML = '<p style="color:black;margin-left:335px;border:5px solid #ADD8E6;padding:10px 15px;width:170px;text-align:center;border-radius:10px;">' + message + '</p>';
    chat.appendChild(mes);
};

function writeLocation(latitude, longitude) {
    let geo = document.createElement("a");
    geo.innerHTML = '<a href="https://www.openstreetmap.org/#map=18/' + latitude + '/' + longitude + '"; style="color:black;margin-top:8px;margin-left:335px;border:5px solid #ADD8E6;padding:10px 15px;width:170px;text-align:center;border-radius:10px;display:block;" target="_blank">Геолокация</a>';
    chat.appendChild(geo);
}

websocket = new WebSocket(wsUri);
websocket.onmessage = function(evt) {
    writeToScreen('<p style="color:black;margin-left:10px;border:5px solid #ADD8E6;padding:10px 15px;width:170px;text-align:center;border-radius: 10px;">' + evt.data + '</p>');
    };

btnSend.addEventListener("click", () => {
    const message = document.querySelector(".form__input").value;
    writeMessage(message);
    websocket.send(message);
});

document.querySelector(".form__input").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        btnSend.click();
    };
});

// Функция, выводящая текст об ошибке
const error = () => {
    writeToScreen('Невозможно получить ваше местоположение');
  };

// Функция, срабатывающая при успешном выполнении геолокации
const success = (position) => {
    console.log('position', position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    writeLocation(latitude, longitude);
    websocket.send(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    websocket.close();
    websocket = null;
};

btnGeo.addEventListener("click", () => {
    if(!navigator.geolocation) {
       writeToScreen('<p style="color:black;margin-left:10px;border:5px solid #ADD8E6;padding:10px 15px;width:170px;text-align:center;border-radius:10px;">Невозможно получить ваше местоположение</p>');
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      };
});