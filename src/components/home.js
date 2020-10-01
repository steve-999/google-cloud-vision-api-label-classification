import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import M from "materialize-css";
import { firebaseStorage, firestoreDB, timestamp } from '../firebase/config';

class Home extends Component {

    constructor(props) {
        super(props);  
        this.state = {
            fileLabels: [],
            urlLabels: [],
            selectedImageFile: null,
            selectedImageUrl: null,
            imageFileValidated: false,
            imageUrlValidated: false,
            errorMessageTitle: '',
            errorMessage: '',
            fileInfo: null
        };
    }

    componentDidMount = () => {
        M.Tabs.init(this.Tabs);
        M.Modal.init(this.Modal);
    }

    componentDidUpdate = () => {
        const fieldsList = ['fileUploadProgress',  'firebaseUrl', 'filename', 'size', 'type', 'width', 'height', 'file_or_url', 'labels'];
        const fieldsListSet = new Set(fieldsList);
        const fileInfo = this.state.fileInfo;
        let prevFileInfo;
        if (fileInfo && fileInfo !== prevFileInfo) {
            const fieldsPresentSet = new Set(Object.keys(fileInfo));
            if(this.setsAreEqual(fieldsListSet, fieldsPresentSet)) {
                fileInfo.createdAt = timestamp();
                firestoreDB.collection('image_info').add(fileInfo);
            }
        }
        prevFileInfo = fileInfo;
    }

    setsAreEqual = (a, b) => {
        return a.size === b.size && [...a].every(value => b.has(value));
    }

    handleKeyDown = (e) => {
        if (!['Control', 'v', 'Backspace', 'Delete'].includes(e.nativeEvent.key))
        {
            this.showErrorModal('You cannot type the URL, please paste it into the box.');
            e.preventDefault();
        }
    }

    handleUrlChange = (e) => {
        const inputUrl = e.target.value;
        this.setState({
            selectedImageUrl: inputUrl,     
            urlLabels: [],
            imageUrlValidated: false
        }, () => {     
            if(inputUrl.length > 0) {
                fetch(this.state.selectedImageUrl) 
                    .then(resp => resp.blob())
                    .then(blob => {
                        const fname = this.getUrlFilename(inputUrl, blob.type);
                        const file = new File([blob], fname, { type: blob.type });
                        this.validateImageFile(file, 'url')
                            .then(() => {
                                this.getBase64EncodingFromFile(file)
                                    .then(dataURI => {                                   
                                        const base64Enc = dataURI.split(',')[1];
                                        const imageField = {
                                            content: base64Enc
                                        };        
                                        this.fetchLabels(imageField, 'url');
                                        this.uploadFileToFirebase(file);   
                                    })
                                    .catch(err => this.showErrorModal(err));
                                })
                                .catch(err => this.showErrorModal(err));
                        })
                    .catch(err => this.showErrorModal(err));
            }
        });
    }

