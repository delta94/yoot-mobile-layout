import React from 'react';
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import './style.scss'


export class Loader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        this.setState({
            crop: this.props.crop
        })
    }

    componentWillReceiveProps(nextProps) {
        let { crop } = this.props
        if (Object.entries(crop).toString() != Object.entries(nextProps.crop).toString()) {
            this.setState({
                crop: nextProps.crop
            })
        }
    }

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    getCroppedImg(image, crop, fileName, extention) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                blob.lastModifiedDate = new Date();
                resolve(blob)
            }, extention);
        });
    }

    async makeClientCrop(crop) {
        let {
            src
        } = this.props
        console.log("crop", crop)
        let fileExtention = src.split(";")[0].split(":")[1]
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.' + fileExtention.split('/')[1],
                fileExtention
            );
            if (this.props.onCropped) this.props.onCropped({
                file: croppedImageUrl,
                width: crop.width,
                height: crop.height,
                extention: fileExtention
            })
            // this.setState({ croppedImageUrl });
        }
    }

    render() {
        let {
            src
        } = this.props
        let {
            crop
        } = this.state
        return (
            <div className={"custom-cropper"}>
                <ReactCrop
                    src={src}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                    keepSelection={true}
                />
            </div>
        )
    }
}
export default Loader
