import React, { Component } from "react";
// import store from "../../../AppRedux/store";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData, getProcessedDynamic } from "../../../General/commonFunctions";
import LayoutManipulator from "../../../General/layoutManipulator";
import { ownStore } from "../../../AppOwnState/ownState";
import PureJSDesignerFactory from "../../Pages/Factory/pureJSDesignerFactory";
import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";


class FactsRenderer extends Component {
    constructor(props) {
        super(props);
        let newLY = this.getCurrentLayout();

        let _propsRedux = null;
        if (props.appendprops) _propsRedux = getProcessedDynamic(props.appendprops);
        let scaff = null;
        if (_propsRedux?.renderer === "real")
            scaff = new PureJSComponentFactory().scaffoldComponent(newLY, this.props.refData);
        else {
            let neutralLY = new LayoutManipulator().neutralize(newLY, this.props.layout.replace("[", "").replace("]", ""));
            scaff = new PureJSDesignerFactory().scaffoldComponent(neutralLY, this.props.refData);
        }
        this.state = {
            currentLY: newLY,
            scaff: scaff,
            propsRedux: _propsRedux
        };
    }
    getCurrentLayout() {
        let layt = GetControlPropertyFromStoreOrRefData(this.props.layout);
        return layt;
    }

    async runAction(e, eventToRun) {
        if (e.target.closest(".c-render")) {
            e.stopPropagation();
            e.preventDefault();
            document.querySelectorAll("[data-ctr-class=dz-ctr]").forEach(t => {
                t.classList.remove("dz-active");
            });
            let validElement = e.target;
            if (e.target.getAttribute("data-ctr-class") !== "dz-ctr") {
                validElement = validElement.closest("[data-ctr-class=dz-ctr]");
            }
            if (validElement.getAttribute("data-ctr-class") === "dz-ctr") {
                validElement.classList.add("dz-active");
                let dataCtrPath = validElement.getAttribute("data-ctr-path");
                let dataCtrChild = validElement.getAttribute("data-ctr-child");
                let desProps = {
                    "path": dataCtrPath,
                    "name": validElement.getAttribute("data-ctr-title"),
                    "child": dataCtrPath + (dataCtrChild ? ("." + dataCtrChild) : "")
                };

                await ExecuteLayoutEventMethods(eventToRun, desProps);
            }
        }
    }
    renderBoxEvents = () => {
        let renderDIV = document.querySelector(".c-render");
        if (renderDIV) {
            renderDIV.onclick = async (e) => this.runAction(e, this.props?.whenclick);
            document.onkeyup = async (e) => {
                if (this.props?.eventkeys?.includes(e.key) || !this.props?.eventkeys)
                    ExecuteLayoutEventMethods(this.props?.whendocumentkeyup);
            }
            renderDIV.ondragover = async (e) => e.preventDefault();
            renderDIV.ondrop = async (e) => this.runAction(e, this.props?.whendrop);
        }
    }

    // whenRenderBoxDragDrop = () => {
    //     let renderDIV = document.querySelector(".c-render");
    //     if (renderDIV) {
    //         renderDIV.ondragover = async (e) => {
    //             e.preventDefault();
    //         };

    //         renderDIV.ondrop = async (e) =>
    //             this.runAction(e, this.props?.whendrop);
    //     }
    // }

    componentDidMount() {
        // document.querySelector(".dz-control").ondrag = (e) =>{
        //     e.dataTransfer.setData("text", e.target.id);
        // }; 

        this.renderBoxEvents();
        // this.whenRenderBoxDragDrop();

        this.mounted = true;

        if (this.props.layout) {
            // this.setState({
            //     currentDS: this.getCurrentDataSet()
            // });
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.mounted) {

                    let newLY = this.getCurrentLayout();
                    // let newLYString = JSON.stringify(newLY),
                    //     currentLYString = JSON.stringify(this.state.currentLY);
                    let newPropState = getProcessedDynamic(this.props.appendprops);
                    // if (newLYString !== currentLYString) {

                    // let scaff = new PureJSDesignerFactory().scaffoldComponent(neutralLY, this.props.refData);
                    let scaff = null;
                    if (newPropState?.renderer === "real")
                        scaff = new PureJSComponentFactory().scaffoldComponent(newLY, this.props.refData);
                    else {
                        let neutralLY = new LayoutManipulator().neutralize(newLY, this.props.layout.replace("[", "").replace("]", ""));
                        scaff = new PureJSDesignerFactory().scaffoldComponent(neutralLY, this.props.refData);
                    }
                    this.setState({
                        currentLY: newLY,
                        scaff: scaff
                    });

                    // }


                    if (JSON.stringify(this.state.propsRedux) !== JSON.stringify(newPropState)) {
                        this.setState({
                            propsRedux: newPropState
                        });
                    }
                }
            });
        }

    }

    componentWillUnmount() {
        document.onkeyup = undefined;
        this.mounted = false;
        if (this.unsubscribe) this.unsubscribe();
    }


    render() {
        return (<div className={this.props.className} type="page" data-ctr-title="page"
            data-ctr-class="dz-ctr"
            data-ctr-child="" data-ctr-path="dsLayout.layout"  {...this.state.propsRedux} >
            {this.state.scaff}
        </div>
        );
    }
}

export default FactsRenderer; 