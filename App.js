import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  LogBox,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import TaskItem from "./src/TaskItem";

import firebase from "./src/firebaseConfig";

//LogBox.ignoreAllLogs();

export default function App() {
  const inputRef = useRef(null);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    async function loadTasks() {
      await firebase
        .database()
        .ref("tarefas")
        .on("value", (snapshot) => {
          setTasks([]);
          snapshot.forEach((item) => {
            const data = {
              key: item.key,
              nome: item.val().nome,
            };
            setTasks((oldArray) => [...oldArray, data]);
          });
        });
    }
    loadTasks();
  }, []);

  async function cadastrarTask() {
    if (newTask) {
      if (key) {
        await firebase.database().ref("tarefas").child(key).update({
          nome: newTask,
        });
        Keyboard.dismiss();
        setKey("");
        setNewTask("");
        return;
      }
      const tarefas = await firebase.database().ref("tarefas");
      const newkey = tarefas.push().key;

      tarefas.child(newkey).set({
        nome: newTask,
      });

      Keyboard.dismiss();
      setNewTask("");
    }
  }

  async function deleteTask(key) {
    await firebase.database().ref("tarefas").child(key).remove();
  }

  async function editTask(data) {
    setNewTask(data.nome);
    setKey(data.key);
    inputRef.current.focus();
  }

  function cancelEdit() {
    setKey("");
    Keyboard.dismiss();
    setNewTask("");
  }

  return (
    <View style={styles.container}>
      <StatusBar />

      {key.length > 0 && (
        <View style={styles.editMessageLabelView}>
          <TouchableOpacity onPress={cancelEdit}>
            <Icon name="times-circle" size={25} />
          </TouchableOpacity>
          <Text> Você está editando uma tarefa </Text>
        </View>
      )}

      <View style={styles.inputView}>
        <TextInput
          placeholder="Digite uma tarefa"
          underlineColorAndroid="transparent"
          style={styles.input}
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={cadastrarTask}>
          <Icon name="plus" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TaskItem data={item} deleteItem={deleteTask} editItem={editTask} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  editMessageLabelView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#000",
    height: 40,
    padding: 10,
    flex: 1,
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  btnAdd: {
    backgroundColor: "#000",
    height: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
