import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
const ImageUpload = (props) => {

  const filePickerRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {

    if (!file) return;

    const fileReader =
      new FileReader();

    fileReader.onload = () => {

      setPreviewUrl(
        fileReader.result
      );

    };

    fileReader.readAsDataURL(file);

  }, [file]);

  const pickedHandler = (event) => {

    let pickedFile;
    let fileIsValid = isValid;

    if (
      event.target.files &&
      event.target.files.length === 1
    ) {

      pickedFile =
        event.target.files[0];

      setFile(pickedFile);
      setIsValid(true);

      fileIsValid = true;

    } else {

      setIsValid(false);
      fileIsValid = false;

    }

    props.onInput(
      props.id,
      pickedFile,
      fileIsValid
    );

  };

  const pickImageHandler = () => {

    filePickerRef.current.click();

  };

  return (

    <div>

      <input
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />

      <div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100px"
            }}
          />
        )}

      </div>

      <button
        type="button"
        className="image-upload__button"
        onClick={pickImageHandler}
      >
        PICK IMAGE
      </button>

    </div>

  );

};

export default ImageUpload;