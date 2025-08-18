import * as FileSystem from 'expo-file-system';
import { gql, useLazyQuery } from '@apollo/client';
import { useSQLiteContext } from 'expo-sqlite';

const GET_ANNOUNCEMENT = gql`
    query {
        announcements {
            _id
            createdBy { _id name }
            messages { type content order }
        }
    }
`;

const BASE_DIR = FileSystem.documentDirectory + 'chatapp/';

const DIRS = {
    images: BASE_DIR + 'images/',
    videos: BASE_DIR + 'videos/',
    audio: BASE_DIR + 'audio/',
    documents: BASE_DIR + 'documents/',
};


export async function createAnnouncementFolders() {
    for (let dir of Object.values(DIRS)) {
        const info = await FileSystem.getInfoAsync(dir);
        if (!info.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }
    }
}

async function downloadFileIfNeeded(url, type) {
    let folder, extension;

    switch (type) {
        case 'image':
            folder = DIRS.images;
            extension = '.jpg';
            break;
        case 'video':
            folder = DIRS.videos;
            extension = '.mp4';
            break;
        case 'audio':
            folder = DIRS.audio;
            extension = '.mp3';
            break;
        case 'document':
            folder = DIRS.documents;
            extension = '.pdf';
            break;
        default:
            folder = BASE_DIR;
            extension = '';
    }

    const fileName = url.split('/').pop()?.split('?')[0] || Date.now() + extension;
    const fileUri = folder + fileName;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
        return fileUri;
    }

    const { uri } = await FileSystem.downloadAsync(url, fileUri);
    return uri;
}

const db = useSQLiteContext();

async function saveAnnouncementToSQLite(announcement) {
    const existing = await db.getFirstAsync(
        `SELECT announcementId FROM announcements WHERE announcementId = ?`,
        [announcement._id]
    );
    if (existing) return;

    await db.runAsync(
        `INSERT INTO announcements (announcementId, createdBy, date) VALUES (?, ?, ?)`,
        [announcement._id, announcement.createdBy._id, new Date().toISOString()]
    );

    for (const msg of announcement.messages) {
        let contentToStore = msg.content;

        if (['image', 'video', 'audio', 'document'].includes(msg.type)) {
            contentToStore = await downloadFileIfNeeded(msg.content, msg.type);
        }

        await db.runAsync(
            `INSERT INTO messages (announcementId, type, content, orderNum) VALUES (?, ?, ?, ?)`,
            [announcement._id, msg.type, contentToStore, msg.order]
        );
    }
}


export async function syncAnnouncements(apiUrl) {
    await createAnnouncementFolders();

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query {
          announcements {
            _id
            createdBy { _id name }
            messages { type content order }
          }
        }
      `,
        }),
    });

    const [announcements] = useLazyQuery(GET_ANNOUNCEMENT, {
        onCompleted: async (data) => {
            if (!data?.announcements) return;
            for (const ann of data.announcements) {
                await saveAnnouncementToSQLite(ann);
            }
        }
    })
    announcements();
}
