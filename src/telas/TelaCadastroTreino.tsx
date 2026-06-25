import React, { useState } from "react";
import {  View,  Text,  TextInput, TouchableOpacity,  StyleSheet, ToastAndroid,   ScrollView 
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaCadastroTreino({ navigation }: any) {
  const [letraTreino, setLetraTreino] = useState(""); 
  const [modalidade, setModalidade] = useState("");   
  const [repeticoes, setRepeticoes] = useState("");   
  const [diaSemana, setDiaSemana] = useState("");     

  const handleSalvarTreino = async () => {
    if (letraTreino === "" || modalidade === "" || repeticoes === "" || diaSemana === "") {
      ToastAndroid.show("❌ Preencha todos os campos!", ToastAndroid.SHORT);
      return;
    }

    const letraMaiuscula = letraTreino.toUpperCase().trim();
    if (!["A", "B", "C", "D", "E", "F"].includes(letraMaiuscula)) {
      ToastAndroid.show("❌ Escolha uma letra de A até F!", ToastAndroid.SHORT);
      return;
    }

    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        const treinosAtuaisSrt = await AsyncStorage.getItem(`@fitlife:treinos:${email}`);
        let listaTreinos = treinosAtuaisSrt ? JSON.parse(treinosAtuaisSrt) : [];

        const novoTreino = {
          id: String(Date.now()),
          letra: `Treino ${letraMaiuscula}`, 
          modalidade,              
          tempo: repeticoes,       
          kcal: diaSemana
        };

        listaTreinos.unshift(novoTreino);
        await AsyncStorage.setItem(`@fitlife:treinos:${email}`, JSON.stringify(listaTreinos));

        ToastAndroid.show("💪 Exercício adicionado à ficha!", ToastAndroid.SHORT);
        
        // APENAS FECHA A TELA E RETORNA
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show("❌ Erro ao salvar o exercício", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Montar Treino</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Divisão do Treino (Letra A, B, C, D, E ou F)</Text>
        <TextInput
          style={[styles.input, styles.inputLetra]}
          value={letraTreino}
          onChangeText={setLetraTreino}
          placeholder="Ex: A"
          maxLength={1}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Nome do Exercício</Text>
        <TextInput
          style={styles.input}
          value={modalidade}
          onChangeText={setModalidade}
          placeholder="Ex: Supino Reto, Agachamento Livre"
        />

        <Text style={styles.label}>Séries e Repetições</Text>
        <TextInput
          style={styles.input}
          value={repeticoes}
          onChangeText={setRepeticoes}
          placeholder="Ex: 4x12, 3x10 (Falha)"
        />

        <Text style={styles.label}>Dia do Treino / Organização</Text>
        <TextInput
          style={styles.input}
          value={diaSemana}
          onChangeText={setDiaSemana}
          placeholder="Ex: Segunda-feira, Quarta-feira"
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarTreino}>
          <Text style={styles.textoBotao}>ADICIONAR À FICHA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingBottom: 30 },
  header: { backgroundColor: "#005dc2", paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, flexDirection: "row", alignItems: "center" },
  headerTitulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  formContainer: { paddingHorizontal: 20, marginTop: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 6 },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, height: 50, paddingHorizontal: 15, fontSize: 16, color: "#1e293b", marginBottom: 20 },
  inputLetra: { width: 80, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#005dc2" },
  botaoSalvar: { backgroundColor: "#7cb342", height: 55, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 10 },
  textoBotao: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }
});
