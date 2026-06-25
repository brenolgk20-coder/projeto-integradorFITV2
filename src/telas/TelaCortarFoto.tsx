import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, ToastAndroid } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function TelaCortarFoto({ route, navigation }: any) {
  const { imagemUri } = route.params;

  const handleConfirmarCorte = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        await AsyncStorage.setItem(`@fitlife:foto:${email}`, imagemUri);
        ToastAndroid.show("📸 Foto de perfil salva com sucesso!", ToastAndroid.SHORT);
        navigation.navigate("TelaPerfil");
      }
    } catch (e) { console.log(e); }
  };

  const handleCancelarCorte = () => {
    ToastAndroid.show("❌ Corte cancelado", ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTexto}>CORTAR FOTO</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.DicaTexto}>Arraste e use dois dedos (pinça) para dar zoom e ajustar o enquadramento</Text>

      <View style={styles.areaImagemContainer}>
        <View style={styles.caixaCorteQuadrado}>
          <ScrollView
            maximumZoomScale={5}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: imagemUri }} style={styles.imagemEstilo} />
          </ScrollView>
          <View style={styles.linhaHorizontal} />
          <View style={[styles.linhaHorizontal, { top: "66.6%" }]} />
          <View style={styles.linhaVertical} />
          <View style={[styles.linhaVertical, { left: "66.6%" }]} />
          <View style={[styles.canto, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }]} />
          <View style={[styles.canto, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }]} />
          <View style={[styles.canto, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
          <View style={[styles.canto, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }]} />
        </View>
      </View>

      <View style={styles.rodapeBotoesRow}>
        <TouchableOpacity style={[styles.botaoRedondo, styles.btnCheck]} onPress={handleConfirmarCorte}>
          <Feather name="check" size={32} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoRedondo, styles.btnCancel]} onPress={handleCancelarCorte}>
          <Feather name="x" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  header: { backgroundColor: "#1e293b", paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTexto: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 },
  DicaTexto: { color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 15, paddingHorizontal: 20 },
  areaImagemContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  caixaCorteQuadrado: { width: width * 0.85, aspectRatio: 1, position: "relative", borderWidth: 2, borderColor: "#ffffff", overflow: "hidden", backgroundColor: "#000000" },
  imagemEstilo: { width: width * 0.85, height: width * 0.85, resizeMode: "cover" },
  linhaHorizontal: { position: "absolute", left: 0, right: 0, top: "33.3%", height: 1, backgroundColor: "rgba(255,255,255,0.4)" },
  linhaVertical: { position: "absolute", top: 0, bottom: 0, left: "33.3%", width: 1, backgroundColor: "rgba(255,255,255,0.4)" },
  canto: { position: "absolute", width: 24, height: 24, borderColor: "#ffffff" },
  rodapeBotoesRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 40, paddingTop: 20, backgroundColor: "#121214" },
  botaoRedondo: { width: 75, height: 75, borderRadius: 37.5, justifyContent: "center", alignItems: "center", elevation: 4, borderWidth: 3, borderColor: "#ffffff" },
  btnCheck: { backgroundColor: "#7cb342" }, 
  btnCancel: { backgroundColor: "#ef4444" }  
});
