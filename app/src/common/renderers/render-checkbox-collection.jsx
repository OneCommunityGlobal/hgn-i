import React from "react";

//TODO pulled from file needs fixing
export function renderCheckboxCollection({ name, pathName, isChecked, onChange, items, canEdit, isVisible, ...rest }) {
    const { errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    // const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    const getCheckBox = element => (
        <div className="form-check" key={element._id}>
            <input
                {...rest}
                id={element._id}
                value={element[pathName]}
                name={element[pathName]}
                className="form-check-input"
                type="checkbox"
                checked={isChecked(element._id)}
                {...rest}
                onChange={e => onChange(e)}
            />
            <label className="form-check-label" htmlFor={element[pathName]}>
                {element[pathName]}
            </label>
        </div>
    );

    return (
        <div className="form-group">
            {items.map(item => getCheckBox(item))}
            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    );

    // return <CheckboxCollection error={errors[collectionName]} {...rest} />;
}