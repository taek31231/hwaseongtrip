/* 화성지질공원 야외지질 기록장 — 오프라인 캐시
   파일을 고친 뒤에는 아래 CACHE 버전의 숫자를 올리세요.
   그래야 학생 기기에서 새 버전으로 바뀝니다. */
const CACHE = "hwaseong-field-guide-v6";
const FILES = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
    "assets/img/cover-f0.webp",
    "assets/img/cover-f1.webp",
    "assets/img/cover-f2.webp",
    "assets/img/cover-f3.webp",
    "assets/img/cover-f4.webp",
    "assets/img/cover-f5.webp",
    "assets/img/cover-f6.webp",
    "assets/img/cover-f7.webp",
    "assets/img/cover-w0.webp",
    "assets/img/cover-w1.webp",
    "assets/img/cover-w2.webp",
    "assets/img/cover-w3.webp",
    "assets/img/cover-w4.webp",
    "assets/img/fig-2.webp",
    "assets/img/fig-3.webp",
    "assets/img/fig-4.webp",
    "assets/img/fig-b0.webp",
    "assets/img/fig-b2.webp",
    "assets/img/fig-hwaseong.webp",
    "assets/img/fig-i26.webp",
    "assets/img/fig-i3.webp",
    "assets/img/fig.webp"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 캐시 우선 — 현장에서 통신이 끊겨도 열린다
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      if (hit) {
        fetch(e.request).then(r => {
          if (r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        }).catch(() => {});
        return hit;
      }
      return fetch(e.request).then(r => {
        if (r && r.ok && new URL(e.request.url).origin === location.origin) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => caches.match("index.html"));
    })
  );
});
