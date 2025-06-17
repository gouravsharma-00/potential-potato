import React, {useEffect, useState} from 'react'
import {View, Text} from 'react-native'
import axios from 'axios'

export default function Helloserver() {
    const [message, setMessage] = useState("Loading...");
    useEffect(() => {
        async function api() {
            try {
                const res = await axios.get("")
                setMessage(res.data.message)
            }catch (err) {
                console.log(err)
                setMessage("Error connecting to server.");
            }
        }
        api()
    }, [])

    return(
        <View>
            <Text>{message}</Text>
        </View>
    )
}