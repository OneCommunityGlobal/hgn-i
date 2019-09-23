import React from "react";

export function renderImage({ name, label, className, isVisible, ...rest }) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    return (
        <div className={`form-group ${className}`}>
            <label htmlFor={name}>{label}</label>
            <img
                type="image"
                id={name}
                name={name}
                onChange={e => this.handleChange(e)}
                value={data ? data[name] : ""}
                label={label}
                alt={label}
                className={`img-responsive ${className}`}
                {...rest}
            />

            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    );
}
