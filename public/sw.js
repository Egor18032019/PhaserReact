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

  event.waitUntil( // который принимает промис в качестве аргумента и использует его для определения успешности установки.

      caches.open(cacheName).then(function (cache) {

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

});

self.addEventListener(`fetch`, (event) => {
  // Это событие вызывается каждый раз, когда делается запрос, который входит в область видимости нашего Service Worker.
  console.log(`fetch sw`);
  console.log(event.request.url);
  event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      }).catch(function (error) {
        console.log(error);
      })
  );
});
