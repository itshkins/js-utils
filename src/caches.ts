export function cacheWithObject(storage, key, callback) {
  if (key in storage) {
    return storage[key];
  }
  storage[key] = callback();
  return storage[key];
}

export function cacheWithMap(storage, key, callback) {
  if (storage.has(key)) {
    return storage.get(key);
  }
  storage.set(key, callback());
  return storage.get(key);
}
