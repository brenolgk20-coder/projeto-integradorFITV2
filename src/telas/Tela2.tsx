import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ToastAndroid, AppState } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tela2({ navigation }: any) {
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [fraseMotivacao, setFraseMotivacao] = useState("FOCO NO OBJETIVO!");
  const [tempoCardio, setTempoCardio] = useState(0);
  const [correndoCardio, setCorrendoCardio] = useState(false);
  const [modoEdicaoFrase, setModoEdicaoFrase] = useState(false);
  const [textoFraseInput, setTextoFraseInput] = useState("");

  const carregarDadosDashboard = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        setNomeUsuario(await AsyncStorage.getItem(`@fitlife:nome:${email}`) || "Usuário Novo");
        const fraseSalva = await AsyncStorage.getItem(`@fitlife:frase_home:${email}`);
        setFraseMotivacao(fraseSalva || "FOCO NO OBJETIVO!");
        setTextoFraseInput(fraseSalva || "FOCO NO OBJETIVO!");
        
        const tempoSalvo = await AsyncStorage.getItem(`@fitlife:tempo:${email}`);
        setTempoCardio(tempoSalvo ? Number(tempoSalvo) : 0);
      }
    } catch (e) { console.log(e); }
  };

  useFocusEffect(useCallback(() => { carregarDadosDashboard(); }, []));
  useEffect(() => {
    let intervalo: any = null;
    if (correndoCardio) {
      intervalo = setInterval(async () => {
        const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
        if (email) {
          setTempoCardio((ant) => {
            const novo = ant + 1;
            AsyncStorage.setItem(`@fitlife:tempo:${email}`, String(novo));

            acumularDadosSemanaisProgresso(email);
            
            return novo;
          });
        }
      }, 1000);
    } else { 
      clearInterval(intervalo); 
    }
    return () => clearInterval(intervalo);
  }, [correndoCardio]);

  const acumularDadosSemanaisProgresso = async (email: string) => {
    try {
      const kcalAtuais = Number(await AsyncStorage.getItem(`@fitlife:kcal_semana:${email}`)) || 0;
      await AsyncStorage.setItem(`@fitlife:kcal_semana:${email}`, String(kcalAtuais + 0.13));

      const minutosAtuais = Number(await AsyncStorage.getItem(`@fitlife:minutos_acumulados:${email}`)) || 0;
      await AsyncStorage.setItem(`@fitlife:minutos_acumulados:${email}`, String(minutosAtuais + (1 / 60)));
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    const assinaturaAppState = AppState.addEventListener("change", async (proximoEstado) => {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (!email || !correndoCardio) return;

      if (proximoEstado === "background" || proximoEstado === "inactive") {
        await AsyncStorage.setItem(`@fitlife:tempo_bloqueio:${email}`, String(Date.now()));
      } else if (proximoEstado === "active") {
        const horaBloqueioSrt = await AsyncStorage.getItem(`@fitlife:tempo_bloqueio:${email}`);
        if (horaBloqueioSrt) {
          const segundosPassados = Math.floor((Date.now() - Number(horaBloqueioSrt)) / 1000);
          if (segundosPassados > 0) {
            setTempoCardio((ant) => {
              const novo = ant + segundosPassados;
              AsyncStorage.setItem(`@fitlife:tempo:${email}`, String(novo));
              for (let i = 0; i < segundosPassados; i++) { acumularDadosSemanaisProgresso(email); }
              return novo;
            });
          }
          await AsyncStorage.removeItem(`@fitlife:tempo_bloqueio:${email}`);
        }
      }
    });
    return () => assinaturaAppState.remove();
  }, [correndoCardio]);
  const handleResetarCardioHome = async () => {
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        setCorrendoCardio(false); 
        setTempoCardio(0); 
        await AsyncStorage.setItem(`@fitlife:tempo:${email}`, "0"); 
        await AsyncStorage.removeItem(`@fitlife:tempo_bloqueio:${email}`);
        ToastAndroid.show("🔄 Relógio de cardio zerado!", ToastAndroid.SHORT);
      }
    } catch (e) { console.log(e); }
  };

  const handleSalvarFraseNova = async () => {
    if (textoFraseInput.trim() === "") return;
    try {
      const email = await AsyncStorage.getItem("@fitlife:usuario_atual");
      if (email) {
        const txt = textoFraseInput.toUpperCase().trim();
        await AsyncStorage.setItem(`@fitlife:frase_home:${email}`, txt);
        setFraseMotivacao(txt);
        setModoEdicaoFrase(false);
        ToastAndroid.show("📝 Frase atualizada!", ToastAndroid.SHORT);
      }
    } catch (e) { console.log(e); }
  };

  const handleSairDoApp = () => {
    signOut(auth).then(async () => {
      await AsyncStorage.removeItem("@fitlife:usuario_atual");
      ToastAndroid.show("👋 Sessão encerrada!", ToastAndroid.SHORT);
      navigation.reset({ index: 0, routes: [{ name: "Tela1" }] });
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.saudacao}>Olá, {nomeUsuario}!</Text>
        <TouchableOpacity style={styles.botaoTopoAcao} onPress={handleSairDoApp}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <View style={styles.linhaDivisoria} />
      
      <View style={styles.tituloResumoRow}>
        <Text style={styles.secaoTitulo}>Resumo Semanal</Text>
        <TouchableOpacity style={styles.botaoResetarGeral} onPress={handleResetarCardioHome}>
          <Ionicons name="refresh-circle" size={22} color="#005dc2" />
          <Text style={styles.textoResetarGeral}>Zerar Relógio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.cardResumo, { backgroundColor: "#0072b1", alignItems: "center" }]}>
          <View style={styles.logoSimboloCardRow}>
            <View style={[styles.bar, { height: 16, backgroundColor: "#60a5fa" }]} />
            <View style={[styles.bar, { height: 24, backgroundColor: "#a3e635" }]} />
            <View style={[styles.bar, { height: 12, backgroundColor: "#ffffff" }]} />
            <Text style={styles.logoTextoCard}>FitLife</Text>
          </View>
        </View>

        <View style={[styles.cardResumo, { backgroundColor: "#d1d5db", position: "relative" }]}>
          {modoEdicaoFrase ? (
            <View style={styles.areaInputEdicao}>
              <TextInput style={styles.inputFraseHome} value={textoFraseInput} onChangeText={setTextoFraseInput} autoFocus maxLength={40} />
              <TouchableOpacity style={styles.btnCheckFrase} onPress={handleSalvarFraseNova}><Feather name="check" size={14} color="#ffffff" /></TouchableOpacity>
            </View>
          ) : ( <Text style={styles.cardTextoMotivacional}>{fraseMotivacao}</Text> )}
          {!modoEdicaoFrase && (
            <TouchableOpacity style={styles.botaoLapisEditar} onPress={() => setModoEdicaoFrase(true)}><FontAwesome5 name="pencil-alt" size={10} color="#4b5563" /></TouchableOpacity>
          )}
        </View>

        <View style={[styles.cardResumo, { backgroundColor: "#f59e0b" }]}>
          <Text style={styles.cardValor}>{Math.floor(tempoCardio / 60)}m {tempoCardio % 60}s</Text>
          <TouchableOpacity style={styles.btnPlayHome} onPress={() => setCorrendoCardio(!correndoCardio)}>
            <FontAwesome5 name={correndoCardio ? "pause" : "play"} size={12} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.cardLabelBold}>Cardio Ativo</Text>
        </View>
      </View>

      <View style={styles.gridMenu}>
        <TouchableOpacity style={styles.botaoMenu} onPress={() => navigation.navigate("Tela3")}><FontAwesome5 name="dumbbell" size={28} color="#ffffff" /><Text style={styles.textoBotaoMenu}>Treinos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.botaoMenu} onPress={() => navigation.navigate("Tela4")}><MaterialCommunityIcons name="chart-bar" size={32} color="#ffffff" /><Text style={styles.textoBotaoMenu}>Progresso</Text></TouchableOpacity>
        <TouchableOpacity style={styles.botaoMenu} onPress={() => navigation.navigate("Tela5")}><Ionicons name="settings-sharp" size={30} color="#ffffff" /><Text style={styles.textoBotaoMenu}>Configurações</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoPerfil} onPress={() => navigation.navigate("TelaPerfil")}><FontAwesome5 name="user-circle" size={20} color="#ffffff" style={{ marginRight: 10 }} /><Text style={styles.textoBotaoPerfil}>Ver Meu Perfil</Text></TouchableOpacity>

      <View style={styles.decoracaoContainer}>
        <View style={styles.linhaDecorativaEspelhada} />
        <View style={styles.iconesAcademiaRow}>
          <FontAwesome5 name="fire" size={22} color="#cbd5e1" />
          <FontAwesome5 name="dumbbell" size={34} color="#94a3b8" style={styles.iconeCentral} />
          <FontAwesome5 name="heartbeat" size={22} color="#cbd5e1" />
        </View>
        <Text style={styles.fraseMotivacionalRodape}>NÃO PARE ATÉ SE ORGULHAR</Text>
        <View style={styles.linhaDecorativaEspelhada} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { paddingHorizontal: 20, paddingTop: 75, paddingBottom: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  saudacao: { fontSize: 26, fontWeight: "bold", color: "#0047ab" },
  botaoTopoAcao: { padding: 10, backgroundColor: "#fee2e2", borderRadius: 50 },
  linhaDivisoria: { height: 1, backgroundColor: "#e2e8f0", marginBottom: 25 },
  tituloResumoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  secaoTitulo: { fontSize: 17, fontWeight: "bold", color: "#0047ab" },
  botaoResetarGeral: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#e0f2fe", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  textoResetarGeral: { fontSize: 12, fontWeight: "700", color: "#005dc2" },
  cardsRow: { flexDirection: "row", justifyContent: "space-between", gap: 6, marginBottom: 30 },
  cardResumo: { flex: 1, borderRadius: 8, padding: 10, minHeight: 115, justifyContent: "center", elevation: 2 },
  logoSimboloCardRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  bar: { width: 4, borderRadius: 2 },
  logoTextoCard: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginLeft: 4 },
  cardValor: { fontSize: 15, fontWeight: "bold", color: "#ffffff" },
  cardTextoMotivacional: { fontSize: 10, fontWeight: "900", color: "#1f2937", textAlign: "center" },
  cardLabelBold: { fontSize: 12, fontWeight: "bold", color: "#ffffff", marginTop: 5 },
  btnPlayHome: { width: 22, height: 22, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 11, justifyContent: "center", alignItems: "center", marginTop: 5 },
  botaoLapisEditar: { position: "absolute", top: 8, right: 8, padding: 4, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 4 },
  areaInputEdicao: { flexDirection: "row", alignItems: "center", gap: 4, width: "100%" },
  inputFraseHome: { flex: 1, backgroundColor: "#ffffff", height: 28, borderRadius: 4, fontSize: 10, paddingHorizontal: 5, color: "#1e293b", fontWeight: "700" },
  btnCheckFrase: { backgroundColor: "#7cb342", width: 24, height: 24, borderRadius: 4, justifyContent: "center", alignItems: "center" },
  gridMenu: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 35 },
  botaoMenu: { flex: 1, backgroundColor: "#1565c0", aspectRatio: 1, borderRadius: 8, justifyContent: "center", alignItems: "center", padding: 10, elevation: 3 },
  textoBotaoMenu: { color: "#ffffff", fontSize: 13, fontWeight: "bold", marginTop: 8 },
  botaoPerfil: { flexDirection: "row", backgroundColor: "#0043a4", height: 50, borderRadius: 8, justifyContent: "center", alignItems: "center", elevation: 2 },
  textoBotaoPerfil: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
  decoracaoContainer: { alignItems: "center", marginTop: 35 },
  iconesAcademiaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  iconeCentral: { marginHorizontal: 25 },
  fraseMotivacionalRodape: { fontSize: 12, fontWeight: "800", color: "#94a3b8", letterSpacing: 3, textAlign: "center" },
  linhaDecorativaEspelhada: { width: "40%", height: 1, backgroundColor: "#cbd5e1", marginTop: 12, opacity: 0.5 },
});