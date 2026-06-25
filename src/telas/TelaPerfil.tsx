import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function TelaPerfil({ navigation }: any) {
  const [nome, setNome] = useState("Usuário");
  const [peso, setPeso] = useState("0");
  const [altura, setAltura] = useState("0");
  const [idade, setIdade] = useState("0");
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const carregarDadosPerfil = async () => {
        try {
          const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
          if (email) {
            setNome(await AsyncStorage.getItem(`@fitlife:nome:${email}`) || "Usuário Novo");
            setPeso(await AsyncStorage.getItem(`@fitlife:peso:${email}`) || "70");
            setAltura(await AsyncStorage.getItem(`@fitlife:altura:${email}`) || "1.70");
            setIdade(await AsyncStorage.getItem(`@fitlife:idade:${email}`) || "0");
            setFotoUri(await AsyncStorage.getItem(`@fitlife:foto:${email}`));
          }
        } catch (e) { console.log(e); }
      };
      carregarDadosPerfil();
    }, [])
  );

  const handleEscolherFoto = async () => {
    const permissaoResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissaoResult.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, 
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      navigation.navigate("TelaCortarFoto", { imagemUri: result.assets[0].uri });
    }
  };

  const handleApagarFoto = async () => {
    Alert.alert("Remover Foto", "Deseja apagar a sua foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: async () => {
          const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
          if (email) {
            await AsyncStorage.removeItem(`@fitlife:foto:${email}`);
            setFotoUri(null);
            ToastAndroid.show("🗑️ Foto de perfil removida!", ToastAndroid.SHORT);
          }
        }}
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Tela2")} style={{ paddingVertical: 5, paddingRight: 20 }}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Meu Perfil</Text>
      </View>
      <View style={styles.avatarContainer}>
        <View style={styles.wrapperAvatarArea}>
          <TouchableOpacity style={styles.avatarCirculo} onPress={handleEscolherFoto} activeOpacity={0.8}>
            {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.fotoPerfilImagem} /> : <FontAwesome5 name="user-alt" size={40} color="#005dc2" />}
            <View style={styles.iconeCameraFlutuante}><FontAwesome5 name="camera" size={12} color="#ffffff" /></View>
          </TouchableOpacity>
          {fotoUri && (
            <TouchableOpacity style={styles.botaoLixeiraFoto} onPress={handleApagarFoto}>
              <Feather name="trash-2" size={14} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.nomeUsuario}>{nome}</Text>
        <Text style={styles.statusMembro}>Membro FitLife</Text>
      </View>
      <View style={styles.infoGrid}>
        <View style={styles.cardInfo}><MaterialCommunityIcons name="cake-variant" size={26} color="#005dc2" /><Text style={styles.valorInfo}>{idade} anos</Text><Text style={styles.labelInfo}>Idade</Text></View>
        <View style={styles.cardInfo}><MaterialCommunityIcons name="weight-kilogram" size={26} color="#005dc2" /><Text style={styles.valorInfo}>{peso} kg</Text><Text style={styles.labelInfo}>Peso Atual</Text></View>
        <View style={styles.cardInfo}><MaterialCommunityIcons name="human-male-height" size={26} color="#005dc2" /><Text style={styles.valorInfo}>{altura} m</Text><Text style={styles.labelInfo}>Altura</Text></View>
      </View>
      <View style={styles.decoracaoContainer}>
        <View style={styles.linhaDecorativaEspelhada} />
        <View style={styles.iconesAcademiaRow}>
          <FontAwesome5 name="fire" size={22} color="#cbd5e1" />
          <FontAwesome5 name="dumbbell" size={34} color="#94a3b8" style={styles.iconeCentral} />
          <FontAwesome5 name="heartbeat" size={22} color="#cbd5e1" />
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
  avatarContainer: { alignItems: "center", marginTop: 35, marginBottom: 20 },
  wrapperAvatarArea: { position: "relative", width: 106, height: 106, justifyContent: "center", alignItems: "center" },
  avatarCirculo: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#e0f2fe", justifyContent: "center", alignItems: "center", position: "relative", elevation: 2 },
  fotoPerfilImagem: { width: 100, height: 100, borderRadius: 50, resizeMode: "cover" },
  iconeCameraFlutuante: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#7cb342", width: 28, height: 28, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#f8fafc" },
  botaoLixeiraFoto: { position: "absolute", top: 0, right: 0, backgroundColor: "#ef4444", width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#f8fafc", elevation: 4 },
  nomeUsuario: { fontSize: 22, fontWeight: "bold", color: "#1e293b", marginTop: 12 },
  statusMembro: { fontSize: 13, color: "#64748b", fontWeight: "600", marginTop: 2 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, gap: 10, marginBottom: 25 },
  cardInfo: { flex: 1, backgroundColor: "#ffffff", borderRadius: 8, paddingVertical: 15, paddingHorizontal: 5, alignItems: "center", borderWidth: 1, borderColor: "#cbd5e1", elevation: 1 },
  valorInfo: { fontSize: 15, fontWeight: "900", color: "#1e293b", marginTop: 8, textAlign: "center" },
  labelInfo: { fontSize: 11, color: "#64748b", marginTop: 2, fontWeight: "600", textAlign: "center" },
  

  decoracaoContainer: { alignItems: "center", marginTop: 35, paddingHorizontal: 40 },
  iconesAcademiaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 12 },
  iconeCentral: { marginHorizontal: 30 },
  linhaDecorativaEspelhada: { width: "60%", height: 1, backgroundColor: "#cbd5e1", opacity: 0.5 }
});
