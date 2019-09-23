import React from "react";

export function handleCheckbox(event) {
    const { data, errors } = { ...this.state };
    data[event.target.name] = event.target.checked;
    this.setState({ data, errors });
}


export function renderCheckbox({name, label, checked, className, canEdit, isVisible, ...rest}) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    return (
        <div className={`form-group ${className || ""}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                defaultChecked={data[checked]}
                name={name}
                type="checkbox"
                onChange={e => this.handleCheckbox(e)}
                value={name ? name : ""}
                label={label}
                readOnly={isWritable ? false : true}
            />

            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    );
}
