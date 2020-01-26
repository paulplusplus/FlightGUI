//Caching strategy #2

const cacheName = 'v1'; //Call v1 - you might have different versions
//Lets work with caching - we need to cache our stuff

//Service worker
//Call install event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});

//Call Activate event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  //Remove old or unwanted caches

  e.waitUntil(
    caches
      .keys() //We'll loop through our cache keys
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== cacheName) {
              console.log('Service Worker: Clearing old cache');
              return caches.delete(cache);
            }
          })
        );
      })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  //First, lets check if the live site is available.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        //Basically, make a clone/copy of response
        const resClone = res.clone(); //Clone response
        caches.open(cacheName).then(cache => {
          //Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res)) //As long as someone visited site once, it ought to be in the cache.
  );
});