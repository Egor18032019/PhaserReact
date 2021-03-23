const staticCacheName = `s-phaser-v4`;
const dynamicCacheName = `d-phaser-v4`;

let filesToCache = [
  `/index.html`,
  `/logo.png`,
  `/logo192.png`,
  `/dude.png`,
  `/logo512.png`,
  `/favicon.ico`,
];


self.addEventListener(`install`, function (event) {
  console.log(`установка sw`);

  event.waitUntil( // определяем успешность установки.
      caches.open(staticCacheName).then(function (cache) {
      // Этот метод берет имя кеша, который вы хотите открыть (cacheName) и возвращает промис, который будет преобразован в объект кеша, хранящийся в браузере пользователя.
        console.log(`sw кеширует файлы`);
        return cache.addAll(filesToCache);
      })
    .catch(function (err) {
      console.log(err);
      // если какой-либо из файлов не загружается в кеш, весь этап установки завершится неудачно.
    })

  );

});

self.addEventListener(`activate`, async (event) => {
  console.log(`activate sw`);
  const cacheNames = await caches.keys();
  await Promise.all(
      cacheNames
    .filter((name) => name !== staticCacheName)
    .filter((name) => name !== dynamicCacheName)
    .map((name) => {
      caches.delete(name);
      console.log(cacheNames);
    })
    // убираю нужное и удалю все ненужное
  );
});

self.addEventListener(`fetch`, (event) => {
  // Это событие вызывается каждый раз, когда делается запрос, который входит в область видимости нашего Service Worker.
  console.log(`fetch sw`);
  const {
    request
  } = event;
  console.log(request);

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    console.log(url.origin === location.origin);
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || await fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || await caches.match(`/offline.html`);
  }
}
