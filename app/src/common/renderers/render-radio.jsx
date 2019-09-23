import React from "react";

export function renderRadio({ name, label, checked, options, canEdit, isVisible, ...rest }) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    return (
        <div className="form-group">
            {options.map(item => (
                <div className="form-check form-check-inline" key={item.value}>
                    <input
                        type="radio"
                        value={data ? data[name] : ""}
                        name={name}
                        className="form-check-input"
                        defaultChecked={data[checked]}
                        disabled={isWritable ? false : true}
                        {...rest}
                    />
                    <label htmlFor={item.value.toString()} className="form-check-label">
                        {item.label}
                    </label>
                </div>
            ))}

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    )
}