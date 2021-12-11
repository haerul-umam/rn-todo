import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableWithoutFeedback, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Icon,Button, Input, Image } from 'react-native-elements'
import { Swipeable } from 'react-native-gesture-handler';
import TouchableScale from 'react-native-touchable-scale'; 

import { useFocusEffect } from '@react-navigation/native';
import { API } from '../../api';



const Home = (props) => {
    const [greeting, setGreeting] = useState("")
    const [collection, setCollection] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const window = useWindowDimensions()

    const greet = () => {
        const currDate = new Date()
        const hour = currDate.getHours()

        let text
        if (hour < 12) {
            text = "Good Morning"
        }else if (hour >= 12 & hour <= 17) {
            text = "Good Afternoon"
        }else if (hour >= 17 & hour <= 24) {
            text = "Good Evening"
        }
        return text
    }

    const getCollection = () => {
        setIsLoading(true)
        API.get("/collections")
        .then((res) => {
            setCollection(res.data.collection)
            setIsLoading(false)
        }).catch(e => {
            alert(e)
            setIsLoading(false)
        })
    }

    const updateCollection = (id) => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        let data = JSON.stringify({name: name})
        API.put(`/collection/${id}`, data, config)
        .then(() => {
            getCollection()
        }).catch(e => {
            alert(e)
        })
    }

    const deleteCollection = (id) => {
        API.delete(`/collection/${id}`)
        .then(() => {
            getCollection()
        }).catch(e => {
            alert(e)
            setIsLoading(false)
        })
    }

    const renderCollection = ({item}) => {

        // swipe to edit collection
        const rightSwipe = () => {
            return(
                <View style={styles.swipeArea}>
                    <Input 
                    style={{color: "#fff"}} 
                    defaultValue={name}
                    onChangeText={text => setName(prev => text)}
                    containerStyle={{width:"85%"}}
                    placeholder="change collection"
                    />
                    <Button icon={<Icon name="checkmark-sharp" type="ionicon"/>} buttonStyle={{borderRadius: 30, width:42, height:42}} 
                    onPress={() => {
                        updateCollection(item.id)
                    }}
                    loading={isLoading}
                    />
                </View>
            )
        }

        // swipe to delete collection
        const leftSwipe = () => {
            return(
                <View style={styles.leftButton}>
                    <Button icon={<Icon name="trash-sharp" type="ionicon"/>} buttonStyle={{borderRadius: 30, width:42, height:42}} 
                    onPress={()=> {deleteCollection(item.id)}}
                    />
                </View>
            )
        }

        return (
            <Swipeable
            renderRightActions={rightSwipe}
            renderLeftActions={leftSwipe}
            
            onSwipeableRightWillOpen={() => {setName(item.name)}}
            >
                <ListItem Component={TouchableScale} 
                friction={90}
                tension={100}
                activeScale={0.95}
                containerStyle={[styles.card]}
                onPress={() => {
                    props.navigation.navigate("Todos", item)
                }}
                >
                    <ListItem.Content >
                        <ListItem.Title h3 numberOfLines={1} style={styles.textWhite}>
                            {item.name}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.textWhite}>
                        Tasks : {!item.taskDone && "0"} {item.taskDone && `${item.taskDone} done of ${item.totalTask}`}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </Swipeable>
        )
    }

    useFocusEffect(
        React.useCallback(() => {
            // logic onfocus
            getCollection()
            setGreeting(greet())

            /*
            return () => {
                logic unfocus
            }
            */

        }, [])
    )

    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Text style={[styles.textWhite,{marginBottom: 5}]}>
                    {greeting}, Haerul</Text>
                    <FlatList
                        data={collection}
                        keyExtractor={item => item.id.toString()}
                        refreshing={isLoading}
                        onRefresh={getCollection}
                        renderItem={renderCollection}
                    />
            </View>
            {!collection.length &&
            <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                <Image style={{ height: window.height/3,width:window.width }} source={require("../images/no-task.png")} />
            </View>
            }
            <View style={styles.floatButton}>
                <TouchableWithoutFeedback
                onPress={() => {
                    props.navigation.navigate("Add Collection")
                }}
                >
                    <View style={styles.button}>
                        <Icon name='add-outline' type='ionicon' size={30} color='grey' containerStyle={{marginLeft:2}} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#003865"
    },
    card: {
        width: "100%",
        height: 100,
        padding: 10,
        borderRadius: 5,
        marginTop: 8,
        backgroundColor: "#004d82"
    },
    floatButton : {
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 60,
        right: 40,
    },
    button: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 60/2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    input :{
        backgroundColor: "#fff",
        width: "50%"
    },
    swipeArea: {
        width: "95%",
        alignItems: "center",
        flexDirection:"row",
    },
    textWhite: {
        color: "#fff"
    },
    leftButton: {
        justifyContent: "center",
        marginRight: 5
    }
})



export default Home
