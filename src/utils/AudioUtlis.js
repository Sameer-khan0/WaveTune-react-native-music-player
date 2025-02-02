import {PermissionsAndroid, Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const sdkVersion = Platform.Version;
      let permission;

      if (sdkVersion >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
      } else {
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const listAudioFiles = async () => {
  const audioExtensions = new Set(['mp3', 'aac', 'wav', 'm4a']);
  
  const traverseDirectory = async dirPath => {
    try {
      const files = await RNFS.readDir(dirPath);
      let results = [];

      for (const file of files) {
        if (file.isDirectory()) {
          if (file.name.startsWith('.') || file.name === 'Android') continue;
          const subResults = await traverseDirectory(file.path);
          results = results.concat(subResults);
        } else {
          const ext = file.name.split('.').pop().toLowerCase();
          if (audioExtensions.has(ext)) {
            results.push(file);
          }
        }
      }
      return results;
    } catch (error) {
      console.log('Directory access error:', dirPath, error.message);
      return [];
    }
  };

  const commonDirs = [
    RNFS.ExternalStorageDirectoryPath + '/Music',
    RNFS.ExternalStorageDirectoryPath + '/Downloads',
    RNFS.ExternalStorageDirectoryPath + '/Download',
    RNFS.ExternalStorageDirectoryPath + '/DCIM',
  ];

  let allFiles = [];
  for (const dir of commonDirs) {
    const files = await traverseDirectory(dir);
    allFiles = allFiles.concat(files);
  }

  return allFiles;
};
