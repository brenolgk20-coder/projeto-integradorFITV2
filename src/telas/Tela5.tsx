import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView 
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tela5({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");

  useEffect(() => {
    carregarDadosConfiguracao();
  }, []);

  const carregarDadosConfiguracao = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        setNome(await AsyncStorage.getItem(`@fitlife:nome:${email}`) || "");
        setPeso(await AsyncStorage.getItem(`@fitlife:peso:${email}`) || "");
        setAltura(await AsyncStorage.getItem(`@fitlife:altura:${email}`) || "");
        setIdade(await AsyncStorage.getItem(`@fitlife:idade:${email}`) || ""); 
      }
    } catch (e) { 
      console.log("Erro ao carregar configurações:", e); 
    }
  };

  const handleSalvarConfiguracoes = async () => {
    if (nome.trim() === "" || peso.trim() === "" || altura.trim() === "" || idade.trim() === "") {
      ToastAndroid.show("❌ Preencha todos os campos!", ToastAndroid.SHORT);
      return;
    }

    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        await AsyncStorage.setItem(`@fitlife:nome:${email}`, nome);
        await AsyncStorage.setItem(`@fitlife:peso:${email}`, peso);
        await AsyncStorage.setItem(`@fitlife:altura:${email}`, altura);
        await AsyncStorage.setItem(`@fitlife:idade:${email}`, idade); 

        ToastAndroid.show("⚙️ Configurações salvas!", ToastAndroid.SHORT);
        navigation.navigate("Tela2");
      }
    } catch (error) { 
      ToastAndroid.show("❌ Erro ao salvar dados", ToastAndroid.SHORT); 
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Tela2")} style={{ paddingVertical: 5, paddingRight: 20 }}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Configurações</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.secaoTitulo}>Dados do Perfil</Text>

        <Text style={styles.label}>Seu Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: João Silva" />
        <Text style={styles.label}>Idade (anos)</Text>
        <TextInput 
          style={styles.input} 
          value={idade} 
          onChangeText={setIdade} 
          placeholder="Ex: 25" 
          keyboardType="numeric" 
        />

        <Text style={styles.label}>Peso Atual (kg)</Text>
        <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Ex: 85" keyboardType="numeric" />

        <Text style={styles.label}>Altura (m)</Text>
        <TextInput style={styles.input} value={altura} onChangeText={setAltura} placeholder="Ex: 1.75" keyboardType="numeric" />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarConfiguracoes}>
          <Text style={styles.textoBotao}>SALVAR DADOS</Text>
        </TouchableOpacity>

        <View style={styles.linhaDivisoria} />

        <Text style={styles.secaoTitulo}>Segurança da Conta</Text>
        <TouchableOpacity style={styles.botaoMudarSenhaLink} onPress={() => navigation.navigate("TelaAlterarSenha")}>
          <MaterialCommunityIcons name="lock-reset" size={22} color="#ffffff" style={{ marginRight: 10 }} />
          <Text style={styles.textoBotao}>ALTERAR SENHA DE ACESSO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingBottom: 40 },
  header: { backgroundColor: "#005dc2", paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, flexDirection: "row", alignItems: "center" },
  headerTitulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  formContainer: { paddingHorizontal: 20, marginTop: 20 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", color: "#005dc2", marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 6 },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, height: 50, paddingHorizontal: 15, fontSize: 16, color: "#1e293b", marginBottom: 20 },
  botaoSalvar: { backgroundColor: "#7cb342", height: 55, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 5 },
  botaoMudarSenhaLink: { backgroundColor: "#0047ab", height: 55, borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  textoBotao: { color: "#ffffff", fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 },
  linhaDivisoria: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 25 }
});
