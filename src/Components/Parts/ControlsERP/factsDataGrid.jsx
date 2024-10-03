import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { dyadicFuncExecutor } from '../../../General/funcExecutor';
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from '../../../General/commonFunctions';
// import store from '../../../AppRedux/store';
import { IconButton } from '@mui/material';
import Icon from "@mui/material/Icon";
import { ownStore } from '../../../AppOwnState/ownState';



class FactsDataGrid extends Component {
  constructor(props) {
    super(props);
    let resultLayoutInfo = GetControlPropertyFromStoreOrRefData(this.props?.layout, this.props.refData);
    let resultDataInfo = GetControlPropertyFromStoreOrRefData(this.props?.data, this.props.refData);
    this.state = {
      layout: resultLayoutInfo,
      data: resultDataInfo
    }
  }

  async componentDidMount() {

    // let resultLayoutInfo = await pageServiceInstance.loadData(this.props?.layout?.proc, this.props?.layout?.args);

    // let resultDataInfo = await pageServiceInstance.loadData(this.props?.data?.proc, this.props?.data?.args);
    this.mounted = true;
    this.unsubscribe = ownStore.subscribe(() => {
      if (this.mounted) {

        let resultLayoutInfo = GetControlPropertyFromStoreOrRefData(this.props?.layout, this.props.refData);
        let resultDataInfo = GetControlPropertyFromStoreOrRefData(this.props?.data, this.props.refData);
        this.setState({
          layout: resultLayoutInfo,
          data: resultDataInfo
        });


      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) this.unsubscribe();
  }

  async handleButtonClick(clickedRow) {
    await ExecuteLayoutEventMethods(this.props.whenclick, clickedRow);

  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        {this.props.downloadbutton ?
          <IconButton onClick={this._exportTableToExcel}>
            <Icon>file_download</Icon>
          </IconButton> : <></>
        }
        <TableContainer component={Paper} style={{ boxShadow: "none", ...this.props?.style }} >
          <Table id="Ftabledata" size="small" stickyHeader  {...this.props} style={{tableLayout : 'fixed' , ...this.props?.tableStyle}} >
            <TableHead className="fdatagrid-head">
              <TableRow>
                {
                  this.state?.layout &&
                  this.state.layout.map((t, index) => {
                    return <TableCell key={index}><strong>{t.dmldet_column_caption}</strong></TableCell>
                  })
                }

              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state?.data && this.state.layout &&
                this.state.data.map(
                  (row, index) => {
                    return (
                      <TableRow key={index} style={{ backgroundColor: row.TR_BACKCOLOR, color: row.TR_TEXTCOLOR }}

                        onClick={() => this.handleButtonClick(row)}
                      >
                        {this.state.layout.map((col, colindex) => {
                          return <TableCell 
                            style={{ color: this._getColumnTextColor(row, col), 
                            backgroundColor: this._getColumnBackgroundColor(row, col), 
               
                            ...this.props?.cellStyle }} 
                            className={`tbcell ${col.dmldet_column_alignment}`} key={colindex}
                            
                            >
                            {this._getFormattedCellValue(row, col)}

                          </TableCell>
                        })}
                      </TableRow>
                    );
                  }

                )
              }
            </TableBody>
          </Table>
        </TableContainer>



      </div>
      // <IntlProvider locale={navigator.language}>
      //  // </IntlProvider>  
      //  <button onClick={this._getExcelExport("TableName")}>Export to Excel</button>

    );
  }




  _exportTableToExcel(filename) {
    let tableID = "Ftabledata";
    let table = document.getElementById(tableID);
    let rows = [];
    filename = 'export_' + new Date().toLocaleDateString() + '.csv';
    //iterate through rows of table
    for (let row of table.rows) {
      let rowvalues = [];
      for (let trow of row.cells) {
       var cellValue = trow.innerText;
       cellValue = cellValue.replace('"', '""');
       if(cellValue.indexOf(',')>0){
        debugger;
        cellValue =`"${cellValue}"`  
       }
        rowvalues.push([cellValue]);
      }      
      rows.push(rowvalues);
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
    rows.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    /* create a hidden <a> DOM node and set its download attribute */
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    encodedUri = encodedUri.replaceAll("#", "");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    /* download the data file named "Stock_Price_Report.csv" */
    link.click();
  }

  _getColumnTextColor(row, col) {
    let ColorColumnname = 'TD_' + col.dmldet_column_name + '_TEXTCOLOR';
    return row[ColorColumnname] ??  row['TD_TEXTCOLOR'] ?? "inherit";
  }


  _getColumnBackgroundColor(row, col) {
    let ColorColumnname = 'TD_' + col.dmldet_column_name + '_BACKCOLOR';
    return row[ColorColumnname] ?? row['TD_BACKCOLOR'] ?? 'inherit';
  }

  // _getColumnBackgroundColor(row, col) {
  //   let ColorColumnname = 'TD_' + col.dmldet_column_name + '_BACKCOLOR';
  //   return row[ColorColumnname] ?? row['TD_BACKCOLOR'] ?? 'inherit';
  // }


  _getFormattedCellValue(row, col) {
    if (col.dmldet_column_type === "datetime") {
      return (
        // <FormattedDate format={} value={} />
        <span>{dyadicFuncExecutor("(dtformatntz)", row[col.dmldet_column_name], this._getDateFormat(col.dmldet_column_format))}</span>
      );
    }
    if (col.dmldet_column_type === "number") {
      return (
        // <NumberFormat displayType="text" value={row[col.dmldet_column_name]}  format={this._getNumberFormat(col.dmldet_column_format)}/>
        <span>{dyadicFuncExecutor("(numformat)", row[col.dmldet_column_name], col.dmldet_column_format)}</span>

      );
    }
    else {
      if (typeof col.DMLDET_MORE_OPTIONS !== "undefined") {
        try {
          let domparser = new DOMParser();
          let xmlObject = domparser.parseFromString(col.DMLDET_MORE_OPTIONS, 'text/xml');
          let cTypeEl = xmlObject.getElementsByTagName("ControlType");
          if (cTypeEl.length > 0) {
            let cNodes = cTypeEl[0];
            if (cNodes.childNodes.length > 0) {
              let cType = cNodes.childNodes[0].nodeValue;
              if (cType === "RepositoryItemHyperLinkEdit") {
                let cValue = row[col.dmldet_column_name];
                return (<a href={`${cValue}`} title={`${cValue}`} target="_blank" rel="noopener noreferrer">View</a>);

              }
            }
          }

        }
        catch { }

      }
      return (row[col.dmldet_column_name]);
    }
  }

  _getDateFormat(dateFormat) {
    if (dateFormat) {
      return dateFormat;
    }
    return 'DD/MM/YYYY';
  }

  _getNumberFormat(numberFormat) {
    if (numberFormat) {
      return numberFormat;
    }
    return '';
  }

}

export default FactsDataGrid;