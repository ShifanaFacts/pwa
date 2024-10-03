import React, { Component } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { padding } from "@mui/system";
import { appTheme } from "../../../General/globals";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsGlobalSearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      inputValue: "",
      searchFieldColor: "#FFFFFF33",
      searchFieldTextColor: "#FFFFFF",
    };

    
    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      let storeDset = storeInfo.dset;     
      if (storeDset === "dsAppTheme") {
        let dsAppTheme = ownStore.getState("dsAppTheme");
        if(dsAppTheme)
        { 
          this.setState({
            searchFieldColor: dsAppTheme?.searchFieldColor,
        });
         this.setState({
          searchFieldTextColor: dsAppTheme?.searchFieldTextColor,
      });         
      }
    }
  });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange = (event, value) => {
    let menuItem = {};
    if (value != null) {
      for (let i = 0; i < this.props.userMenu.length; i++) {
        if (this.props.userMenu[i].caption == value.caption) {
          menuItem = this.props.userMenu[i];
          break;
        }
      }
      this.props.menuDropClick(menuItem, null, null);
    }

    this.setState({
      value: "",
    });
  };

  handleInputChange = (event, value) => {
    this.setState({
      inputValue: value,
    });
  };

  handleClose = (event, reson) => {
    this.setState({
      inputValue: "",
    });
  };

  

  render() {
    return (
      <React.Fragment>
        <Stack
        className="factsGlobalSearchField"
          spacing={2}
          sx={{ width: 200 }}
          style={{ margin: "0px", padding: "0px" }}
        >
          <Autocomplete
          className="factsGlobalSearchFieldAutocomplete"
            id="free-solo-search"
            freeSolo
            disableClearable
            // options={this.props.userMenu
            //   // .filter((menu) => menu.permalink)
            //   .map((menu) => menu.caption)}
            options={this.props.userMenu.filter((menu) => menu.action)}
            getOptionLabel={(option) =>
              option.caption ? `${option.caption} (${option.doctype})` : ""
            }
            renderOption={(props, option) => (
              <li {...props} key={option.menuid}>
                {option.caption} - {option.doctype}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search here..."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  className:"factsGlobalSearchFieldInput"
                }}
                className="factsGlobalSearchFieldText"
              />
            )}
            onChange={this.handleChange}
            onClose={this.handleClose}
            onInputChange={this.handleInputChange}
            size="small"
            // blurOnSelect="true"
            clearOnBlur={true}
            value={this.state.value}
            inputValue={this.state.inputValue}
          />
        </Stack>
      </React.Fragment>
    );
  }
}

export default FactsGlobalSearchField;
