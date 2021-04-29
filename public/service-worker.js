/* Cache version */
const cacheName = 'v1';

/* Service worker event handlers */
const eventHandlers = {
    install: e => e.waitUntil(caches.open(cacheName).then(cache => cache.add('/'))),
    activate: e =>
        e.waitUntil(
            caches
                .keys()
                .then(cacheNames =>
                    Promise.all(
                        cacheNames
                            .filter(cache => cache !== cacheName)
                            .map(cache => caches.delete(cache))
                    )
                )
        ),
    fetch: e =>
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const resClone = res.clone();
                    caches.open(cacheName).then(cache => cache.put(e.request, resClone));
                    return res;
                })
                .catch(() => caches.match(e.request))
        ),
};

/* Hooking up listeners */
Object.entries(eventHandlers).map(([event, handler]) => self.addEventListener(event, handler));
