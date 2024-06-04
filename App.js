import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  const intialState = {
    id: 0,
    title: "",
    description: "",
    completed: false
  }

  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(intialState)
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const todos = await AsyncStorage.getItem("todo")
    console.log(todos);
    setTodo(JSON.parse(todos) ? JSON.parse(todos) : []);
  }

  useEffect(() => {
    getTodos()
  }, []);

  const clear = () => setNewTodo(intialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Please enter all the details.");
      return;
    }

    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
    setShowModal(false);
    clear();
  }


  const handleChange = (title, value) => setNewTodo({ ...newTodo, [title]: value })

  const updateTodo = item => {
    const itemToBEUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBEUpdated[0].completed = !itemToBEUpdated[0].completed;

    const remainingItems = todo.filter(todoItem => todoItem.id != item.id);

    const updatedTodo = [...itemToBEUpdated, ...remainingItems];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updatedTodo));
  }




  const displayTodo = item => (
    <TouchableOpacity onPress={() =>
      Alert.alert(`${item.title}`, `${item.description}`, [
        {
          text: item.completed ? 'InProgress' : 'Completed',
          onPress: () => updateTodo(item),
        },
        {
          text: 'Ok',
          style: 'cancel',
        },
      ])}
      style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomColor: "#000", borderBottomWidth: 1 }}>
      <BouncyCheckbox isChecked={item.completed ? true : false} fillColor='blue' onPress={() => updateTodo(item)} />
      <Text style={{ color: "#000", fontSize: 16, width: '90%', textDecorationLine: item.completed ? "line-through" : 'none' }}>{item.title}</Text>
    </TouchableOpacity>
  )


  return (
    <View style={{ marginHorizontal: 20 }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
      }}>
        <View>
          <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
            Hey, only remamber me!
          </Text>
          <Text style={{ fontSize: 16 }}> {todo.length} {todo.length == 1 ? 'task' : 'tasks'} fo you!</Text>
        </View>
        <Image source={require('./assets/logo.jpeg')}
          style={{ height: 50, width: 50, borderRadius: 10 }}
        />
      </View>

      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}> To Do List</Text>
      <ScrollView><View style={{ height: 250 }}>
        {
          todo.map(item => !item.completed ? displayTodo(item) : null)
        }
      </View></ScrollView>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>Completed</Text>
      <ScrollView><View style={{ height: 250 }}>
        {
          todo.map(item => item.completed ? displayTodo(item) : null)
        }
      </View></ScrollView>

      <View style={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={() => setShowModal(true)} style={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "lightblue", borderRadius: 100, width: 60, height: 60 }}>
          <Text style={{ fontSize: 34, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} animationType='slide' onRequestClose={() => setShowModal(false)} >
        <View style={{ marginHorizontal: 20 }}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 20,
          }}>
            <View>
              <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                Hey, only remamber me!
              </Text>
              <Text style={{ fontSize: 16 }}> {todo.length} {todo.length == 1 ? 'task' : 'tasks'} fo you!</Text>
            </View>
            <Image source={require('./assets/logo.jpeg')}
              style={{ height: 50, width: 50, borderRadius: 10 }}
            />
          </View>

          <Text
            style={{
              marginVertical: 20,
              color: '#000',
              fontWeight: 'bold', fontSize: 25
            }}>Add a Today Work</Text>
          <TextInput
            placeholder='Title of Work'
            value={newTodo.title}
            onChangeText={(title) => handleChange('title', title)}
            style={{
              backgroundColor: "rgb(220, 220, 220)",
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10
            }} />
          <TextInput
            placeholder='Description'
            value={newTodo.description}
            onChangeText={(desc) => handleChange('description', desc)}
            style={{
              backgroundColor: "rgb(220, 220, 220)",
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10
            }}
            multiline={true} numberOfLines={6} />
          <View style={{
            width: '100%',
            alignItems: "center", marginTop: 50
          }}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: "blue",
                width: 100, 
                borderRadius: 10, 
                alignItems: 'center', 
                padding: 10
              }}>
              <Text style={{ color: "#fff", fontSize: 22 }}>Add</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  );
}