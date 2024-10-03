import React, { Component } from 'react';

//Used to show external content
class FactsExtraContent extends Component {
    constructor(props) {
        super(props);
        this.iframeRef = React.createRef();
    }

    componentDidMount() {
        // if (this.iframeRef?.current?.contentWindow?.receiveCall)
        if (this.iframeRef?.current)
            this.iframeRef.current.onload = () => {
                this.iframeRef.current.contentWindow.receiveCall(this.props.data, this.props.args);
            };

    }

    render() {
        return (
            <iframe className="factsExtraContent" ref={this.iframeRef} title="Content"
                {...this.props} data={undefined} resolveprops={undefined} ></iframe>
        );
    }
}

export default FactsExtraContent; 