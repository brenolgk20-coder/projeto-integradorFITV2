import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Tela6({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = () => {
    if (email === "" || senha === "") {
      ToastAndroid.show("❌ Preencha todos os campos!", ToastAndroid.SHORT);
      return;
    }

    if (!email.includes("@")) {
      ToastAndroid.show("❌ Formato de e-mail inválido!", ToastAndroid.SHORT);
      return;
    }

    if (senha.length < 6) {
      ToastAndroid.show("❌ A senha precisa ter pelo menos 6 dígitos!", ToastAndroid.SHORT);
      return;
    }

    setCarregando(true);

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        setCarregando(false);
        ToastAndroid.show("✅ Conta criada com sucesso!", ToastAndroid.LONG);
        navigation.goBack(); 
      })
      .catch((error) => {
        setCarregando(false);
        ToastAndroid.show(`❌ Erro: ${error.message}`, ToastAndroid.LONG);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Cadastrar</Text>
        )}
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
    backgroundColor: "#007BFF",
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
