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
        const { component } = this.props;
    }

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        const { component } = this.props
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
        component && component.setState({ 
            crop: percentCrop,
            isChangeCrop: (percentCrop.width < 100 || percentCrop.height < 100) ? true : false
         })
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
        let { src } = this.props
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
                width: parseInt(crop.width),
                height: parseInt(crop.height),
                extention: fileExtention
            })
            // this.setState({ croppedImageUrl });
        }
    }
    componentDidMount(){
        let inititalCrop = {
            width: 100,
            height: 100,
            unit: '%',
            x:0,
            y:0
        }
        this.setState({
            crop: inititalCrop,
        })
        const { component } = this.props
        component && component.setState({ 
            isChangeCrop: true
         })
    }

    render() {
        let { src } = this.props
        let { crop } = this.state
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
                    // ruleOfThirds={true}
                    imageStyle={{
                        maxHeight: "80vh",
                        maxWidth: "calc(100vw - 20px)"
                    }}
                />
            </div>
        )
    }
}
export default Loader
