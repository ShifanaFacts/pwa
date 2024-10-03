import React, { Component } from 'react';
import TextField from "@mui/material/TextField";


class FactsTextBox extends Component {
    static muiName = TextField.muiName;
    constructor(props) {
        super(props);
    }

    render() {
        return (<TextField {...this.props} />);

    }
}

export default FactsTextBox; 