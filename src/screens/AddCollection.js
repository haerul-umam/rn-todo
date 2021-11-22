import React, { useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements'
import { API } from '../../api'


export default function AddCollection() {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDone, setIsDone] = useState(false)
    
    
    const onInput = () => {
        setIsLoading(true)

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        let data = JSON.stringify({name: name})
        API.post(`/collection`, data, config)
        .then(() => {
            setIsLoading(false)
            setIsDone(true)
        }).catch(e => alert(e))
    }

    return (
        <SafeAreaView style={styles.container}>
            <Input 
            style={{color: "#fff"}} 
            placeholder="enter collection name" 
            onChangeText={text => setName(text)}/>
            <Button 
            containerStyle={{width: "50%"}} title="Submit" 
            onPress={onInput} loading={false}
            icon={
                isDone ?
                <Icon
                name='checkmark-circle-outline' type='ionicon'
                size={20}
                color="white"
                containerStyle={{paddingRight:5}}
                /> : null
            }
            loading={isLoading}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#003865"
    }
})
