import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('chatApp.db');

export const setupDatabase = () => {
  db.transaction((tx) => {
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivered BOOLEAN
      );`,
      [],
      () => console.log('Messages table created successfully'),
      (txObj, error) => console.error('Error creating messages table', error)
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        profilePicture TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber NUMBER NOT NULL,
        UNIQUE(userId)
      );`,
      [],
      () => console.log('Friends table created successfully'),
      (txObj, error) => console.error('Error creating friends table', error)
    );

  });
};

export default db;
