import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../firebase";

const auth = getAuth();

export default function Tela7({ navigation }: any) {
  const [email, setEmail] = useState("");

  const handleRecuperar = () => {
    if (email === "") {
      ToastAndroid.show("❌ Digite o seu e-mail!", ToastAndroid.SHORT);
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        ToastAndroid.show("📧 E-mail de redefinição enviado!", ToastAndroid.LONG);
        navigation.goBack();
      })
      .catch((error) => {
        ToastAndroid.show(`❌ Erro: ${error.message}`, ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recuperar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail registrado"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.botao} onPress={handleRecuperar}>
        <Text style={styles.textoBotao}>Enviar E-mail</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF5722",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
