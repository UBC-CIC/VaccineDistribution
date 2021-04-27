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
import Header from "../components/Headers/Header";
import ProductTable from "../components/Tables/ProductTable";

//Amplify.configure(awsExports)


class ViewProduct extends Component {

    render() {
        return (
            <>
                <Header title={"Products"}/>
                {/* Page content */}
                    <ProductTable/>
            </>
        );
    }
}

export default (ViewProduct) ;