import React from "react";

export function handleFileUpload({ e, readAsType = "data" }) {
  const file = e.target.files[0];
  const reader = new FileReader();
  const name = e.target.name;

  if (file) {
    switch (readAsType) {
      case "data":
        reader.readAsDataURL(file);
        break;
      default:
        break;
    }
  }
  reader.onload = () => this.handleState(name, reader.result);
};

function FileUpload({ name, accept, label, className, maxSizeinKB, error, onUpload, readAsType, canEdit }) {
  const onChange = async e => {
    let errorMessage = "";
    const file = e.target.files[0];
    let isValid = true;
    if (!file) {
      return alert("Choose a valid file");
    }
    if (accept) {
      const validfileTypes = accept.split(",");

      if (!validfileTypes.includes(file.type)) {
        errorMessage = `File type must be ${accept}.`;
        isValid = false;
      }
    }

    if (maxSizeinKB) {
      const filesizeKB = file.size / 1024;

      if (filesizeKB > maxSizeinKB) {
        errorMessage = `\nThe file you are trying to upload exceed the maximum size of ${maxSizeinKB}KB. You can choose a different file or use an online file compressor.`;
        isValid = false;
      }
    }

    return isValid ? onUpload(e, readAsType) : alert(errorMessage);
  };

  return (
    <React.Fragment>
      <label
        htmlFor={name}
        className="fa fa-edit"
        data-toggle="tooltip"
        data-placement="bottom"
        title={label}
      />
      <input
        id={name}
        name={name}
        className={className}
        onChange={e => onChange(e)}
        accept={accept}
        disabled={(canEdit ? false : true)}
        type="file"
      />

      {error && <div className="alert alert-danger mt-1">{error}</div>}
    </React.Fragment>
  );
};

export function renderFileUploadButton({ name, canEdit, isVisible, ...rest }) {
  const { errors } = { ...this.state };
  const { formControl } = { ...this.props };

  const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
    typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
  // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
  const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
  isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

  return (
    <FileUpload
      name={name}
      onUpload={this.handleFileUpload}
      canEdit={isWritable}
      error={errors[name]}
      {...rest}
    />
  );
}
