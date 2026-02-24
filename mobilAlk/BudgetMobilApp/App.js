import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { useState } from "react";



const onPress = () => {
  console.log('Button Pressed!');
};



export default function App({ navigation }) {
  const [Drop, setOpen] = useState('hide');

  const dropDown = () => {
  console.log('Dropdown Pressed!');
  setOpen(prev => (prev === 'show' ? 'hide' : 'show'));
}

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
        {Drop === 'show' && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity onPress={() => console.log('Option 1 Pressed!')}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Option 2 Pressed!')}>
              <Text>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Option 3 Pressed!')}>
              <Text>Option 3</Text>
            </TouchableOpacity>
          </View>)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    height: "13%",
    backgroundColor: "#1e90ff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 30,
    paddingTop: "5%",
    borderColor: "#000000",
    borderBottomWidth: 3,
  },

  topBarText:
   { 
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 2,
    paddingLeft: "10%" },

  content:
  { 
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center" 
  },
  icon: 
  { 
    width: 50,
    height: 50, 
    margin: 5, 
    backgroundColor: "rgba(0, 82, 163, 0.5)", 
    borderRadius: 10 
  },
  button: {
    marginLeft: "3%",
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

  },

  dropdownContent: {
    position: 'absolute',
    top: "13%",
    right: "3%",
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
  

});
