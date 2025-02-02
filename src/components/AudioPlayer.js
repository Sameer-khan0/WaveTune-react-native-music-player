import React, {useState, useEffect} from 'react';
import { FlatList, View, Text, StyleSheet, Modal, TouchableOpacity, useColorScheme, Dimensions, Image } from 'react-native';
import AudioList from './AudioList';
import useAudioPlayer from './useAudioPlayer';
import colors from '../constant/color';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const AudioPlayer = ({audioFiles}) => {
  const { loading, currentTrack, currentTime, totalDuration, isPlaying, playAudio, formatTime, handleSeek, stopPlayback, setCurrentTime } = useAudioPlayer();

  const [showModal, setShowModal] = useState(false);
  const scheme = useColorScheme();
  const theme = colors[scheme] || colors.dark;

  const currentTrackIndex = audioFiles.findIndex(track => track.path === currentTrack?.path);

  const playNextTrack = () => {
    if (audioFiles[currentTrackIndex + 1]) {
      playAudio(audioFiles[currentTrackIndex + 1]);
    }
  };

  const playPreviousTrack = () => {
    if (audioFiles[currentTrackIndex - 1]) {
      playAudio(audioFiles[currentTrackIndex - 1]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    bottomControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.surface,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.primary + '22',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backdropFilter: 'blur(10px)',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: theme.surface,
      margin: 20,
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    artwork: {
      width: width * 0.6,
      height: width * 0.6,
      borderRadius: 10,
      backgroundColor: theme.primary + '22',
      marginBottom: 20,
    },
    trackInfo: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    artist: {
      color: theme.text + 'aa',
      fontSize: 16,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginVertical: 20,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    emptyText: {
      color: theme.text,
      textAlign: 'center',
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingBottom: 100}}
        data={audioFiles}
        keyExtractor={(item, index) => `${item.path}-${index}`}
        extraData={{currentTrack, isPlaying, currentTime}}
        renderItem={({item}) => (
          <AudioList
            item={item}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            playAudio={playAudio}
            theme={theme}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Loading...' : 'No audio files found'}
          </Text>
        }
      />

      {currentTrack && (
        <TouchableOpacity style={styles.bottomControls} onPress={() => setShowModal(true)} activeOpacity={0.8}>
          <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={30} color={theme.primary} onPress={() => playAudio(currentTrack)} />
          <View style={{flex: 1, marginHorizontal: 15}}>
            <Text style={[styles.title, {fontSize: 16}]} numberOfLines={1}>
              {currentTrack.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.path.split('/').slice(-2, -1)[0]}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{position: 'absolute', top: 40, right: 20}} onPress={() => setShowModal(false)}>
            <Icon name="close" size={30} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Image
              style={styles.artwork}
              source={{
                uri: 'https://avatars.githubusercontent.com/u/136972597?s=400&u=97d26c187b960a7ffe13e2d009fb295de7725175&v=4',
              }} // Replace with actual artwork
            />

            <View style={styles.trackInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack?.name}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack?.path.split('/').slice(-2, -1)[0]}
              </Text>
            </View>

            <View style={styles.timeRow}>
              <Text style={[styles.artist, {fontSize: 14}]}>{formatTime(currentTime)}</Text>
              <Text style={[styles.artist, {fontSize: 14}]}>{formatTime(totalDuration)}</Text>
            </View>

            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={totalDuration}
              value={currentTime}
              onSlidingComplete={handleSeek}
              onValueChange={value => setCurrentTime(value)}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.text + '44'}
              thumbTintColor={theme.primary}
            />

            <View style={styles.controlsRow}>
              <Icon name="skip-previous" size={40} color={theme.text} onPress={playPreviousTrack} />
              <Icon name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'} size={70} color={theme.primary} onPress={() => playAudio(currentTrack)} style={{marginHorizontal: 30}} />
              <Icon name="skip-next" size={40} color={theme.text} onPress={playNextTrack} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AudioPlayer;
