import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <>
      <View style={styles.container}>
        {" "}
        {/* Top Bar */}
        <View style={styles.topBar}>
          <image
            source={require("")}
          ></image>
        </View>  
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    height: 70,
    backgroundColor: "#1e90ff",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
    borderRadius: 10,
    borderColor: "#000000",
    borderWidth: 1,
  },
  topBarText: { color: "white", fontSize: 20, fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});
