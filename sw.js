// Service Worker: speichert alle Dateien, damit die Meme Maschine auch offline läuft.
// Die Seite selbst wird immer frisch geladen (wenn online). Bei neuen/geänderten
// Sounds oder Bildern die Versionsnummer erhöhen, dann wird alles neu gespeichert.
const CACHE = 'mememaschine-v4';

const FILES = [
  './',
  'index.html',
  'manifest.json',
  'img/start.png',
  'img/menu.png',
  'img/icon-192.png',
  'img/icon-512.png',
  'audio/garnix.m4a',
  'audio/Brother ueh.mp4',
  'audio/What the Dog.mp4',
  'audio/What the Hell.mp4',
  'audio/Schnusepiep.mp4',
  'audio/Ah Shit hear we go again.mp4',
  'audio/Ewe Dude WTF.mp4',
  'audio/He Fucked up.mp4',
  'audio/No God Please no.mp4',
  'audio/Okay.mp4',
  'audio/Why are you Gay.mp4',
  'audio/Was ist denn mit Karsten los.mp4',
  'audio/Emotional damage.mp4',
  'audio/Was juckt mich des.mp4',
  'audio/Alarm.mp4',
  'audio/Chicken nuggets.mp4',
  'audio/Kranpätze.mp4',
  'audio/Warum.mp4',
  'audio/was machen sachen.mp4',
  'audio/Denkmal der dummheit.mp4',
  'audio/whait a minute.mp4',
  'audio/Nice.mp4',
  'audio/Super.mp4',
  'audio/Unfall.mp4',
  'audio/der Gäreät.mp4',
  'audio/nein doch oh.mp4',
  'audio/Fahrräder.mp4',
  'audio/forca ist runtergeladen.mp4',
  'audio/halt stop.mp4',
  'audio/hünhen mit reis.mp4',
  'audio/Ich muss raus.mp4',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => encodeURI(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isPage = event.request.mode === 'navigate' || /\.(html|json|js)$/.test(url.pathname);

  if (isPage) {
    // Seite & Code: erst online versuchen (damit Updates sofort ankommen), sonst Cache
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
  } else {
    // Sounds & Bilder: aus dem Cache, das geht am schnellsten
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true })
        .then((hit) => hit || fetch(event.request))
    );
  }
});
