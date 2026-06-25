import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ToastAndroid, ScrollView,Alert,ActivityIndicator
} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../firebase";

export default function TelaAlterarSenha({ navigation }: any) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [verSenhaAtual, setVerSenhaAtual] = useState(false);
  const [verNovaSenha, setVerNovaSenha] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const handleAtualizarSenhaFirebase = async () => {
    if (senhaAtual === "" || novaSenha === "" || confirmarSenha === "") {
      ToastAndroid.show("❌ Preencha todos os campos!", ToastAndroid.SHORT);
      return;
    }

    if (novaSenha.length < 6) {
      ToastAndroid.show("❌ A nova senha deve ter pelo menos 6 dígitos!", ToastAndroid.SHORT);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      ToastAndroid.show("❌ A nova senha e a confirmação não batem!", ToastAndroid.SHORT);
      return;
    }

    const usuario = auth.currentUser;
    if (!usuario || !usuario.email) {
      ToastAndroid.show("❌ Erro de credenciais!", ToastAndroid.SHORT);
      return;
    }

    setCarregando(true);
    const credencial = EmailAuthProvider.credential(usuario.email, senhaAtual);

    reauthenticateWithCredential(usuario, credencial)
      .then(() => {
        updatePassword(usuario, novaSenha)
          .then(() => {
            setCarregando(false);
            Alert.alert("🔒 Senha Modificada", "Sua credencial de acesso foi alterada com sucesso!");
            navigation.navigate("Tela5"); 
          })
          .catch((err) => {
            setCarregando(false);
            ToastAndroid.show("❌ Erro ao registrar nova senha.", ToastAndroid.SHORT);
          });
      })
      .catch((error) => {
        setCarregando(false);
        Alert.alert("⚠️ Falha na validação", "A senha atual digitada está incorreta.");
      });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 5, paddingRight: 20 }}>
          <FontAwesome5 name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Segurança da Conta</Text>
      </View>

      <View style={styles.formContainer}>
    
        <Text style={styles.label}>Digite a Senha Atual</Text>
        <View style={styles.inputContainerRow}>
          <TextInput
            style={styles.inputField}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            placeholder="Sua senha antiga"
            secureTextEntry={!verSenhaAtual} 
          />
          <TouchableOpacity style={styles.iconeOlhoBotao} onPress={() => setVerSenhaAtual(!verSenhaAtual)}>
            <Feather name={verSenhaAtual ? "eye" : "eye-off"} size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Digite a Nova Senha</Text>
        <View style={styles.inputContainerRow}>
          <TextInput
            style={styles.inputField}
            value={novaSenha}
            onChangeText={setNovaSenha}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={!verNovaSenha}
          />
          <TouchableOpacity style={styles.iconeOlhoBotao} onPress={() => setVerNovaSenha(!verNovaSenha)}>
            <Feather name={verNovaSenha ? "eye" : "eye-off"} size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirme a Nova Senha</Text>
        <View style={styles.inputContainerRow}>
          <TextInput
            style={styles.inputField}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Repita a nova senha"
            secureTextEntry={!verConfirmar}
          />
          <TouchableOpacity style={styles.iconeOlhoBotao} onPress={() => setVerConfirmar(!verConfirmar)}>
            <Feather name={verConfirmar ? "eye" : "eye-off"} size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleAtualizarSenhaFirebase} disabled={carregando}>
          {carregando ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.textoBotao}>MUDAR CREDENCIAIS</Text>}
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
  formContainer: { paddingHorizontal: 20, marginTop: 25 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 6 },
  inputContainerRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, height: 50, marginBottom: 20, paddingHorizontal: 15 },
  inputField: { flex: 1, fontSize: 16, color: "#1e293b", height: "100%" },
  iconeOlhoBotao: { padding: 5 },
  botaoConfirmar: { backgroundColor: "#7cb342", height: 55, borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 10, elevation: 2 },
  textoBotao: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 }
});
