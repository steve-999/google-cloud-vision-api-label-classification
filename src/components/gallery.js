import React, { Component } from 'react';
import { firestoreDB } from '../firebase/config';
import ImageInfoCard from './imageInfoCard';
import './gallery.css';

class Gallery extends Component {

    constructor(props) {
        super(props);  
        this.state = {
            imageFiles: []
        };
    }

    componentDidMount() {
        firestoreDB.collection('image_info').orderBy('createdAt', 'desc').get()
            .then((snap) => {
                let documents = [];
                snap.forEach(doc => {
                    documents.push({...doc.data(), id: doc.id})
                });
                this.setState({ 
                    imageFiles: documents 
                });
            });
    }

    render() {
        return (
            <div className="main-container" style={{width: "80%"}}>
                <h4>Gallery</h4>
                { this.state.imageFiles.map(fileInfo => <ImageInfoCard fileInfo={fileInfo} galleryComponent={true} key={fileInfo.id} />) }
            </div>
        );
    }
}

export default Gallery;
