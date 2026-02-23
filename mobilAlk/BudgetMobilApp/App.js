import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

const onPress = () => {
  console.log('Button Pressed!');
};
const dropDown = () => {
  console.log('DropDown Pressed!');
}

export default function App({ navigation }) {
  return (
    <>
      <View style={styles.container}>
        {" "}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.button} onPress={onPress}> 
            <Image source={require('./assets/applogo.png')} style={styles.icon} />
           </TouchableOpacity>
          <Text style={styles.topBarText}>Budget App</Text>
          <TouchableOpacity style={styles.dropbox} onPress={dropDown}>
            <Text style={styles.dropbar}>...</Text>
          </TouchableOpacity>
          
        </View> 
      
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    height: 100,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 30,
    paddingTop: 35,
    borderColor: "#000000",
    borderBottomWidth: 3,
  },
  topBarText: { color: "white", fontSize: 20, fontWeight: "bold", flex: 2, paddingLeft: 20 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { width: 50, height: 50, margin: 5, backgroundColor: "rgba(0, 82, 163, 0.5)", borderRadius: 10 },
  button: {
    marginLeft: 20,
    borderRadius: 15,
    flex: 1,
  },
  dropbar: 
  {
    
  },
  dropbox:
  {
    backgroundColor: "rgba(0, 82, 163, 0.5)",
    borderRadius: 10,
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,

  }
});
