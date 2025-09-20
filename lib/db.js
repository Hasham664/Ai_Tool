import { openDB } from 'idb';

let dbInstance = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB('TutorDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('historyTutor')) {
        db.createObjectStore('historyTutor', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('historyMock')) {
        db.createObjectStore('historyMock', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}
