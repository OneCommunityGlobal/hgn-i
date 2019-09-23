import React from 'react';

export function renderSelect({ name, label, options, className, canEdit, isVisible, ...rest }) {
    const { data, errors } = { ...this.state };
    const { formControl } = { ...this.props };
    const error = errors[name];

    const currElem = (typeof formControl !== "undefined" && typeof formControl.elements !== "undefined" &&
        typeof formControl.elements[name] !== "undefined") ? formControl.elements[name] : {};
    // const validateWhileTyping = (currElem.validateWhileTyping) ? true : false;
    const isWritable = ((formControl.isWritable) || (canEdit && currElem.canEdit)) ? true : false;
    isVisible = (isVisible || (typeof currElem.isVisible === 'undefined' || true === currElem.isVisible)) ? true : false;

    return (
        <div className={`form-group ${className}`}>
            <label id="name" htmlFor={name}>{label}</label>
            <select
                value={data ? data[name] : ""}
                name={name}
                id={name}
                onChange={e => this.handleChange(e)}
                disabled={isWritable ? false : true}
                className="form-control"
                {...rest}
            >
                <option value=""> Please select a {' '} {label} </option>
                {options.map(i => (
                    <option value={i._id} key={i._id}>
                        {i.name}
                    </option>
                ))}
            </select>
            
            {error && <div className="alert alert-danger mt-1">{error}</div>}
        </div>
    )
}
