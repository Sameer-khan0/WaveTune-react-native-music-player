import { View, Text, StyleSheet, useColorScheme, Image, Animated, ImageBackground } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import colors from '../constant/color';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing vector icon

export default function SplashScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;

  // Animation setup for fade and scale effect
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('AudioFolders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const backgroundImage = colorScheme === 'dark' 
    ? require('../constant/background.png')  // Dark mode background
    : require('../constant/lightbg.png');  // Light mode background

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
          <Image 
            source={require("../constant/icon.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.text }]}>
            WaveTune
          </Text>

          {/* Custom Loading Icon */}
          <Icon name="spinner" size={50} color={theme.accent} style={styles.loader} spin />

          <Text style={[styles.developerText, { color: theme.secondary }]}>
            By Muhammad Sameer
          </Text>

        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 15,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'uppercase',  // Adds a bit of styling for the app name
  },
  loader: {
    marginTop: 25,
    marginBottom: 35,
  },
  developerText: {
    fontSize: 14,  // Slightly larger to match the rest of the design
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,  // Slightly stronger text opacity
    marginTop: 5,
  },
  socialIcon: {
    marginTop: 10, // Space between developer text and social icon
  },
});