    getUrlFilename = (inputUrl, type) => {
        const idx = inputUrl.lastIndexOf("/") + 1;
        let path = inputUrl.substr(idx);
        const expectedExtension = type.replace('image/', '');
        const actualExtension = path.replace(/[#?].*$/,'').split('.').pop();
        let extension;
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'raw', 'ico', 'tiff'].includes(actualExtension.toLowerCase()))
            extension = actualExtension;
        else
            extension = expectedExtension.replace('e', '');
    
        let fname_no_ext = path.replace(/[#?].*$/,'').replace(/\..+/, '');
        if (fname_no_ext.length === 0 || fname_no_ext.length > 150)
            fname_no_ext = 'image_' + new Date().toISOString().replace(/[-:]/g, '-').replace('T', '_').replace(/\..+/, '');
        return `${fname_no_ext}.${extension}`;
    }

    handleImageFileSelect = (e) => {
        if (e.target.files.length === 0) {
            this.showErrorModal('No file was selected');
            return;
        }      
        const file = e.target.files[0];    
        this.setState({
            selectedImageFile: URL.createObjectURL(file),
            fileLabels: [],
            imageFileValidated: false
        }, () => {
            this.validateImageFile(file, 'file')
                .then(() => {
                    this.getBase64EncodingFromFile(file)
                        .then(dataURL => {
                            const base64Enc = dataURL.split(',')[1];
                            const imageField = {
                                content: base64Enc
                            };
                            this.fetchLabels(imageField, 'file');
                            this.uploadFileToFirebase(file);    
                        })
                        .catch(err => this.showErrorModal(err));
                })
                .catch(err => this.showErrorModal(err));
            });
    }

    getBase64EncodingFromFile = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => {
            error.message = 'Error occurred encoding to base 64';  
            reject(error);
          }
        });
    }

    validateImageFile = (file, file_or_url) => {
        const validationField = file_or_url === 'file' ? 'imageFileValidated' :  'imageUrlValidated';
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { 
                this.setState({
                    [validationField]: true,
                    fileInfo: {
                        filename: file.name, 
                        size: file.size,  
                        type: file.type,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        file_or_url: file_or_url
                    }
                }, () => {
                    resolve(img);
                })
            };
            img.onerror = err => {
                this.setState({
                    [validationField]: false
                });
                err.message = 'File validation check failed';
                reject(err);
            }
            img.src = URL.createObjectURL(file);  
        });
    }

    createRequestBody = (imageField) => {
        const body = {
            requests: [
            {
                image: imageField,
                features: [
                    {
                        type: 'LABEL_DETECTION',
                        maxResults: 10
                    }
                ]
            }
          ]
        };
        return body;
    }

    fetchLabels = (imageField, file_or_url) => {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

        let body = this.createRequestBody(imageField);
        const fetchOptions = {
            method: 'POST', 
            body: JSON.stringify(body)
        };
        fetch(endpoint, fetchOptions)
            .then(resp => resp.json())
            .then(resp => {
                const annotations = resp['responses'][0]['labelAnnotations'];
                if (!annotations) {
                    throw resp[0];
                }
                const labels = annotations.map(d => {
                    const label = {
                        description: d.description,
                        score: d.score,
                    };
                    return label;
                });
                if(file_or_url === 'file') {
                    this.setState({
                        fileLabels: labels,
                        fileInfo: { ...this.state.fileInfo, labels: labels }
                    });
                }
                else {
                    this.setState({
                        urlLabels: labels,
                        fileInfo: { ...this.state.fileInfo, labels: labels }
                    });
                }
            }) 
            .catch(err => this.showErrorModal(err));
    }

    showErrorModal = (errMsg, errMsgTitle='Error') => {
        if (typeof errMsg === 'object') {
            errMsg = JSON.stringify(errMsg);
        }
        this.setState({
            errorMessageTitle: errMsgTitle,
            errorMessage: errMsg
        }, () => {
            console.log(this.state.errorMessage);
            const elem = document.querySelector('#modal1');
            const instance = M.Modal.getInstance(elem);
            instance.open();
        }); 
    }

    uploadFileToFirebase = (file) => {
        const storageRef = firebaseStorage.ref(file.name);

        storageRef.put(file).on('state_changed', (snap) => {
            let percentage = (100 * snap.bytesTransferred / snap.totalBytes);
            this.setState({ 
                fileInfo: { ...this.state.fileInfo, fileUploadProgress: percentage }
            });
        }, (err) => {
            err.message = 'Error uploading file to firebase';
            this.showErrorModal = (err);
        }, () => {
            storageRef.getDownloadURL()
                .then(url => {
                    this.setState({ 
                        fileInfo: { ...this.state.fileInfo, firebaseUrl: url}
                    });
                });
        });
    }

    ///////////////////////////////////////////////////

    getLabelsTable = (labels) => {
        return (
            <table>
                <thead>
                    <tr><th>Label</th><th>Score</th></tr>
                </thead>
                <tbody>
                    { this.createTableRows(labels) }
                </tbody>
            </table>
        );
    }

    createTableRows = (labels) => {
        const tableRows = labels.map(label => {
            return (
                <tr key={ label.description }>
                    <td>{ label.description }</td>
                    <td>{ label.score.toFixed(2) }</td>
                </tr>
            )
        });
        return tableRows;
    }

    render = () => {
        return (
            <div className="home-container">
                <div className="tabs-container">
                    <ul className="tabs" ref={Tabs => {this.Tabs = Tabs; }}>
                        <li className="tab col s2"><Link to="#selectByFile-container">File</Link></li>                            
                        <li className="tab col s2"><Link to="#selectByURL-container">URL</Link></li>
                    </ul>
                </div>

                <div id="selectByFile-container">                           
                    <form id="select-image-file-form" method="POST" encType="multipart/form-data">
                        <input type="file" name="browse-button" id="browse-button" className="inputfile" accept="image/*" 
                                    onChange={this.handleImageFileSelect} />
                        <label htmlFor="browse-button">Choose a file</label>                            
                    </form>

                    <div className="results-container">
                        <div className="image-preview-container">
                            { this.state.selectedImageFile &&  
                                <img id="selected-image-file-preview" src={this.state.selectedImageFile} alt="preview" />
                            }
                        </div>
                        {this.state.fileLabels.length > 0 && 
                            <div className='labels-table-container'>
                                { this.getLabelsTable(this.state.fileLabels) }                         
                            </div> 
                        }
                    </div>                        
                </div>

                <div id="selectByURL-container">
                    <form id="select-image-url-form" method="POST" encType="multipart/form-data">
                        <h6>Paste an image URL below:</h6>
                        <textarea onKeyDown={this.handleKeyDown} id="image-url" name="image-url" onChange={this.handleUrlChange} cols="60" rows="1" 
                                placeholder="Paste an image URL here..."/>                           
                    </form>

                    <div className="results-container">
                        <div className="image-preview-container">
                            { this.state.selectedImageUrl && 
                                <img id="selected-image-url-preview" src={this.state.selectedImageUrl} alt="preview" /> 
                            }
                        </div>
                        { this.state.urlLabels.length > 0 && 
                            <div className='labels-table-container'>
                                { this.getLabelsTable(this.state.urlLabels) }
                            </div>
                        }   
                    </div>                         
                </div>   

                <div id="modal1" className="modal" ref={Modal => {this.Modal = Modal; }}>
                    <div className="modal-content">
                        <h5 className="modal-title">{this.state.errorMessageTitle}</h5>
                        <p className="modal-paragraph">{this.state.errorMessage}</p>
                    </div>
                    <div className="modal-footer">
                        <Link to="#" className="modal-close waves-effect waves-green btn-flat">OK</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
