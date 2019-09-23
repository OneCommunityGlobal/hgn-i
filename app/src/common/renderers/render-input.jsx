import React from "react";

export function renderInput({ name, label, type, min, max, className, canEdit = false, isVisible = true, ...rest }) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    if (isVisible) {
        return (
            <div className={`form-group ${className || ""}`}>
                <label htmlFor={name}>{label}</label>
                <input
                    id={name}
                    name={name}
                    className="form-control"
                    type={type}
                    onChange={e => this.handleChange(e, validateWhileTyping)}
                    value={data ? data[name] : ""}
                    min={min}
                    max={max}
                    readOnly={isWritable ? false : true}
                    {...rest}
                />

                {error && <div className="alert alert-danger mt-1">{error}</div>}
            </div>
        );
    }
}