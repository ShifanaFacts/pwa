import React, { Component } from "react";
import PureJSComponentFactory from "../../../Pages/Factory/pureJSComponentFactory";
import { ExecuteLayoutEventMethods, getProcessedArgs } from "../../../../General/commonFunctions";
 

class ListViewCustomTemplate extends Component {
    constructor(props) {
        super(props);
        this.liRef = React.createRef();
        this.state = {
            newStyles: this.resolveStyles(this.props.itemProps, this.props?.itemObject),
            loadDOM: false
        }
    }

    componentWillReceiveProps(nextProps) {
        let nowLoadDOM =  this.isScrolledIntoView(this.liRef.current); 
 
        this.setState({
            newStyles: this.resolveStyles(nextProps?.itemProps, nextProps?.itemObject),
            loadDOM : nowLoadDOM
        });
    }



    resolveStyles(newProps, refData) {
        if (newProps?.style && newProps?.resolvestyles) {
            return getProcessedArgs(newProps?.style, refData);
        }
        return newProps?.style;
    }

    async handleClick() {
        if (this.props.itemProps?.hlclass) {
            let litems = document.getElementsByClassName(this.props.itemProps?.hlclass);
            for (let  i = 0; i < litems.length; i++) {
                litems[i].className = this.props.itemProps?.hlclass;
            }

            this.liRef.current.className = this.props.itemProps?.hlclass + ' list-active';

        }
        await ExecuteLayoutEventMethods(this.props.itemProps?.whenclick, this.props.itemObject);

    }
    // shouldComponentUpdate(nextProps, nextState) { 
    //     if (JSON.stringify(nextProps) === JSON.stringify(this.props)) return false;

    //     return true;
    //   }


    isScrolledIntoView(el) {
        let rect = el.getBoundingClientRect();
        let elemTop = rect.top;
        let elemBottom = rect.bottom;
        let isVisible = (elemTop >= 0 && elemTop <= window.innerHeight) ||
                        (elemBottom >= 0 && elemBottom <= window.innerHeight);
        return isVisible;
    }
   
    componentDidMount() {
        if (this.isScrolledIntoView(this.liRef.current))
            this.setState({ loadDOM: true });
        else 
            this.setState({ loadDOM: false });
    }

    render() {
        let bareBoneStyle = " barebone"
        let scaff = <></>; 
        if(this.state.loadDOM  || (!this.props.lazy)){
            bareBoneStyle = "";
             scaff = new PureJSComponentFactory().scaffoldComponent(this.props.layout, this.props.itemObject);  
        }
            

        return (
            <div ref={this.liRef} {...this.props?.itemProps} className= { (this.props.lazy ? "lvchild "  + bareBoneStyle + " " : "") + (this.props?.itemProps?.className ?? "") }  whenclick={undefined}
                style={this.state.newStyles}
                onClick={this.handleClick.bind(this)} >
                {scaff}
            </div>
        );
    }


}

export default ListViewCustomTemplate; 