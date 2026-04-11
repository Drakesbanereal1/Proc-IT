import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: 'rgba(26, 32, 44, 0.88)' },
        headerTintColor: '#FFFFFF',
        drawerStyle: {
          backgroundColor: 'rgba(17, 24, 39, 0.92)',
        },
        drawerInactiveTintColor: '#A0AEC0',
        drawerActiveTintColor: '#FFFFFF',
        drawerActiveBackgroundColor: 'rgba(26, 32, 44, 0.95)',
        sceneContainerStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="abyssea"
        options={{
          title: "Abyssea",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="dynamis"
        options={{
          title: "Dynamis",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="skull" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="voidwatch"
        options={{
          title: "Voidwatch",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="eye" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="escha"
        options={{
          title: "Escha",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="git-merge" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ambuscade"
        options={{
          title: "Ambuscade",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sortie"
        options={{
          title: "Sortie",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="rocket" size={size} color={color} />
          ),
        }}
      />
        <Drawer.Screen
              name="SortieBoss"
              options={{
                title: "Sortie Boss",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="rocket" size={size} color={color} />
                ),
              }}
            />
      <Drawer.Screen
        name="blu"
        options={{
          title: "Blue Mage (BLU)",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flask" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="skillchain"
        options={{
          title: "Skillchain Builder",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="git-branch" size={size} color={color} />
          ),
        }}
      />
       <Drawer.Screen
        name="about"
        options={{
          title: "About",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
