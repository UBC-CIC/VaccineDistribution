import React, {Component} from 'react'
import QrReader from 'react-qr-scanner'

class QRCodeScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100, //How quickly the webcam should refresh its scan
      result: 'Hold QR code stready and clear to scan',
    }
 
    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){
    const previewStyle = {
      height: 700,
      width: 1000,
      display: 'flex',
      justifyContent: "center"
    }
    const camStyle = {
      display: 'flex',
      justifyContent: "center",
      marginTop: '-50px'
    }
    const textStyle = {
      fontSize: '30px',
      textAlign: 'center',
      marginTop: '-50px'
    }
   
 
    return(
      <React.Fragment>
      <div style = {camStyle}>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <p style = {textStyle}>
          {this.state.result}
        </p>
      </div>
      </React.Fragment>
    )
  }
}
export default QRCodeScanner;