import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ToastAndroid 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tela3({ navigation }: any) {
  const [treinos, setTreinos] = useState<any[]>([]);

  const carregarTreinos = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        const treinosSalvos = await AsyncStorage.getItem(`@fitlife:treinos:${email}`);
        setTreinos(treinosSalvos ? JSON.parse(treinosSalvos) : []);
      }
    } catch (e) { 
      console.log(e); 
    }
  };

  useFocusEffect(useCallback(() => { carregarTreinos(); }, []));

  const handleDeletarTreino = (id: string) => {
    Alert.alert("Remover Exercício", "Deseja apagar este exercício da sua ficha?", [
      { text: "Cancelar" },
      { text: "Apagar", style: "destructive", onPress: async () => {
          const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
          if (email) {
            const novaLista = treinos.filter(item => item.id !== id);
            await AsyncStorage.setItem(`@fitlife:treinos:${email}`, JSON.stringify(novaLista));
            ToastAndroid.show("🗑️ Exercício removido!", ToastAndroid.SHORT);
            carregarTreinos();
          }
        }}
    ]);
  };

  return (
    <View style={styles.container}>
 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Tela2")} style={{ paddingVertical: 5, paddingRight: 20 }}>
          <Feather name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.simboloLogoContainer}>
          <View style={[styles.bar, { height: 16, backgroundColor: "#60a5fa" }]} />
          <View style={[styles.bar, { height: 24, backgroundColor: "#a3e635" }]} />
          <View style={[styles.bar, { height: 12, backgroundColor: "#ffffff" }]} />
          <Text style={styles.simboloTextoLogo}>FitLife</Text>
        </View>
        
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={treinos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardConteudo}>
              <View style={styles.tagLetra}>
                <Text style={styles.textoTagLetra}>{item.letra || "Treino Geral"}</Text>
              </View>
              
              <Text style={styles.tituloTreino}>{item.modalidade}</Text>
              <Text style={styles.detalhesTreino}>
                Séries: <Text style={styles.textoDestaque}>{item.tempo}</Text>  •  Dia: <Text style={styles.textoDestaque}>{item.kcal}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeletarTreino(item.id)} style={{ padding: 5 }}>
              <Feather name="trash-2" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listaConteudo}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Feather name="info" size={35} color="#94a3b8" />
            <Text style={styles.textoVazio}>Ficha sem exercícios.</Text>
            <Text style={styles.subTextoVazio}>Clique no "+" para montar sua rotina.</Text>
          </View>
        }
      />
      <View style={styles.footerBotoesContainer}>
        <TouchableOpacity style={styles.botaoDietaFicha} onPress={() => navigation.navigate("TelaDieta")}>
          <MaterialCommunityIcons name="food-apple" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.textoDietaFicha}>VER DIETA RELACIONADA</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.botaoFlutuante} onPress={() => navigation.navigate("TelaCadastroTreino")}>
        <Feather name="plus" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#005dc2", paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  simboloLogoContainer: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  bar: { width: 4, borderRadius: 2 },
  simboloTextoLogo: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginLeft: 5, letterSpacing: 0.5 },
  listaConteudo: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 160 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, padding: 16, marginBottom: 12, elevation: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardConteudo: { flex: 1 },
  tagLetra: { backgroundColor: "#e0f2fe", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 6 },
  textoTagLetra: { fontSize: 11, fontWeight: "800", color: "#005dc2" },
  tituloTreino: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  detalhesTreino: { fontSize: 13, color: "#64748b", marginTop: 2 },
  textoDestaque: { color: "#005dc2", fontWeight: "600" },
  botaoFlutuante: { position: "absolute", bottom: 90, right: 25, backgroundColor: "#4caf50", width: 65, height: 65, borderRadius: 32.5, justifyContent: "center", alignItems: "center", elevation: 4 },
  vazioContainer: { alignItems: "center", marginTop: 40 },
  textoVazio: { fontSize: 15, fontWeight: "bold", color: "#64748b", marginTop: 10 },
  subTextoVazio: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  footerBotoesContainer: { position: "absolute", bottom: 20, left: 20, right: 20, height: 55 },
  botaoDietaFicha: { flex: 1, backgroundColor: "#0047ab", borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", elevation: 3 },
  textoDietaFicha: { color: "#ffffff", fontSize: 14, fontWeight: "bold" }
});