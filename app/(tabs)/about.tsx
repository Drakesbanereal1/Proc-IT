import { ScrollView, Text, View, StyleSheet } from "react-native";

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Proc It!</Text>
      <Text style={styles.description}>
        Proc It! is a comprehensive guide for Final Fantasy XI, designed to help
        players quickly find weakness triggers (PROCs) for Notorious Monsters in
        Abyssea, Dynamis, Voidwatch, and more.
      </Text>

      <Text style={styles.subtitle}>About the Developer</Text>
      <Text style={styles.bio}>
        Hi, I'm Drakesbanereal1 (sialeed from asura), the developer behind Proc
        It! As an avid FFXI player, I wanted to create a simple, easy-to-use
        tool to help my fellow adventurers keep track of proc requirements
        without having to alt-tab or check a separate device. This app is a
        passion project, and I hope it helps you on your journeys through
        Vana'diel!
      </Text>

      <Text style={styles.subtitle}>Credits</Text>
      <Text style={styles.creditsText}>
    This project is being developed as a personal, community focused tool intended to improve
    accessibility and usability of Final Fantasy XI proc information on mobile devices.

    The primary reference sources for this application are BG Wiki and FFXIclopedia, which serve
    as foundational knowledge bases for Abyssea, Dynamis, Voidwatch, and other proc systems.

    This application is not affiliated with, endorsed by, or sponsored by BG Wiki, FFXIclopedia,
    Square Enix, or any related parties. No compensation is received for this project.
    Development is done independently and entirely in my personal free time.

    As this is a free, volunteer driven project, there is no obligation to meet requests,
    timelines, feature demands, or support expectations. Development progresses as time and
    interest allow.

    Use of this application is completely optional and provided as is. Please do not demand
    features, updates, or support—this project exists solely as a personal effort,
    not a paid service.
      </Text>

      <Text style={styles.copyright}>
        © 2024 Drakesbanereal1 (sialeed from asura). All rights reserved.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1A202C",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#D1D5DB",
    marginBottom: 25,
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#E5E7EB",
    marginTop: 20,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 24,
  },
  creditsText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  copyright: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
});
