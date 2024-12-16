export const initializeDatabase = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        profilePicture TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        UNIQUE(userId)
      );
      CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        profilePicture TEXT NOT NULL,
        email TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        UNIQUE(userId)
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivered BOOLEAN
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error while initializing database : ', error);
  }
};
