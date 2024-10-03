import React, { Component } from 'react';
import { appSWRegistration } from './General/globals';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Icon } from '@mui/material';
import ServiceBase from './Services/_serviceBase';

class AppUpdate extends Component {
    PWA_VERSION_KEY = "FACTS_PWA_VER";
    constructor() {
        super();
        this.state = {
            isChecking: true,
            isInstalling: false,
            open: false,
            serverPWAVersion: "0.0.0",
            noServer: false
        };
    }


    async checkForUpdates() {
        let _serviceBase = new ServiceBase();
        let appOptions = await _serviceBase.loadFromFileURL(`/init.json?ver=${(new Date()).toISOString()}`);

        if (appOptions) {
            this.setState(
                {
                    serverPWAVersion: appOptions?.ver ?? "0.0.0",
                    isChecking: false,
                    noServer: false,
                    isInstalling: false
                }
            );
        }
        else {
            this.setState({
                noServer: true
            });
        }


    }

    render() {
        return (
            <>
                <IconButton color="primary" onClick={() => this.showUpdateDialog()}>
                    <Icon>system_update</Icon>
                </IconButton>
                {this.getUpdateDialog()}
            </>
        );

    }

    async showUpdateDialog() {
        this.setState({
            open: true,
            isChecking: true
        });
        await this.checkForUpdates();

    }
    getUpdateDialog() {
        return (
            <Dialog open={this.state.open}>
                <DialogTitle>FactsBUD-E Update</DialogTitle>
                <DialogContent>
                    {this.getAppStartPage()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { this.setState({ open: false }) }}
                        color="primary" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    getAppStartPage() {
        let msgContent = "No updates available! Please check back later!";
        if (this.state.isChecking)
            msgContent = "Checking updates...";
        if (this.state.noServer)
            msgContent = "Server cannot be contacted! Please check back later!";

        let currentVersion = localStorage.getItem(this.PWA_VERSION_KEY);
        if (!this.state.isChecking &&
         //   window.location.hostname !== 'localhost' &&
            (!currentVersion || currentVersion !== this.state.serverPWAVersion)) {
            return (
                <div className="update-banner">
                    <div className="content">
                        {this.state.isInstalling ?

                            <div className="label">Installing updates... Please wait...</div>
                            :
                            <>
                                <div className="label">New FactsBUD-E Update {this.state.serverPWAVersion} is available!</div>
                                <button className="button" onClick={() => this.updatePWA()}>Install Update</button>
                            </>
                        }
                    </div>
                </div>
            );
        }

        return (
            <div className="update-banner">
                <div className="content">
                    <div className="label">{msgContent}</div>
                </div>
            </div>
        );

    }

    updatePWA() {
        this.setState({
            isInstalling: true
        });
        setTimeout(
            async () => {
                let cacheList = await caches.keys();
                for (let i = 0; i < cacheList.length; i++) {
                    await caches.delete(cacheList[i]);
                }
                // let sw = await navigator.serviceWorker.ready;
                appSWRegistration && await appSWRegistration.unregister();
                localStorage.setItem(this.PWA_VERSION_KEY, this.state.serverPWAVersion)
                localStorage.removeItem("offlay")

                window.location.reload();
            }, 1000
        );


    }


}


export default AppUpdate;