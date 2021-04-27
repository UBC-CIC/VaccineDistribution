import React, {Component} from 'react'
import {Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NotificationMessage extends Component{

    constructor(props) {
        super(props);
    }
    render(){
        const {notificationOpen,message, type, close} = this.props;
        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={notificationOpen}
            >
                <Alert severity={type} style={{width:"60vw"}}>
                    {message}
                </Alert>
            </Snackbar>
        )
    }
}
export default NotificationMessage;