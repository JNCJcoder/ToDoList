import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { saveTask, loadTask } from "./util/storage";
import Header from "./components/header";

const App = () => {
  const [newTask, setNewTask] = useState("");
  const [Tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await loadTask();

    if (!data) {
      return;
    }

    setTasks(data);
  };

  const addTask = async () => {
    Keyboard.dismiss();

    if (!newTask) {
      return;
    }

    const temp = {
      id: Tasks.length + 1,
      done: false,
      task: newTask,
    };
    const temp2 = [temp, ...Tasks];
    setNewTask("");
    setTasks(temp2);
    await saveTask(temp2);
  };

  const removeTask = async (taskID) => {
    const temp = Tasks.filter((item) => item.id !== taskID);
    setTasks(temp);
    await saveTask(temp);
  };

  const changeTask = async (taskID) => {
    const temp = Tasks.filter((item) => {
      if (item.id === taskID) {
        item.done = !item.done;
      }
      return item;
    });
    setTasks(temp);
    await saveTask(temp);
  };

  const addTaskToList = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.checkBox}
        onPress={() => changeTask(item.task)}
      >
        <Text>{item.done ? "✔️" : "❌"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeTask(item.id)}>
        {item.done
          ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <Text
              style={[styles.taskName, { textDecorationLine: "line-through" }]}
            >
              {item.task}
            </Text>
          )
          : (
            <Text style={styles.taskName}>{item.task}</Text>
          )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => removeTask(item.id)}
      >
        <Text style={styles.buttonName}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <FlatList
          data={Tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={addTaskToList}
        />
      </View>
      <View style={styles.footer}>
        <TextInput
          style={styles.footerTextInput}
          placeholder="Write new task here."
          placeholderTextColor="grey"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => addTask()}>
          <Text style={styles.sendButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#2a3353",
  },
  //
  // ItemContainer
  //
  itemContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "black",
  },
  taskName: {
    fontSize: 20,
    color: "white",
  },
  button: {
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "red",
  },
  buttonName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  checkBox: {
    paddingTop: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
  },
  checkBoxText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  //
  // Footer
  //
  footer: {
    backgroundColor: "#404a6e",
    borderTopColor: "#000",
    borderTopWidth: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerTextInput: {
    fontSize: 20,
    lineHeight: 20,
    margin: 0,
    color: "white",
    padding: 15,
  },
  sendButton: {
    marginTop: 10,
    height: 41,
    width: 40,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "green",
    backgroundColor: "green",
    textAlign: "center",
  },
  sendButtonText: {
    alignSelf: "center",
    fontSize: 29,
    fontWeight: "bold",
  },
});

export default App;
