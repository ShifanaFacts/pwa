import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { pageServiceInstance } from '../../../General/globals';
// import { FormattedDate, FormattedNumber } from 'react-intl';
// import { IntlProvider } from 'react-intl';
import { dyadicFuncExecutor } from '../../../General/funcExecutor';




class FactsDataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: [],
      data: []
    }
  }

  async componentDidMount() {

    let resultLayoutInfo = await pageServiceInstance.loadData(this.props?.layout?.proc, this.props?.layout?.args);

    let resultDataInfo = await pageServiceInstance.loadData(this.props?.data?.proc, this.props?.data?.args);

    this.setState({
      layout: resultLayoutInfo,
      data: resultDataInfo
    });

  }

  render() {
    return (
      // <IntlProvider locale={navigator.language}>
      <TableContainer component={Paper}  >
        <Table  size="small" stickyHeader>
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
              this.state?.data &&
              this.state.data.map(
                (row, index) => {
                  return (
                    <TableRow key={index}>
                      {this.state.layout.map((col, colindex) => {
                        return <TableCell className={`tbcell ${col.dmldet_column_alignment}`} key={colindex}>
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
      // </IntlProvider>
    );
  }

  _getFormattedCellValue(row, col) {
    if (col.dmldet_column_type === "datetime") {
      return (
        // <FormattedDate format={} value={} />
        <span>{dyadicFuncExecutor("(dtformat)", row[col.dmldet_column_name], this._getDateFormat(col.dmldet_column_format))}</span>
      );
    }
    if (col.dmldet_column_type === "number") {
      return (
        // <NumberFormat displayType="text" 
        //     value={row[col.dmldet_column_name]} 
        //     format={row[col.dmldet_column_format]}/>
        <span>{dyadicFuncExecutor("(numformat)", row[col.dmldet_column_name], this._getDateFormat(col.dmldet_column_format))}</span>

       );
    }
    else return (row[col.dmldet_column_name]);
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