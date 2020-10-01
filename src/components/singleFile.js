import React, { Component } from 'react';
import { firestoreDB } from '../firebase/config';
import ImageInfoCard from './imageInfoCard';

class SingleFile extends Component {

    constructor(props) {
        super(props);  
        this.state = {
            id: null,
            fileInfo: null
        };
    }

    componentDidMount() {
        this.setState({ 
            id: this.props.match.params.fname 
        }, () => {
            firestoreDB.collection('image_info').doc(this.state.id).get()
                .then(doc => {
                    const fileInfo = doc.data();
                    this.setState({ 
                        fileInfo 
                    });                    
                });

        });
    }

    render() {

        const container = {
            width: "90%",
            minHeight: "550px",
            margin: "50px auto"
        }

        return (
            <div style={container}>   
                { this.state.fileInfo  && <ImageInfoCard fileInfo={this.state.fileInfo} galleryComponent={false} /> } 
            </div>
        );
    }
}

export default SingleFile;
