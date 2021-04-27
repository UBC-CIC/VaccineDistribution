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
/*eslint-disable*/
import React from "react";

// reactstrap components
import {Col, Nav, NavItem, NavLink, Row} from "reactstrap";


var fullDate = new Date();
class Footer extends React.Component {
  render() {
    return (
        <footer className="footer">
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © 2021{" "}
                <a
                    className="font-weight-bold ml-1"
                    href="https://cic.ubc.ca/"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                  UBC CIC
                </a>
              </div>
            </Col>

            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink
                      href="https://cic.ubc.ca/"
                      rel="noopener noreferrer"
                      target="_blank"
                  >
                    About Us
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                      href="https://github.com/UBC-CIC/MCG_VaccineDelivery/blob/mcg-ui/ATTRIBUTIONS.md"
                      rel="noopener noreferrer"
                      target="_blank"
                  >
                    Attributions
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="https://github.com/UBC-CIC/MCG_VaccineDelivery/blob/mcg-ui/LICENSE.md"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    MIT License
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </footer>
    );
  }
}

export default Footer;
