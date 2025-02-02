import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const useAudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const intervalRef = useRef(null);

  const currentSoundRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    fetchAudioFiles();
    return () => cleanup();
  }, []);

  const cleanup = () => {
    stopPlayback();
    stopProgressTimer();
  };

  const fetchAudioFiles = async () => {
    const hasPermission = await requestStoragePermission();
    if (hasPermission) {
      const files = await listAudioFiles();
      setAudioFiles(files);
    } else {
      console.log('Storage permission denied');
    }
    setLoading(false);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      try {
        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const listAudioFiles = async () => {
    const audioExtensions = new Set(['mp3', 'aac', 'wav', 'm4a']);
  
    const traverseDirectory = async (dirPath, groupedFiles = {}) => {
      try {
        const files = await RNFS.readDir(dirPath);
  
        for (const file of files) {
          if (file.isDirectory()) {
            if (file.name.startsWith('.') || file.name === 'Android') continue;
            await traverseDirectory(file.path, groupedFiles);
          } else {
            const ext = file.name.split('.').pop().toLowerCase();
            if (audioExtensions.has(ext)) {
              const dirName = dirPath.split('/').pop(); 
              if (!groupedFiles[dirName]) {
                groupedFiles[dirName] = [];
              }
              groupedFiles[dirName].push(file);
            }
          }
        }
      } catch (error) {
        console.log('Directory access error:', dirPath, error.message);
      }
      return groupedFiles;
    };

    const commonDirs = [
      RNFS.ExternalStorageDirectoryPath + '/Music',
      RNFS.ExternalStorageDirectoryPath + '/Downloads',
      RNFS.ExternalStorageDirectoryPath + '/Download',
      RNFS.ExternalStorageDirectoryPath + '/DCIM'
    ];

    let groupedAudioFiles = {};
    for (const dir of commonDirs) {
      groupedAudioFiles = await traverseDirectory(dir, groupedAudioFiles);
    }
  
    return groupedAudioFiles;
  };

  const playAudio = async (file) => {
    // Check if the same track is clicked to toggle play/pause
    if (currentTrack?.path === file.path) {
      if (isPlaying) {
        // If already playing, pause the audio
        currentSoundRef.current?.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
        stopProgressTimer();
      } else {
        // If paused, resume the audio
        currentSoundRef.current?.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        startProgressTimer();
      }
      return;
    }
  
    // Stop any currently playing audio before starting the new track
    stopPlayback();  // Stops any previously playing audio and resets the state
  
    try {
      // Initialize the Sound object for the new track
      const sound = new Sound(file.path, '', (error) => {
        if (error) {
          console.log('Error initializing sound:', error);
          return;
        }
  
        // Set the current track and its duration
        setCurrentTrack(file);
        setTotalDuration(sound.getDuration());
        currentSoundRef.current = sound;
  
        // Play the sound
        sound.play((success) => {
          if (!success) {
            console.log('Playback error occurred');
          }
          stopPlayback();
        });
  
        setIsPlaying(true);
        isPlayingRef.current = true;
        startProgressTimer();
      });
    } catch (error) {
      console.log('Sound initialization error:', error);
    }
  };
  

  const stopPlayback = () => {
    stopProgressTimer();
    setIsPlaying(false);
    isPlayingRef.current = false;

    if (currentSoundRef.current) {
      currentSoundRef.current.stop(() => {
        if (currentSoundRef.current) {
          currentSoundRef.current.release();
        }
        currentSoundRef.current = null;
      });
    }
    setCurrentTime(0);
    setCurrentTrack(null);
  };

  const handleSeek = (time) => {
    if (currentSoundRef.current) {
      currentSoundRef.current.setCurrentTime(time, (success) => {
        if (success) setCurrentTime(time);
      });
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    intervalRef.current = setInterval(() => {
      if (currentSoundRef.current && isPlayingRef.current) {
        currentSoundRef.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
          if (seconds >= totalDuration) stopPlayback();
        });
      }
    }, 500);
  };

  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    audioFiles,
    loading,
    currentTrack,
    currentTime,
    totalDuration,
    isPlaying,
    playAudio,
    formatTime,
    currentSound,
    setCurrentTime,
    handleSeek
  };
};

export default useAudioPlayer;
