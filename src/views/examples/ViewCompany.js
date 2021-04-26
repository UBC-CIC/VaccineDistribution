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
import {Container} from "reactstrap";
// core components
import CompanyTable from "components/Tables/CompanyTable.js";
import GeneralHeader from "../../components/Headers/GeneralHeader";

//Amplify.configure(awsExports)




class Tables extends Component {

  render() {
    return (
      <>
        <GeneralHeader title={"View Companies"}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <CompanyTable/>

        </Container>
      </>
    );
  }
}

export default (Tables) ;