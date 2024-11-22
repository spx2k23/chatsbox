import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('chatApp.db');

export const setupDatabase = async () => {
  try {
    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivered BOOLEAN
      );`
    );
    console.log('Messages table created successfully');

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        profilePicture TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        UNIQUE(userId)
      );`
    );
    console.log('Friends table created successfully');
  } catch (error) {
    console.error('Error setting up database', error);
  }
};

export default db;
