import { openDB } from 'idb';

export async function getDB() {
  return openDB('TutorDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id' });
      }
    },
  });
}
