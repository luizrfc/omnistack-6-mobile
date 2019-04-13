import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingHorizontal: 30
    },
    logo: {
        alignSelf: 'center'
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        fontSize: 16,
        paddingHorizontal: 20,
        marginTop: 30
    },
    button:{
        height: 48,
        borderRadius: 5,
        fontSize: 16,
        paddingHorizontal: 20,
        marginTop: 15,
        backgroundColor: '#7159c1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase'
    }
})

export default styles