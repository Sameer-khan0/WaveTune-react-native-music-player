import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/color'; // Import the color theme

export default function DeveloperScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] || colors.light; // Default to light if no scheme

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.background}]}
      contentContainerStyle={{paddingBottom: 30}} // Adding padding to bottom
    >
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://avatars.githubusercontent.com/u/136972597?s=400&u=97d26c187b960a7ffe13e2d009fb295de7725175&v=4', // Sameer Khan's GitHub Avatar
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.developerName, {color: theme.text}]}>Sameer Khan</Text>
        <Text style={[styles.developerBio, {color: theme.text}]}>
          Crafting engaging web and mobile applications using cutting-edge
          technologies and design.
        </Text>
      </View>

      {/* Current Focus Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, {color: theme.primary}]}>🌟 Current Focus</Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **React.js & Next.js**: Building blazing-fast web applications.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **React Native with Expo**: Developing smooth cross-platform mobile
          apps.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **Figma & Animations**: Designing stunning UIs with interactive
          animations.
        </Text>
      </View>

      {/* Skills Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, {color: theme.primary}]}>💼 Skills</Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **Frontend & Mobile Development**: React.js, React Native, Expo.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **Backend**: Node.js, Express.js.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **UI/UX**: Figma, prototyping, and Lottie animations.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - **Optimization**: Accessibility, performance, and responsive design.
        </Text>
      </View>

      {/* Latest Project Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, {color: theme.primary}]}>🚀 Latest Project</Text>
        <Text style={[styles.projectTitle, {color: theme.text}]}>NexShare</Text>
        <Text style={[styles.projectDescription, {color: theme.text}]}>
          A **Next.js** platform for secure post-sharing with authentication and
          authorization.{' '}
        </Text>
        <Text style={[styles.projectFeatures, {color: theme.text}]}>
          ✔ Features in progress: animations, enhanced UI, and mobile
          optimization.
        </Text>
        <TouchableOpacity
          style={[styles.projectLink, {backgroundColor: theme.primary}]}
          onPress={() => Linking.openURL('https://nex-share.vercel.app/')}>
          <Text style={[styles.projectLinkText, {color: theme.background}]}>View Project</Text>
        </TouchableOpacity>
      </View>

      {/* Collaboration Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, {color: theme.primary}]}>🤝 Let’s Collaborate</Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          I’m open to collaborating on projects involving:
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - Web and mobile app development.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>
          - Animation-rich UI/UX designs.
        </Text>
        <Text style={[styles.sectionContent, {color: theme.text}]}>- Open-source contributions.</Text>
      </View>

      {/* Contact Section */}
      <View style={styles.contactContainer}>
        <Text style={[styles.sectionTitle, {color: theme.primary}]}>🌐 Get in Touch</Text>
        <TouchableOpacity
          style={[styles.contactLink, {backgroundColor: theme.surface}]}
          onPress={() =>
            Linking.openURL(
              'https://www.linkedin.com/in/muhammad-sameer-719b9a270?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
            )
          }>
          <Icon name="logo-linkedin" size={24} color={theme.primary} />
          <Text style={[styles.contactText, {color: theme.text}]}>LinkedIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactLink, {backgroundColor: theme.surface}]}
          onPress={() => Linking.openURL('mailto:muhmmadsameer86@gmail.com')}>
          <Icon name="mail" size={24} color={theme.primary} />
          <Text style={[styles.contactText, {color: theme.text}]}>Email</Text>
        </TouchableOpacity>
      </View>

      {/* Repositories Section */}
      <View style={styles.repositoriesContainer}>
        {/* <Text style={[styles.sectionTitle, {color: theme.primary}]}>
           Check out my repositories for more projects and ideas!
        </Text> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  developerBio: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  projectFeatures: {
    fontSize: 16,
    marginBottom: 10,
  },
  projectLink: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  projectLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactContainer: {
    marginBottom: 30,
  },
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 10,
    borderRadius: 30,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
  },
  repositoriesContainer: {
    marginTop: 20,
  },
});
