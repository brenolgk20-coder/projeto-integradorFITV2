import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Tela1 from './src/telas/Tela1';
import Tela2 from './src/telas/Tela2';
import Tela3 from './src/telas/Tela3';
import Tela4 from './src/telas/Tela4'; 
import Tela5 from './src/telas/Tela5';
import Tela6 from './src/telas/Tela6';
import Tela7 from './src/telas/Tela7';
import TelaPerfil from './src/telas/TelaPerfil';
import TelaDieta from './src/telas/TelaDieta';
import TelaCadastroTreino from './src/telas/TelaCadastroTreino';
import TelaEditarDieta from './src/telas/TelaEditarDieta';
import TelaCortarFoto from './src/telas/TelaCortarFoto';
import TelaAlterarSenha from './src/telas/TelaAlterarSenha'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer initialState={undefined}>
      <Stack.Navigator 
        initialRouteName="Tela1" 
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="Tela1" component={Tela1} />
        <Stack.Screen name="Tela2" component={Tela2} />
        <Stack.Screen name="Tela3" component={Tela3} />
        <Stack.Screen name="Tela4" component={Tela4} /> 
        <Stack.Screen name="Tela5" component={Tela5} />
        <Stack.Screen name="Tela6" component={Tela6} />
        <Stack.Screen name="Tela7" component={Tela7} />
        <Stack.Screen name="TelaPerfil" component={TelaPerfil} /> 
        <Stack.Screen name="TelaDieta" component={TelaDieta} /> 
        <Stack.Screen name="TelaCadastroTreino" component={TelaCadastroTreino} /> 
        <Stack.Screen name="TelaEditarDieta" component={TelaEditarDieta} /> 
        <Stack.Screen name="TelaCortarFoto" component={TelaCortarFoto} /> 
        <Stack.Screen name="TelaAlterarSenha" component={TelaAlterarSenha} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
