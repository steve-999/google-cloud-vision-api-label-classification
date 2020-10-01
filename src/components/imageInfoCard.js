import React from 'react';
import { Link } from 'react-router-dom';

const ImageInfoCard = ({ fileInfo, galleryComponent }) => {

    const labelsTableRows = fileInfo.labels.map(label => {
        return (
            <tr key={label.score}>
                <td>{ label.description }</td><td>{ label.score.toFixed(2) }</td>
            </tr>
        )
    })

    return (
        <div className="my-card-container" key={ fileInfo.id }>
            <div className="my-card-title">
                { galleryComponent  ? <Link to={`/gallery/${fileInfo.id}`}><h5 className="filename-title">{ fileInfo.filename }</h5></Link>
                                    : <h5 className="filename-title">{ fileInfo.filename }</h5>
                }
            </div>
            <div className="card-content-container">
                <div className="image-container">
                    { galleryComponent ? <Link to={`/gallery/${fileInfo.id}`}><img src={`${fileInfo.firebaseUrl}`} alt="" /></Link>
                                       : <img src={`${fileInfo.firebaseUrl}`} alt="" />
                    }
                    <p style={{ textAlign: "center"}}><span>Size: { (fileInfo.size / (8 * 1024)).toFixed(0) } KB</span>
                    <span style={{marginLeft: 30}}>Original dimensions (W x H): { fileInfo.width + ' x ' + fileInfo.height }</span></p>
                </div>
                <div className="labels-container">
                    <table>
                        <thead>
                            <tr><th>Label</th><th>Score</th></tr>
                        </thead>
                        <tbody>
                            { labelsTableRows }
                        </tbody>
                    </table>
                </div>                                
            </div>
        </div>
    );
}

export default ImageInfoCard;