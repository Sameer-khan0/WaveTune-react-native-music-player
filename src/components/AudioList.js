import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioList = ({ item, currentTrack, isPlaying, playAudio, theme }) => {
  const styles = StyleSheet.create({
    listItem: {
      padding: 15,
      backgroundColor: currentTrack?.path === item.path ? theme.primary : theme.surface,
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
  });

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        // Ensure the same track isn't played again when it's already playing
        if (currentTrack?.path !== item.path) {
          playAudio(item);
        }
      }}
    >
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
      onPress={() => playAudio(currentTrack)}
        name={currentTrack?.path === item.path && isPlaying ? 'pause' : 'play-arrow'}
        size={24}
        color={theme.text}
      />
    </TouchableOpacity>
  );
};

export default AudioList;
