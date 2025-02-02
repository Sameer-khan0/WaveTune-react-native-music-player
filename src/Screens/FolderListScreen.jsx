import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AudioList from '../components/AudioPlayer';
import colors from '../constant/color';

export default function Player() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const route = useRoute();
  const { folderName, audioFiles } = route.params || {};

  if (!folderName || !audioFiles) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? colors.dark.surface : colors.light.surface }]}>
        <Text style={[styles.errorText, { color: isDark ? colors.dark.accent : colors.light.accent }]}>
          Missing folder or audio files data.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.dark.background : colors.light.background }]}>
      <Text style={[styles.folderTitle, { color: isDark ? colors.dark.primary : colors.light.primary }]}>
        {folderName}
      </Text>
      <AudioList audioFiles={audioFiles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  folderTitle: {
    fontSize: 26,
    fontWeight: '600',
    paddingLeft: 15,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
