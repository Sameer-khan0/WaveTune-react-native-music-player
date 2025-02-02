import { StyleSheet, Dimensions } from 'react-native';
import colors from '../constant/color';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // You can replace this with the theme's background color
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', // Replace with theme surface color
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white', // Replace with theme's background color
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white', // Replace with theme's surface color
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  artwork: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 10,
    backgroundColor: 'gray', // Replace with theme color
    marginBottom: 20,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artist: {
    fontSize: 16,
    color: 'gray', // Replace with theme text color
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
    color: 'gray', // Replace with theme text color
    textAlign: 'center',
    marginTop: 20,
  },
});
