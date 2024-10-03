import React, { PureComponent } from "react";
import { Grid, Badge, IconButton } from "@mui/material";
import Icon from '@mui/material/Icon';
import { ExecuteLayoutEventMethods } from "../../../../General/commonFunctions";

class ListViewTaskTemplate extends PureComponent {

    render() {
        return (<div className="swplist content">
            <div className={'handle ' + this.props.itemObject.highlightto}></div>
            <div className="box">
                <div className="header">


                    <div class="top-content">
                        <div className="code">{this.props.itemObject.code}</div>
                        <div className="title">{this.props.itemObject.title}</div>
                        </div>
                    <div className="top-buttons" >
                        {this.props.itemProps?.buttons.map((bt, index) => {
                            return (
                                this.getButton(index, bt.hasbadge, bt.badgefield, bt.icon, bt.iconprops, bt.badgeprops, bt.props)
                            );
                        })}
                    </div>
                </div>

                <div className="subtitle">{this.props.itemObject.subtitle}</div>
                <div className="excerpt"></div>

                <Grid container className="footer" >
                    <Grid container item xs={12} md={3} spacing={2}>
                        <Grid item md='auto' xs={5}>{this.props.itemObject.footer1label}</Grid>
                        <Grid item md='auto' xs={7}><strong>{this.props.itemObject.footer1value}</strong></Grid>
                    </Grid>
                    <Grid container item xs={12} md={3} spacing={2}>
                        <Grid item md='auto' xs={5}>{this.props.itemObject.footer2label}</Grid>
                        <Grid item md='auto' xs={7}><strong>{this.props.itemObject.footer2value}</strong></Grid>
                    </Grid>
                    <Grid container item xs={12} md={3} spacing={2}>
                        <Grid item md='auto' xs={5}>{this.props.itemObject.footer3label}</Grid>
                        <Grid item md='auto' xs={7}><strong>{this.props.itemObject.footer3value}</strong></Grid>
                    </Grid>
                    <Grid container item xs={12} md={3} spacing={2}>
                        <Grid item md='auto' xs={5}>{this.props.itemObject.footer4label}</Grid>
                        <Grid item md='auto' xs={7}><strong>{this.props.itemObject.footer4value}</strong></Grid>
                    </Grid>
                </Grid>
            </div>
        </div>);
    }

    getButton(key, hasBadge, badgeField, icon, iconProps, badgeProps, buttonProps) {
        if (hasBadge) {
            return (
                <IconButton key={key} size="medium" onClick={() => this.handleIconClick(buttonProps?.whenclick)}>
                    <Badge badgeContent={this.props.itemObject[badgeField]} {...badgeProps} >
                        <Icon className="icon" {...iconProps}>{icon}</Icon>
                    </Badge>
                </IconButton>
            );
        }
        else {
            return (
                <IconButton key={key} size="medium" className="quick-buttons" onClick={() => this.handleIconClick(buttonProps?.whenclick)} >
                    <Icon className="icon"   {...iconProps}>{icon}</Icon>
                </IconButton>
            );
        }
    }

    async handleIconClick(whenClick) {
        await ExecuteLayoutEventMethods(whenClick, this.props.itemObject);

    }
}

export default ListViewTaskTemplate;