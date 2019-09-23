import React from "react";

export function renderTextarea({ name, label, className, canEdit, isVisible=true, ...rest }) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    return (
        <div className={`form-group ${className || ""}`}>
            <label htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                className="form-control"
                onChange={e => this.handleChange(e, validateWhileTyping)}
                value={data ? data[name] : ""}
                disabled={isWritable ? false : true}
                {...rest}
            ></textarea>

            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    );
}
