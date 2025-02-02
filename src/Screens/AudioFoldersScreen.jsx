import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useAudioPlayer from '../components/useAudioPlayer';
import colors from '../constant/color';

export default function Player({navigation}) {
  const {loading, audioFiles} = useAudioPlayer();
  const colorScheme = useColorScheme();
  const isDark =  colorScheme === "dark";

  const theme = colors[colorScheme] || colors.dark;

  const getUniqueFolders = filesObject => {
    if (filesObject && typeof filesObject === 'object') {
      return Object.keys(filesObject);
    }
    return [];
  };

  const folders = loading ? [] : getUniqueFolders(audioFiles || {});

  const handleFolderPress = folderName => {
    const folderAudioFiles = audioFiles?.[folderName] || [];
    const serializedAudioFiles = folderAudioFiles.map(file => {
      return {
        ...file,
        mtime: file.mtime ? file.mtime.toISOString() : null,
        isFile: undefined,
      };
    });
    navigation.navigate('FolderList', {
      folderName,
      audioFiles: serializedAudioFiles,
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : (
        <>
          <Text
            style={[
              styles.folderTitle,
              {
                color: theme.primary,
              },
            ]}>
            Folders
          </Text>

          <FlatList
            data={folders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.folderItem, {backgroundColor: theme.surface, borderColor: theme.border}]}
                onPress={() => handleFolderPress(item)}>
                <Icon
                  name="folder"
                  size={24}
                  color={isDark ? 'white' : 'black'}
                  style={styles.folderIcon}
                />
                <Text style={[styles.folderText, {color: theme.text}]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, {color: theme.text}]}>
                No audio folders found.
              </Text>
            }
          />
        </>
      )}

      {/* Circular Developer Button on Right with Icon */}
      <TouchableOpacity
        style={[styles.developerButton, {backgroundColor: theme.primary}]}
        onPress={() => navigation.navigate("Developer")}>
        <Icon name="code-slash" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  loader: {
    marginTop: 30,
  },
  folderTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    paddingLeft: 10,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  folderIcon: {
    marginRight: 15,
  },
  folderText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  developerButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff', // Border around the button
    elevation: 5,
  },
});
