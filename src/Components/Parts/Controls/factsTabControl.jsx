import React, { Component } from 'react'; 
import { Tab, Tabs, Box } from "@mui/material";
import { dsFiller, getProcessedDynamic } from '../../../General/commonFunctions';
import PureJSComponentFactory from '../../Pages/Factory/pureJSComponentFactory';
 

class FactsTabControl extends Component {
    constructor(props){
        super(props); 
        this.tabData =props?.data?.map(t=>{
            let singleTabProps = getProcessedDynamic( this.props.content, t); 
            return singleTabProps; 
        });  

        this.state = {
            tabIndex: 0,
            currentTabData: null
        }; 
    }

    async componentDidMount(){
        let curTabData = null; 
        if(this.tabData?.length > 0 ){
            curTabData =  this.tabData[0]; 
            await this.fillLayoutData(curTabData); 
            this.setState({currentTabData : curTabData });
        }
    }

    fillLayoutData =async (curTabData) => {
        if(!curTabData.chld && curTabData?.layout?.doctype && curTabData?.layout?.docno){  
            let sServerDataSet = await dsFiller({
                args : {
                    proc : "PWA.LoadLayout", 
                     args : {
                        doctype: curTabData.layout?.doctype,    
                        docno: curTabData.layout?.docno    
                    }
                }
            });
            if(sServerDataSet.length > 0 && sServerDataSet[0]?.layoutinfo){ 
                let layoutParsed = JSON.parse(sServerDataSet[0].layoutinfo); 
                curTabData.chld = layoutParsed?.layout ?? layoutParsed;
            }
        }
    }

    handlTabChange = async (event, newValue) =>{
        let curTabData = null; 
        if(this.tabData?.length > newValue){ 
            curTabData =  this.tabData[newValue]; 
            await this.fillLayoutData(curTabData); 
            this.setState({
                tabIndex : newValue,
                currentTabData: curTabData
            }); 
        }
    }

    render() {
        let scaff = new PureJSComponentFactory().scaffoldComponent(this.state.currentTabData?.chld);
         return (
            <div className="factsTabControl">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs  value={this.state.tabIndex} onChange={this.handlTabChange} label="basic tabs example">
                    {this.tabData?.map((t, i)=>{
                        let {buttonProps} = t; 
                       return <Tab key={i} style={{textTransform:"none", fontWeight: "bold"}} {...buttonProps} />; 
                    })}
                </Tabs>
            </Box>
            <div className='muiTabContent' style={{border:"1px solid gainsboro", padding: "10px"}}>
                {scaff}
            </div>
          </div>
        );
    }
}

export default FactsTabControl; 