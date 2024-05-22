import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './components/Home'
import AddMeal from './components/AddMeal'  
import EditMeal from './components/EditMeal'  

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options = {{headerShown:false}} />
        <Stack.Screen name="AddMeal" component={AddMeal} options = {{headerShown:false}}/>
        <Stack.Screen name="EditMeal" component={EditMeal} options = {{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
