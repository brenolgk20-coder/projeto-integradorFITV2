import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TelaEditarDieta({ navigation }: any) {
  const [cafe, setCafe] = useState("");
  const [lancheManha, setLancheManha] = useState("");
  const [almoco, setAlmoco] = useState("");
  const [lancheTarde, setLancheTarde] = useState("");
  const [jantar, setJantar] = useState("");
  const [lancheNoite, setLancheNoite] = useState("");

  const [hrCafe, setHrCafe] = useState("");
  const [hrLancheM, setHrLancheM] = useState("");
  const [hrAlmoco, setHrAlmoco] = useState("");
  const [hrLancheT, setHrLancheT] = useState("");
  const [hrJantar, setHrJantar] = useState("");
  const [hrLancheN, setHrLancheN] = useState("");

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDieta();
  }, []);

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
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarDieta = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        await AsyncStorage.setItem(`@fitlife:dieta:cafe:${email}`, cafe);
        await AsyncStorage.setItem(`@fitlife:dieta:lancheManha:${email}`, lancheManha);
        await AsyncStorage.setItem(`@fitlife:dieta:almoco:${email}`, almoco);
        await AsyncStorage.setItem(`@fitlife:dieta:lancheTarde:${email}`, lancheTarde);
        await AsyncStorage.setItem(`@fitlife:dieta:jantar:${email}`, jantar);
        await AsyncStorage.setItem(`@fitlife:dieta:lancheNoite:${email}`, lancheNoite);

        await AsyncStorage.setItem(`@fitlife:dieta:h_cafe:${email}`, hrCafe);
        await AsyncStorage.setItem(`@fitlife:dieta:h_lancheM:${email}`, hrLancheM);
        await AsyncStorage.setItem(`@fitlife:dieta:h_almoco:${email}`, hrAlmoco);
        await AsyncStorage.setItem(`@fitlife:dieta:h_lancheT:${email}`, hrLancheT);
        await AsyncStorage.setItem(`@fitlife:dieta:h_jantar:${email}`, hrJantar);
        await AsyncStorage.setItem(`@fitlife:dieta:h_lancheN:${email}`, hrLancheN);

        ToastAndroid.show("🍏 Dieta e horários salvos!", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show("❌ Erro ao salvar", ToastAndroid.SHORT);
    }
  };

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#005dc2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" style={{ marginRight: 15 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Editar Dieta e Horários</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.rowLabel}><Text style={styles.label}>Café da Manhã</Text><TextInput style={styles.inputHora} value={hrCafe} onChangeText={setHrCafe} placeholder="07:00" /></View>
        <TextInput style={styles.input} multiline value={cafe} onChangeText={setCafe} />

        <View style={styles.rowLabel}><Text style={styles.label}>Lanche da Manhã</Text><TextInput style={styles.inputHora} value={hrLancheM} onChangeText={setHrLancheM} placeholder="10:00" /></View>
        <TextInput style={styles.input} multiline value={lancheManha} onChangeText={setLancheManha} />

        <View style={styles.rowLabel}><Text style={styles.label}>Almoço</Text><TextInput style={styles.inputHora} value={hrAlmoco} onChangeText={setHrAlmoco} placeholder="13:00" /></View>
        <TextInput style={styles.input} multiline value={almoco} onChangeText={setAlmoco} />

        <View style={styles.rowLabel}><Text style={styles.label}>Lanche da Tarde</Text><TextInput style={styles.inputHora} value={hrLancheT} onChangeText={setHrLancheT} placeholder="16:00" /></View>
        <TextInput style={styles.input} multiline value={lancheTarde} onChangeText={setLancheTarde} />

        <View style={styles.rowLabel}><Text style={styles.label}>Jantar</Text><TextInput style={styles.inputHora} value={hrJantar} onChangeText={setHrJantar} placeholder="19:00" /></View>
        <TextInput style={styles.input} multiline value={jantar} onChangeText={setJantar} />

        <View style={styles.rowLabel}><Text style={styles.label}>Lanche da Noite</Text><TextInput style={styles.inputHora} value={hrLancheN} onChangeText={setHrLancheN} placeholder="22:00" /></View>
        <TextInput style={styles.input} multiline value={lancheNoite} onChangeText={setLancheNoite} />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarDieta}>
          <Text style={styles.textoBotao}>SALVAR ALTERAÇÕES</Text>
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
  formContainer: { paddingHorizontal: 20, marginTop: 15 },
  rowLabel: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569" },
  inputHora: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 6, width: 70, height: 35, paddingHorizontal: 8, fontSize: 13, color: "#005dc2", fontWeight: "700", textAlign: "center" },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, minHeight: 60, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, color: "#1e293b", marginBottom: 15, textAlignVertical: "top" },
  botaoSalvar: { backgroundColor: "#7cb342", height: 55, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 10 },
  textoBotao: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }
});
