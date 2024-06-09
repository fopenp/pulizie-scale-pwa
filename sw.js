const PERCORSO="/pulizie-scale-pwa";
const VERSIONE="v1";
const NOME_CACHE=`pulizie-scale-pwa-${VERSIONE}`;

const URLS = [
    `${PERCORSO}/`,
    `${PERCORSO}/index.html`,
    `${PERCORSO}/index.js`,
    `${PERCORSO}/index.css`,
    `${PERCORSO}/icona-ps-pwa.svg`,
    `${PERCORSO}/icone/icona-ps-pwa-512.png`,
    `${PERCORSO}/icone/icona-ps-pwa-256.png`,
    `${PERCORSO}/icone/icona-ps-pwa-180.png`,
    `${PERCORSO}/icone/icona-ps-pwa-152.png`,
    `${PERCORSO}/icone/icona-ps-pwa-128.png`,
    `${PERCORSO}/icone/icona-ps-pwa-120.png`,
    `${PERCORSO}/icone/icona-ps-pwa-76.png`,
    `${PERCORSO}/icone/icona-ps-pwa-64.png`,
    `${PERCORSO}/icone/icona-ps-pwa-60.png`,
    `${PERCORSO}/icone/icona-ps-pwa-48.png`,
    `${PERCORSO}/manifest.json`
];

self.addEventListener("install", (ev) => {
    ev.waitUntil(
        (async () => {
            const cache = await caches.open(NOME_CACHE);
            cache.addAll(URLS);
        })()
    );
});

self.addEventListener("activate", (ev) => {
    ev.waitUntil(
        (async () => {
            const nomi = await caches.keys();
            await Promise.all(
                nomi.map((nome) => {
                    if (nome !== NOME_CACHE) {
                        return caches.delete(nome);
                    }
                })
            );
            await clients.claim();
        })()
    );
});

self.addEventListener("fetch", (ev) => {
    if (ev.request.mode === "navigate") {
        ev.respondWith(caches.match(`${PERCORSO}/`));
        return;
    }

    ev.respondWith(
        (async () => {
            const cache = await caches.open(NOME_CACHE);
            const rispostaCachata = await cache.match(ev.request.url);
            if (rispostaCachata) {
                return rispostaCachata;
            }
            return new Response(null, { status: 404 });
        })()
    );
});
