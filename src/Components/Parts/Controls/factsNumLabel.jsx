import React, { Component } from "react";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { format } from "date-fns/esm";
import Button from "@mui/material/Button";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsNumLabel extends Component {
  constructor(props) {
    super(props);
    this.originalText = GetControlPropertyFromStoreOrRefData(
      props.text,
      props.refData
    );
    let [hasMore, textExcerpt] = this.getExcerpt(this.originalText);
    this.state = {
      textValue: textExcerpt,
      hasMoreText: hasMore,
      };
      
    //   this.state.textValue = parseFloat(this.state.textValue).toFixed(2);
      //   this.state.textValue = this.state.textValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      this.CompanyParameters =
      GetControlPropertyFromStoreOrRefData("[dsCompanyParameters]", props.refData)
    
    this.numberFormat = (this.CompanyParameters?.CURRENCY_FORMAT==undefined || this.CompanyParameters?.CURRENCY_FORMAT=="")? "##,###.00": this.CompanyParameters?.CURRENCY_FORMAT;
  }

  ripOffControlSpecificAttributes() {
    const excluded = ["refData", "format", "datatype", "text", "staticbinding"];
    return Object.keys(this.props)
      .filter((t) => !excluded.includes(t))
      .reduce((obj, key) => {
        obj[key] = this.props[key];
        return obj;
      }, {});
  }

  getExcerpt(originalText) {
    let hasMore = false;
    let textExcerptValue = originalText === null ? "" : originalText;
    if (
      this.props.excerpt?.count &&
      textExcerptValue.length > (this.props.excerpt?.count ?? 0)
    ) {
      hasMore = true;
      textExcerptValue = textExcerptValue.substring(
        0,
        this.props.excerpt?.count
      );
    } else hasMore = false;

    return [hasMore, textExcerptValue];
  }

  componentDidMount() {
    this.mounted = true;
    if (!this.props.staticbinding) {
      this.unsubscribe = ownStore.subscribe(() => {
        if (this.mounted) {
          this.originalText = GetControlPropertyFromStoreOrRefData(
            this.props.text,
            this.props.refData
          );

          if (this.state.textValue !== this.originalText) {
            let [hasMore, textExcerpt] = this.getExcerpt(this.originalText);

            this.setState({
              textValue: textExcerpt,
              hasMoreText: hasMore,
            });
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) this.unsubscribe();
  }

  handleReadMoreClick() {
    if (this.state.hasMoreText) {
      this.setState({
        textValue: this.originalText,
        hasMoreText: false,
      });
    } else {
      let [hasMore, textExcerpt] = this.getExcerpt(this.originalText);
      this.setState({
        textValue: textExcerpt,
        hasMoreText: hasMore,
      });
    }
  }

  render() {
      let newProps = this.ripOffControlSpecificAttributes();
      
    this.state.textValue = parseFloat(this.state.textValue).toFixed(2);
    
        this.state.textValue = this.state.textValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // this.state.textValue = this.state.textValue.toLocaleString();
      
      // this.state.textValue = parseFloat(this.state.textValue);
      // this.state.textValue.format(this.numberFormat);
      
    //   this.state.textValue.format(this.numberFormat)

    // this.state.textValue = this.state.textValue
    //   .toString()
    //   .replace(/^\d{1,3}(,\d{3})*(\.\d{2})?$/);
      
    return (
      <>
        <span {...newProps}>{this._getEscapeValue(this.state.textValue)}</span>
        {this.props.excerpt?.count && (
          <Button
            className="factsLabel"
            size="small"
            variant="outlined"
            color="secondary"
            style={{
              padding: "0px 10px",
              textTransform: "initial",
              margin: "5px 10px",
              height: "18px",
            }}
            onClick={this.handleReadMoreClick.bind(this)}
          >
            {this.state.hasMoreText
              ? this.props.excerpt?.morelabel ?? ">>More..."
              : this.props.excerpt?.lesslabel ?? "<<Less..."}
          </Button>
        )}
      </>
    );
  }

  _getEscapeValue(value) {
    if (typeof value == "string" && value.includes(String.fromCharCode(13))) {
      let splitted = value.split(String.fromCharCode(13));
      return splitted.map((item, i) => (
        <>
          {item} {i < splitted.length - 1 ? <br /> : <></>}
        </>
      ));
    } else {
      let val = value;

      if (this.props.datatype === "datetime" && this.props.format && value) {
        value = Date.parse(value);
        val = format(value, this.props.format);
      }
      return val;
    }
  }
}

export default FactsNumLabel;
