import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Link } from 'react-router-dom';
import { getCroppedImage } from '../utils/GetCroppedImage';
import Spinner from './Spinner';

const ImageCropper = ({loadedImage, setCroppedImage, setShowModal, clearFileInput, setCroppedImageSrc  = null}) => {
  const [crop, setCropChange] = useState({ x: 0, y: 0 });
  const [zoom, setZoomChange] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    
    // we create a temporary URL for our file object
    const objectUrl = URL.createObjectURL(loadedImage);
    setImageSrc(objectUrl);

    setIsLoading(false);

    // for cleaning up RAM after we set the imageSrc
    return () => URL.revokeObjectURL(objectUrl);
    
  }, [loadedImage, setCroppedImage]);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  const handleSave = async()=>{
    setIsLoading(true);
    
    const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels, loadedImage);
    
    setCroppedImage(croppedImage);
    
    if(setCroppedImageSrc != null){
      // we create a temporary URL for our cropped image to display whenever it is needed
      const croppedImageSrc = URL.createObjectURL(croppedImage);
      setCroppedImageSrc(croppedImageSrc);
    }

    setShowModal(false);
    setIsLoading(false);
  }

  const handleCancel = async()=>{
    setIsLoading(true);

    clearFileInput();
    setCroppedImage("");

    if(setCroppedImageSrc != null){
      setCroppedImageSrc("");
    }

    setShowModal(false);
    setIsLoading(false);
  }
  

  return (
        <>
          {
            isLoading
            ?
              < Spinner />
            :
            <>
              <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoomChange}
              />
              <div className="crop-image-buttons-box d-flex flex-row gap-10">
                  <Link className="white-btn squared-border" to="" onClick={()=>handleCancel()}>Cancel</Link>
                  <Link className="pagination-item cursor-pointer px-20 py-10" to="" onClick={()=>handleSave()}>Save</Link>
              </div>
            </>
          }
        </>
  )
}

export default ImageCropper;