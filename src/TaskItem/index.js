import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

export default function TaskItem({ data, deleteItem, editItem }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => deleteItem(data.key)}>
        <Icon name="trash" color="#fff" size={25} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => editItem(data)}>
        <View style={styles.btnEdit}>
          <Text style={styles.label}>{data.nome}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#000",
    marginBottom: 8,
    shadowColor: "#fff",
    elevation: 2,
    padding: 10,
    alignItems: "center",
  },
  label: {
    color: "#fff",
    marginLeft: 8,
  },
  btnEdit: {
    flex: 1,
  },
});
