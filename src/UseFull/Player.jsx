
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import colors from '../constant/color';

const AudioPlayer = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const intervalRef = useRef();
  const scheme = useColorScheme();
  const theme = colors[scheme] || colors.dark;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    listItem: {
      padding: 15,
      backgroundColor: theme.surface,
      marginVertical: 5,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    trackInfo: {
      flex: 1,
      marginLeft: 10,
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    path: {
      color: theme.text,
      opacity: 0.7,
      fontSize: 12,
    },
    controls: {
      padding: 20,
      backgroundColor: theme.surface,
      borderRadius: 10,
      marginVertical: 10,
    },
    progress: {
      color: theme.text,
      fontSize: 12,
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });

  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stop();
        currentSound.release();
      }
      clearInterval(intervalRef.current);
    };
  }, [currentSound]);

  useEffect(() => {
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

    fetchAudioFiles();
  }, []);

  const requestStoragePermission = async () => {
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

  const listAudioFiles = async () => {
    const audioExtensions = new Set(['mp3', 'aac', 'wav', 'm4a']);

    const traverseDirectory = async dirPath => {
      try {
        const files = await RNFS.readDir(dirPath);
        let results = [];

        for (const file of files) {
          if (file.isDirectory()) {
            // Skip Android system directories to improve performance
            if (file.name.startsWith('.')) continue;
            if (file.name === 'Android') continue;

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

    // Start traversal from common media directories
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

  const updateProgress = () => {
    if (currentSound) {
      currentSound.getCurrentTime(secs => {
        setCurrentTime(secs);
        if (secs >= totalDuration - 1) {
          // Added tolerance to avoid false stop at the end
          stopPlayback();
        }
      });
    }
  };
  
  const startProgressTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        updateProgress(); // Update progress every second
      }, 1000);
    }
  };

  
  
  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopPlayback = () => {
    clearInterval(intervalRef.current); // Clear interval on stop
    setIsPlaying(false);
    setCurrentTime(0);
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      setCurrentSound(null);
    }
  };

  const playAudio = async (file) => {
    if (currentTrack?.path === file.path) {
      if (isPlaying) {
        currentSound.pause();
        setIsPlaying(false);
        stopProgressTimer();  // Stop progress when paused
      } else {
        currentSound.play(() => {
          setIsPlaying(true);
          startProgressTimer();  // Start the progress timer when playback resumes
        });
        setIsPlaying(true);
        startProgressTimer(); // Start the progress timer when playback starts
      }
      return;
    }
  
    stopPlayback(); // Ensure any previous audio is stopped
  
    setCurrentTrack(file);
  
    // Start progress timer before creating sound
    startProgressTimer();
  
    const sound = new Sound(file.path, '', (error) => {
      if (error) {
        console.log('Failed to load sound:', error);
        return;
      }
  
      setTotalDuration(sound.getDuration());
  
      sound.play(() => {
        setIsPlaying(true);
      });
  
      setCurrentSound(sound);
      setIsPlaying(true);
    });
  };
  

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        currentTrack?.path === item.path && {backgroundColor: theme.primary},
      ]}
      onPress={() => playAudio(item)}>
      <Icon
        name={currentTrack?.path === item.path ? 'music-note' : 'library-music'}
        size={24}
        color={theme.text}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.path} numberOfLines={1}>
          {item.path.split('/').slice(-3).join('/')}
        </Text>
      </View>
      <Icon
        name={
          currentTrack?.path === item.path && isPlaying ? 'pause' : 'play-arrow'
        }
        size={24}
        color={theme.text}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      contentContainerStyle={{padding: 20}}
      data={audioFiles}
      keyExtractor={item => item.path}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={{color: theme.text, textAlign: 'center'}}>
          No audio files found
        </Text>
      }
      ListHeaderComponent={
        currentTrack && (
          <View style={styles.controls}>
            <Text style={[styles.title, {marginBottom: 10}]}>
              {currentTrack.name}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={totalDuration}
              value={currentTime}
              onSlidingComplete={value => {
                currentSound.setCurrentTime(value);
                setCurrentTime(value);
              }}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.text}
              thumbTintColor={theme.primary}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.progress}>{formatTime(currentTime)}</Text>
              <Text style={styles.progress}>{formatTime(totalDuration)}</Text>
            </View>
          </View>
        )
      }
      ListFooterComponent={
        loading && <ActivityIndicator size="large" color={theme.primary} />
      }
    />
  );
};

// Keep the permission and file listing logic from previous version
// [Include the same permission handling and listAudioFiles function here]

export default AudioPlayer;
