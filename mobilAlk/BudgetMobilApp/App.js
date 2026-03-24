import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { useState } from "react";

// start the mobil app in consol via: npx start
// download the node modulst vie: npm i


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
    

      <View style={styles.topBar} >
        {" "}
        <View style = {styles.logoImg}>
          <TouchableOpacity style={styles.button} onPress={onPress}> 
            <Image source={require('./assets/applogo.png')} style={styles.icon} />
           </TouchableOpacity>
        </View>
        
        <View  style={styles.topBarText}>
          <Text>Budget App</Text>
        </View>

        <View style={styles.dropbar}>
          <TouchableOpacity style={styles.dropbox} onPress={dropDown}>
            <Text>...</Text>
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
  
  topBar: 
  {
    flexDirection: 'row',
    width: '100%',
    height: '8%',
    backgroundColor: 'rgb(130, 188, 255)',
    
  },

  logoImg:
  {
    flex: 1,
  },

  topBarText:
  {
    flex: 2,
    justifyContent: 'space-evenly',
    
  },

  dropbar:
  {
    flex: 3,
    justifyContent: 'space-evenly',
    
  },
  
  icon: 
  { 
    width: 50,
    height: 50, 
    margin: 5, 
    backgroundColor: "rgba(0, 82, 163, 0.5)", 
    borderRadius: 10,
  },
  button: {
    borderRadius: 15,
    flex: 3,
    justifyContent: 'space-evenly',
  },

  dropbox:
  {
    backgroundColor: "rgba(0, 82, 163, 0.5)",
    borderRadius: '5px',
    paddingLeft: '4%',
    width: '10%',
    height: '50%',
    justifyContent: 'space-evenly',


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
