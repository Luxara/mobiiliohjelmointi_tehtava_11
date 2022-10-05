import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';


const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  
  const [listItem, setListItem] = useState('');
  const [amount, setAmount] = useState('');
  const [listItems, setListItems] = useState([]);
  

  useEffect(() => {  
    db.transaction(tx => {    
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, listItem text, amount text);');  
    }, null, updateList);
  }, []);


  const addItem = () => { 
     db.transaction(tx =>{
      tx.executeSql('insert into shoppinglist (listItem, amount) values (?, ?);',
              [listItem, amount]);
     }, null, updateList)
  }

  const updateList = () => {  
    db.transaction(tx => {    
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>      
      setListItems(rows._array)    
      );   
    });
    console.log('updated list')
    console.log(listItems)
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList)    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>

      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <TextInput placeholder='item' style={styles.input} onChangeText={listItem=>setListItem(listItem)} value={listItem}/>
        <TextInput placeholder='amount' style={styles.input} onChangeText={amount=>setAmount(amount)} value={amount}/>
      </View>

      <View style={{position: 'relative', top:30}}>
      <View style={{flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'space-around', marginTop:'-50%'}}>
      <Button onPress={addItem} title='ADD'/>
      </View>
      </View>

      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <Text>Shopping List</Text>
      <FlatList
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize:18, marginRight:'10%'}}>{item.listItem}, {item.amount}</Text>
      <Text style={{fontSize:18, color: 'red'}} onPress={() => deleteItem(item.id)}>bought</Text></View>}  
      data={listItems}
      ItemSeparatorComponent={listSeparator}
      />
      </View>
        
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  input:{
    width:200,
    borderColor:'gray',
    borderWidth:1
  },

  listcontainer:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  }  
});
