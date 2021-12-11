import "react-native-gesture-handler"
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native"
import Home from "./src/screens/Home";
import Todos from "./src/screens/Todos";
import AddCollection from "./src/screens/AddCollection";

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Collections" component={Home} options={styleHeader}/>
          <Stack.Screen name="Todos" component={Todos} options={styleHeader} />
          <Stack.Screen name="Add Collection" component={AddCollection} options={styleHeader} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styleHeader = {
  headerStyle: {
    backgroundColor: "#026cad"
  },
  headerTintColor: "#fff"
}

export default App
