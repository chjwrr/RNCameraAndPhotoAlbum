import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,
    Image,
    NativeModules,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

export default class PhotoPage extends React.Component {

    state = {
        avatarSource: null,
        videoSource: null
    };

    /*选择照片*/
    selectPhotoTapped() {
        //  相册选项
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };



        // showImagePicker  弹出选择相机、相册框
        // launchImageLibrary 弹出相册
        // ImagePicker.launchCamera 弹出相机

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                console.log('response：',JSON.stringify(response));

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    /*选择视频*/
    selectVideoTapped() {
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: 'medium'
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    videoSource: response.uri
                });
            }
        });
    }

    uploadImage(){

        let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
        let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,

        formData.append("photo",file);   //这里的files就是后台需要的key
        formData.append('phoneNum','15112345678');


        fetch('http://192.168.32.144:8899/app/photo/idCard/handle',{
            method: 'POST',
            headers: {
                'Content-Type':'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json() )
            .then((responseData)=>{

                console.log('responseData:',responseData);
            })
            .catch((error)=>{
                console.error('error',error)}
            );
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                        { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
                            <Image style={styles.avatar} source={this.state.avatarSource} />
                        }
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
                    <View style={[styles.avatar, styles.avatarContainer]}>
                        <Text>Select a Video</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.uploadImage.bind(this)}>
                   <Text>上传图片</Text>
                </TouchableOpacity>

                { this.state.videoSource &&
                <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource}</Text>
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
});
AppRegistry.registerComponent('RNImagePicker', () => PhotoPage);
