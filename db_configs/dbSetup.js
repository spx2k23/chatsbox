import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('chatApp.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql('PRAGMA journal_mode = WAL;');

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivered BOOLEAN NOT NULL CHECK (delivered IN (0, 1))
      );`,
      [],
      () => console.log('Messages table created successfully'),
      (_, error) => {
        console.error('Error creating messages table:', error);
        return true;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        profilePicture TEXT,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL
      );`,
      [],
      () => console.log('Friends table created successfully'),
      (_, error) => {
        console.error('Error creating friends table:', error);
        return true;
      }
    );
  });
};

export default db;
