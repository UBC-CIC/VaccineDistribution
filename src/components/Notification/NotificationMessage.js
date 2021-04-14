
import React, {Component } from 'react'
import {Snackbar} from "@material-ui/core";

class NotificationMessage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            notificationOpen: true,
        }
    }

    handleClose = () => {
        this.setState({
            notificationOpen: false,
        });

    }

    render(){
        const {notificationOpen,message, type, close} = this.props;
        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={notificationOpen}
                message={message}
            >
            </Snackbar>
        )
    }
}
export default NotificationMessage;