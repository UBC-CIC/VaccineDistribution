/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Component} from 'react'
//import awsExports from "../../aws-exports";
// reactstrap components
// core components
import GeneralHeader from "../../components/Headers/GeneralHeader";
import ContainerStatusTable from "../../components/Tables/ContainerStatusTable";

//Amplify.configure(awsExports)



class ViewContainerStatus extends Component {


  render() {
    return (
      <>
        <GeneralHeader title={"View Container Status"} />
        {/* Page content */}
        <ContainerStatusTable/>

      </>
    );
  }
}

export default (ViewContainerStatus) ;
