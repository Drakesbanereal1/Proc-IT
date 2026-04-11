import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, Platform, View, StyleSheet } from 'react-native';
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
    card: 'rgba(17, 24, 39, 0.82)',
    text: '#FFFFFF',
  },
};

// Resolve the asset URI so we can pass it to CSS
const bgAsset = require('../assets/images/runefencer.jpg');

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const uri = Image.resolveAssetSource(bgAsset).uri;
    const style = document.createElement('style');
    style.id = 'runefencer-bg';
    style.innerHTML = `
      html, body, #root {
        background-image: url('${uri}') !important;
        background-size: cover !important;
        background-position: right center !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
        background-color: #000 !important;
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  return (
    <View style={styles.root}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
