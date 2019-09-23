import React from 'react';

export function renderButton({ name, label, onClick, color, className = "", canEdit = false, isVisible=true, ...rest }) {
    // const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    // const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    if (isVisible) {
        return (
            <button
                name={name}
                disabled={!isWritable ? true : false}
                onClick={this.handleSubmit}
                color={color}
                className={`btn btn-primary ${className || ""}`}
            >
                {label}
            </button>
        );
    }
}
