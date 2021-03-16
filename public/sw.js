let cacheName = `phaser-v1`;

let filesToCache = [
  `/`,
  `/index.html`,
  `/logo.png`,
  `/logo192.png`,
  `/dude.png`,
  `/logo512.png`,
  `/favicon.ico`,
  `http://labs.phaser.io/assets/particles/red.png`
];


self.addEventListener(`install`, function (event) {

  console.log(`установка sw`);

  event.waitUntil( // определяем успешность установки.

      caches.open(cacheName).then(function (cache) {
      // Этот метод берет имя кеша, который вы хотите открыть (cacheName) и возвращает промис, который будет преобразован в объект кеша, хранящийся в браузере пользователя.
        console.log(`sw кеширует файлы`);

        return cache.addAll(filesToCache);

      }).catch(function (err) {

        console.log(err);
      // если какой-либо из файлов не загружается в кеш, весь этап установки завершится неудачно.
      })

  );

});

self.addEventListener(`activate`, async (event) => {
  console.log(`activate sw`);
  event.waitUntil(
      caches.keys() // keyList все текущие кеши для нашего Service Worker.
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log(`удаление старого кеша sw`, key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener(`fetch`, (event) => {
  // Это событие вызывается каждый раз, когда делается запрос, который входит в область видимости нашего Service Worker.
  console.log(`fetch sw`);
  event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      }).catch(function (error) {
        console.log(error);
      })
  );
});
