import * as FileSystem from "expo-file-system";

const baseFolder = `${FileSystem.documentDirectory}chatapp/`;

const folders = {
  image: `${baseFolder}images/`,
  audio: `${baseFolder}audio/`,
  video: `${baseFolder}videos/`,
  document: `${baseFolder}documents/`,
};

export async function SetupFolders() {
  await FileSystem.makeDirectoryAsync(baseFolder, { intermediates: true });
  for (let path of Object.values(folders)) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}
