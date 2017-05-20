import React from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'material-ui';
import tryToParseJson from './tryToParseJson';

const textFieldStyle = {height: "48px", width: "130px", fontSize: "15px", marginTop: "-18px"};

/**
 * @description
 * open input for JSON/string values. will try to parse as JSON and fallback to string.
 * 
 * @param {any} [selectedValue]
 * @param {string} name to use as the unique id for the input
 * @param {function} onChange
 */
export default class ParamSelectorJSON extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.selectedValue || ''
        };
        this.onChange = this.onChange.bind(this);
        this.reportChangeBounced = _.debounce(val => this.reportChange(val), 150);
    }

    /**
     * Update state.value as string when nextProps.selectedValue has changed
     * @param {object} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        const nextStringifiedValue = JSON.stringify(nextProps.selectedValue);
        if (nextStringifiedValue !== JSON.stringify(this.props.selectedValue)) {
            this.setState({value: nextStringifiedValue || ''});
        }
    }

    /**
     * Will update the new value from the event.
     * sadly the event cannot be sent to the parent onChange because we debounce the onChange
     * @param {event} e 
     */
    onChange(e) {
        const newValue = e.target.value;
        this.setState({value: newValue});
        this.reportChangeBounced(newValue);
    }

    /**
     * report to parent onChange, this function is debounced to be reportChangeBounced
     * @param {string} val 
     */
    reportChange(val) {
        val = tryToParseJson(val);
        this.props.onChange && this.props.onChange(null, val);
    }

    /**
     * render the text field
     */
    render() {
        return (
            <div className="json-selector-wrapper">
                <TextField
                    style={textFieldStyle}
                    multiLine={true}
                    rowsMax={4}
                    id={`json-text-field-for-${this.props.name}`}
                    hintText="string, array, etc"
                    onChange={this.onChange}/>
            </div>
        );
    }
}

ParamSelectorJSON.PropTypes = {
    name: PropTypes.string,
    selectedValue: PropTypes.any,
    onChange: PropTypes.func
};