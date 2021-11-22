import React, { useState,useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox, Input, Button } from 'react-native-elements'
import { API } from '../../api';


export default function Todos(props) {
    let id = props.route.params.id
    let collection = props.route.params.name
    const [task, setTask] = useState("")
    const [todos, setTodos] = useState([])
    let input = React.createRef()

    const getTask = () => {
        API.get(`/tasks/${id}`)
        .then((res) => {
            setTodos(prev => res.data.todo)
        }).catch(e => {
            alert(e)
        })
    }

    const updateTask = (item) => {
        const isDone = item.isDone === "true" ? "false" : "true"

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        let data = JSON.stringify({isDone: isDone, id: item.id})
        API.put(`/task/${item.id}`, data, config)
        .then((res) => {
            getTask()
        }).catch(e => {
            alert(e)
        })
    }

    const deleteTask = (item) => {
        API.delete(`/task/${item.id}`)
        .then(() => {
            getTask()
        }).catch(e => {
            alert(e)
        })
    }

    const addTask = () => {

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        let data = JSON.stringify({name: task, collectionId: id})
        API.post(`/task`, data, config)
        .then((res) => {
            getTask()
            input.current.clear()
        }).catch(e => {
            alert(e)
        })
    }

    const isChecked = (itemId) =>{
        const [exist] = todos.filter(item => item.id === itemId)
        const isDone = (exist.isDone === "true")
        return isDone
    }

    const _renderItem = ({item}) => {
        return (
                <View style={styles.task}>
                    <Text 
                    style={[styles.textTask,{
                        textDecorationLine: (item.isDone === "true" ? "line-through" : "none")
                    }]}>{item.name}</Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <Icon name="trash" type="ionicon" size={17} 
                        onPress={() => {deleteTask(item)}}/>
                        <CheckBox 
                        checked={isChecked(item.id)} 
                        onPress={() => {updateTask(item)}} 
                        containerStyle={{padding:5, marginLeft:15}} size={22}/>
                    </View>
                    
                </View>
        )
    }

    useEffect(() => {
       getTask()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.display1}>
                <Icon name="list-circle-outline" size={32} color={"#fff"}/>
                <Text style={[styles.text,{fontSize:25,textTransform:"capitalize"}]}>{collection}</Text>
                <Text style={styles.text}>{todos.length} Tasks</Text>
            </View>
            <View style={styles.display2}>
                <FlatList 
                data={todos}
                keyExtractor={item => item.id.toString()}
                renderItem={_renderItem}
                />
            </View>
            <View style={styles.bottom}>
                <Input style={{color: "#fff"}}  containerStyle={{width:"90%"}} placeholder="add task"
                onChangeText={text => setTask(text)}
                ref={input}
                />
                <Button icon={<Icon name="checkmark-outline" size={14}/>} buttonStyle={{borderRadius: 30, width:30, height:30}} 
                onPress={addTask}
                />
            </View>
        </SafeAreaView>
    )
}

let p = 20

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#003865",
    },
    display1 : {
        flex: 1,
        justifyContent: "center",
        paddingLeft: p,
        paddingRight: p,
        minHeight: 35
    },
    text: {
        color: "#fff"
    },
    textTask: {
        fontWeight:"bold",
        fontSize:16,
        color: "grey"
    },
    display2: {
        flex: 3,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingLeft: p,
        paddingTop: p
    },
    task: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bottom: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 5,
        paddingRight:5
    }
})
