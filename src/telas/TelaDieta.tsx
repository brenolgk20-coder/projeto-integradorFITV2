import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaDieta({ navigation }: any) {
  const [cafe, setCafe] = useState("");
  const [lancheManha, setLancheManha] = useState("");
  const [almoco, setAlmoco] = useState("");
  const [lancheTarde, setLancheTarde] = useState("");
  const [jantar, setJantar] = useState("");
  const [lancheNoite, setLancheNoite] = useState("");

  const [hrCafe, setHrCafe] = useState("07:00");
  const [hrLancheM, setHrLancheM] = useState("10:00");
  const [hrAlmoco, setHrAlmoco] = useState("13:00");
  const [hrLancheT, setHrLancheT] = useState("16:00");
  const [hrJantar, setHrJantar] = useState("19:00");
  const [hrLancheN, setHrLancheN] = useState("22:00");

  useFocusEffect(
    useCallback(() => {
      const carregarDieta = async () => {
        try {
          const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
          if (email) {
            setCafe(await AsyncStorage.getItem(`@fitlife:dieta:cafe:${email}`) || "• 3 Ovos mexidos na manteiga\n• 2 Fatias de pão integral com creme de ricota\n• 1 xícara de Café preto sem açúcar");
            setLancheManha(await AsyncStorage.getItem(`@fitlife:dieta:lancheManha:${email}`) || "• 1 iogurte natural desnatado\n• 30g de aveia em flocos\n• 104g de morangos picados");
            setAlmoco(await AsyncStorage.getItem(`@fitlife:dieta:almoco:${email}`) || "• 150g de filé de frango grelhado\n• 120g de arroz integral cozido\n• 80g de feijão carioca\n• Salada verde à vontade com azeite");
            setLancheTarde(await AsyncStorage.getItem(`@fitlife:dieta:lancheTarde:${email}`) || "• 1 dose de Whey Protein batido com água\n• 1 banana prata fatiada\n• 20g de pasta de amendoim integral");
            setJantar(await AsyncStorage.getItem(`@fitlife:dieta:jantar:${email}`) || "• 130g de patinho moído ou filé de tilápia\n• 150g de purê de batata doce ou macaxeira\n• Brócolis e cenoura cozidos no vapor");
            setLancheNoite(await AsyncStorage.getItem(`@fitlife:dieta:lancheNoite:${email}`) || "• 1 xícara de chá de camomila ou erva-doce\n• 3 torradas integrais com queijo branco fresco\n• 4 castanhas do Pará");

            setHrCafe(await AsyncStorage.getItem(`@fitlife:dieta:h_cafe:${email}`) || "07:00");
            setHrLancheM(await AsyncStorage.getItem(`@fitlife:dieta:h_lancheM:${email}`) || "10:00");
            setHrAlmoco(await AsyncStorage.getItem(`@fitlife:dieta:h_almoco:${email}`) || "13:00");
            setHrLancheT(await AsyncStorage.getItem(`@fitlife:dieta:h_lancheT:${email}`) || "16:00");
            setHrJantar(await AsyncStorage.getItem(`@fitlife:dieta:h_jantar:${email}`) || "19:00");
            setHrLancheN(await AsyncStorage.getItem(`@fitlife:dieta:h_lancheN:${email}`) || "22:00");
          }
        } catch (e) {
          console.log(e);
        }
      };
      carregarDieta();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Dieta Relacionada</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="coffee" size={24} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Café da Manhã</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrCafe}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{cafe}</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="food-apple" size={24} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Lanche da Manhã</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrLancheM}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{lancheManha}</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Almoço</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrAlmoco}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{almoco}</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="cookie" size={24} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Lanche da Tarde</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrLancheT}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{lancheTarde}</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="food-fork-drink" size={24} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Jantar</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrJantar}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{jantar}</Text>
        </View>

        <View style={styles.cardRefeicao}>
          <View style={styles.refeicaoHeader}>
            <View style={styles.tituloAgrupado}>
              <MaterialCommunityIcons name="bed-clock" size={24} color="#005dc2" />
              <Text style={styles.refeicaoTitulo}>Lanche da Noite</Text>
            </View>
            <Text style={styles.horarioTexto}>{hrLancheN}</Text>
          </View>
          <Text style={styles.refeicaoTexto}>{lancheNoite}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.botaoFlutuante}
        onPress={() => navigation.navigate("TelaEditarDieta")}
      >
        <FontAwesome5 name="pen" size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingBottom: 100 },
  header: { backgroundColor: "#005dc2", paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, flexDirection: "row", alignItems: "center" },
  botaoVoltar: { marginRight: 15 },
  headerTitulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  cardRefeicao: { backgroundColor: "#ffffff", borderRadius: 8, padding: 16, marginHorizontal: 20, marginTop: 15, elevation: 2 },
  refeicaoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  tituloAgrupado: { flexDirection: "row", alignItems: "center", gap: 10 },
  refeicaoTitulo: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  horarioTexto: { fontSize: 14, fontWeight: "700", color: "#005dc2", backgroundColor: "#e0f2fe", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  refeicaoTexto: { fontSize: 14, color: "#475569", lineHeight: 20 },
  botaoFlutuante: { position: "absolute", bottom: 30, right: 25, backgroundColor: "#7cb342", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 }
});
