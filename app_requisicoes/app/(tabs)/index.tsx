import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "STATUS";

interface ApiResponse {
  [key: string]: any;
}

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");
  const [statusCode, setStatusCode] = useState<string>("200");

  async function callApi(method: HttpMethod): Promise<void> {
    setLoading(true);
    setData(null);

    try {
      let res: Response;

      if (method === "GET") {
        res = await fetch("https://httpbin.org/get");
      } else if (method === "POST") {
        res = await fetch("https://httpbin.org/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, mensagem, tipo: "POST" }),
        });
      } else if (method === "PUT") {
        res = await fetch("https://httpbin.org/put", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, mensagem, tipo: "PUT" }),
        });
      } else if (method === "DELETE") {
        res = await fetch("https://httpbin.org/delete", {
          method: "DELETE",
        });
      } else if (method === "STATUS") {
        res = await fetch(`https://httpbin.org/status/${statusCode}`);
      } else {
        throw new Error("Método não suportado");
      }

      let json: ApiResponse | null = null;
      try {
        json = await res.json();
      } catch {
        json = { status: res.status, statusText: res.statusText };
      }

      setData(json);
    } catch (err) {
      setData({ error: "Erro ao chamar API" });
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Requisições HTTP com Httpbin API</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite uma mensagem"
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite um status code (ex: 200, 404)"
        keyboardType="numeric"
        value={statusCode}
        onChangeText={setStatusCode}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.get]}
          onPress={() => callApi("GET")}
        >
          <Text style={styles.buttonText}>GET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.post]}
          onPress={() => callApi("POST")}
        >
          <Text style={styles.buttonText}>POST</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.put]}
          onPress={() => callApi("PUT")}
        >
          <Text style={styles.buttonText}>PUT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.delete]}
          onPress={() => callApi("DELETE")}
        >
          <Text style={styles.buttonText}>DELETE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.status]}
          onPress={() => callApi("STATUS")}
        >
          <Text style={styles.buttonText}>STATUS</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loading}>Carregando...</Text>}

      {data && (
        <ScrollView style={styles.response}>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    margin: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  get: {
    backgroundColor: "#2563eb",
  },
  post: {
    backgroundColor: "#16a34a",
  },
  put: {
    backgroundColor: "#ca8a04",
  },
  delete: {
    backgroundColor: "#dc2626",
  },
  status: {
    backgroundColor: "#9333ea",
  },
  loading: {
    marginTop: 10,
    fontStyle: "italic",
  },
  response: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    maxHeight: "60%",
    width: "100%",
  },
});
