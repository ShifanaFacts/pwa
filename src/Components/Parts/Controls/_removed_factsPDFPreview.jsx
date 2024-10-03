import React, { Component } from "react";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

class FactsPDFPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
        }
        this.pdfData = GetControlPropertyFromStoreOrRefData(this.props.file, this.props.refData);
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }
    goPreviousPage() {
        if (this.state.pageNumber > 1) {
            this.setState({
                pageNumber: this.state.pageNumber - 1
            });
        }
    }
    goNextPage() {
        if (this.state.pageNumber < this.state.numPages) {
            this.setState({
                pageNumber: this.state.pageNumber + 1
            });
        }
    }
    render() {
        return (
            <div style={{ display: "inline-block" }}>
                <Document file={this.pdfData} onLoadSuccess={this.onDocumentLoadSuccess} >
                    <Page pageNumber={this.state.pageNumber} />
                </Document>
                <IconButton onClick={() => this.goPreviousPage()} size="small" style={{ backgroundColor: "white" }}>
                    <ArrowBackIcon />
                </IconButton>
                <span style={{ paddingLeft: "10px", paddingRight: "10px", color: "white" }}>Page {this.state.pageNumber} of {this.state.numPages}</span>
                <IconButton onClick={() => this.goNextPage()} size="small" style={{ backgroundColor: "white" }}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>

        );

    }
}

export default FactsPDFPreview; 