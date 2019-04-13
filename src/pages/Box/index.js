import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
import socket from 'socket.io-client'

import api from '../../services/api'

import styles from './styles'

import Icon from 'react-native-vector-icons/MaterialIcons'

import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'

import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default class Box extends Component {
  state = {
    box: {},
    loading: true
  }

  async componentWillMount() {
    let box = await AsyncStorage.getItem('@OmniBox:box')
    console.log('box', box)
    this.subscribeToNewFiles(box)
    const response = await api.get(`boxes/${box}`)
    console.log('response', response)
    this.setState({
      loading: false,
      box: response.data
    })
  }

  subscribeToNewFiles = (box) => {
    const io = socket('https://lricardo-omni-backend.herokuapp.com')

    io.emit('connectRoom', box)

    io.on('file', data => {
      console.log('IO => ', data)
      this.setState({
        ...this.state,
        box: {
          ...this.state.box,
          files: [
            data,
            ...this.state.box.files,
          ]
        }
      })
    })
  }

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if(upload.error) {
        console.log('--- ImagePicker error ---')
      }else if(upload.didCancel) {
        console.log('--- Canceled by user ---')
      }else {
        const data = new FormData()

        const [prefix, suffix] = upload.fileName.split('.')
        const ext = suffix.toLocaleLowerCase() === 'heic' ? 'jpg' : suffix
        const file = `${prefix}.${ext}`
        console.log('FILE === ', file)

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: file
        })

        let result = await api.post(`boxes/${this.state.box._id}/files`, data)
        console.log('upload', result)
      }
    })
  }

  OpenFile = async (file) => {
    console.log('FILE', file)
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.original}`
      console.log('filePath === ', filePath)

      let downloadFile = await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      })
      console.log('--- Download --- ', downloadFile)

      let loadFile = await FileViewer.open(filePath)
      console.log('--- Open ---', loadFile)

    } catch (error) {
      console.log('Erro no arquivo', error)
    }
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.OpenFile(item)} style={styles.file} keyExtractor={item._id}>
      <View>
        <Icon name='insert-drive-file' size={20} color='#A5CFFF' />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>

      <Text style={styles.fileDate}>há {distanceInWords(item.createdAt, new Date(), { locale: pt })}</Text>
    </TouchableOpacity>
  )

  render() {
    let { box } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{box.title}</Text>

        <FlatList
          style={styles.list}
          data={box.files && box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        ></FlatList>

        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name='cloud-upload' size={24} color='#FFF' />
        </TouchableOpacity>
      </View>
    );
  }
}
