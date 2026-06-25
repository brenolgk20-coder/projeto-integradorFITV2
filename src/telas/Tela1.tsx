import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Feather } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tela1({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [ocultarSenhaLogin, setOcultarSenhaLogin] = useState(true); 

  const handleLogin = () => {
    if (email === "" || senha === "") {
      ToastAndroid.show("❌ Preencha todos os campos!", ToastAndroid.SHORT);
      return;
    }
    setCarregando(true);
    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        setCarregando(false);
        const usuarioLogado = userCredential.user.email;
        if (usuarioLogado) { await AsyncStorage.setItem("@fitlife:usuario_atual", usuarioLogado); }
        ToastAndroid.show("✅ Login realizado com sucesso!", ToastAndroid.SHORT);
        navigation.navigate("Tela2");
      })
      .catch((error) => {
        setCarregando(false);
        ToastAndroid.show("❌ E-mail ou senha incorretos.", ToastAndroid.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconBars}>
          <View style={[styles.bar, { height: 25, backgroundColor: "#60a5fa" }]} />
          <View style={[styles.bar, { height: 35, backgroundColor: "#a3e635" }]} />
          <View style={[styles.bar, { height: 20, backgroundColor: "#854d0e" }]} />
        </View>
        <Text style={styles.logoTexto}>FitLife</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.containerInputSenhaLogin}>
        <TextInput
          style={styles.inputSenhaLogin}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={ocultarSenhaLogin}
        />
        <TouchableOpacity style={styles.btnOlhoLogin} onPress={() => setOcultarSenhaLogin(!ocultarSenhaLogin)}>
          <Feather name={ocultarSenhaLogin ? "eye-off" : "eye"} size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>ENTRAR</Text>}
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Tela6")}><Text style={styles.linkTexto}>Criar Nova Conta</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Tela7")}><Text style={styles.linkTexto}>Esqueceu a senha?</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0072b1", justifyContent: "center", paddingHorizontal: 30 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  iconBars: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginBottom: 10 },
  bar: { width: 6, borderRadius: 3 },
  logoTexto: { fontSize: 36, fontWeight: "bold", color: "#ffffff" },
  input: { backgroundColor: "rgba(255, 255, 255, 0.15)", height: 55, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: "#ffffff", marginBottom: 15 },
  containerInputSenhaLogin: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.15)", height: 55, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  inputSenhaLogin: { flex: 1, color: "#ffffff", fontSize: 16, height: "100%" },
  btnOlhoLogin: { padding: 5 },
  botao: { backgroundColor: "#7cb342", height: 55, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 10, marginBottom: 25 },
  textoBotao: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 },
  linksContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  linkTexto: { color: "#ffffff", fontSize: 14, textDecorationLine: "underline", fontWeight: "500" }
});
