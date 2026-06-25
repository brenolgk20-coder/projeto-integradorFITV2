import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tela4({ navigation }: any) {
  const [caloriasPerdidas, setCaloriasPerdidas] = useState("0.0");
  const [minutosCardio, setMinutesCardio] = useState("0.0");

  const carregarProgressoLog = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        const kcal = Number(await AsyncStorage.getItem(`@fitlife:kcal_semana:${email}`)) || 0;
        setCaloriasPerdidas(kcal.toFixed(1));

        const min = Number(await AsyncStorage.getItem(`@fitlife:minutos_acumulados:${email}`)) || 0;
        setMinutesCardio(min.toFixed(1));
      }
    } catch (e) { console.log(e); }
  };

  useFocusEffect(useCallback(() => { carregarProgressoLog(); }, []));
  const handleResetarProgressoSemanal = () => {
    Alert.alert(
      "Zerar Histórico",
      "Deseja resetar as calorias e tempo acumulados da semana?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Zerar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
              if (email) {
                await AsyncStorage.setItem(`@fitlife:kcal_semana:${email}`, "0");
                await AsyncStorage.setItem(`@fitlife:minutos_acumulados:${email}`, "0");
 
                setCaloriasPerdidas("0.0");
                setMinutesCardio("0.0");
                
                ToastAndroid.show("🗑️ Estatísticas da semana zeradas!", ToastAndroid.SHORT);
              }
            } catch (e) { console.log(e); }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Tela2")} style={{ paddingVertical: 5, paddingRight: 20 }}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Meu Progresso</Text>
      </View>

      <View style={styles.painelFocoContainer}>
        <View style={styles.cardMetricaGeral}>
          <MaterialCommunityIcons name="fire" size={42} color="#ef4444" />
          <View style={styles.areaFocusTexto}>
            <Text style={styles.valorMetrica}>{caloriasPerdidas} Kcal</Text>
            <Text style={styles.labelMetrica}>Perda Total da Semana</Text>
          </View>
        </View>

        <View style={[styles.cardMetricaGeral, { marginTop: 15 }]}>
          <MaterialCommunityIcons name="clock-fast" size={40} color="#f59e0b" />
          <View style={styles.areaFocusTexto}>
            <Text style={styles.valorMetrica}>{minutosCardio} Min</Text>
            <Text style={styles.labelMetrica}>Cardio Acumulado</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoResetarMetricas} onPress={handleResetarProgressoSemanal} activeOpacity={0.8}>
          <Ionicons name="trash" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.textoBotaoReset}>RESETAR PROGRESSO SEMANAL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.decoracaoContainer}>
        <View style={styles.linhaDecorativaEspelhada} />
        <View style={styles.iconesAcademiaRow}>
          <FontAwesome5 name="dumbbell" size={26} color="#cbd5e1" />
          <FontAwesome5 name="heartbeat" size={26} color="#cbd5e1" style={{ marginLeft: 20 }} />
        </View>
        <View style={styles.linhaDecorativaEspelhada} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingBottom: 40 },
  header: { backgroundColor: "#005dc2", paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, flexDirection: "row", alignItems: "center" },
  headerTitulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  painelFocoContainer: { paddingHorizontal: 20, marginTop: 25 },
  cardMetricaGeral: { backgroundColor: "#ffffff", borderRadius: 8, padding: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#cbd5e1", elevation: 2 },
  areaFocusTexto: { marginLeft: 18, flex: 1 },
  valorMetrica: { fontSize: 24, fontWeight: "900", color: "#1e293b" },
  labelMetrica: { fontSize: 13, color: "#64748b", fontWeight: "600", marginTop: 2 },
  botaoResetarMetricas: { backgroundColor: "#ef4444", height: 55, borderRadius: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 35, elevation: 2 },
  textoBotaoReset: { color: "#ffffff", fontSize: 14, fontWeight: "bold", letterSpacing: 0.5 },
  decoracaoContainer: { alignItems: "center", marginTop: 45, paddingHorizontal: 40 },
  iconesAcademiaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 12 },
  linhaDecorativaEspelhada: { width: "50%", height: 1, backgroundColor: "#cbd5e1", opacity: 0.4 }
});