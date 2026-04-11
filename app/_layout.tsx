import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { PROC_COLORS } from '../constants/procs';

export const unstable_settings = {
  anchor: '(tabs)',
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    primary: PROC_COLORS.yellow,
    card: '#111827',
    text: '#FFFFFF',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ImageBackground
      source={require('../assets/images/runefencer.jpg')}
      style={styles.bg}
      imageStyle={styles.bgImage}
      resizeMode="cover"
    >
      <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    opacity: 0.40,
    width: '100%',
    height: '100%',
  },
});
