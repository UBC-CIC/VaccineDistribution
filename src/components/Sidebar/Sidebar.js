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
import {Link, NavLink as NavLinkRRD} from "react-router-dom";
// nodejs library to set properties for components
import {PropTypes} from "prop-types";

// reactstrap components
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
  UncontrolledDropdown
} from "reactstrap";
import {adminRoutes, createRoutes, routes, superAdminRoutes, viewRoutes} from "../../routes"
import {Auth} from "aws-amplify";

var ps;

class Sidebar extends React.Component {
  state = {
    collapseOpen: false
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };
  async signOut() {
    try {
      await Auth.signOut();
      window.location.reload()
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  // creates the links that appear in the left menu / Sidebar
  createLinks = routes => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };
  render() {
    const { bgColor, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}
          {logo ? (
            <NavbarBrand className="pt-0" {...navbarBrandProps}>
               {/*
               {
               <img
                alt={logo.imgAlt} Insert your own logo here
                className="navbar-brand-img"
                src={logo.imgSrc}
              /> }
               */}
               <div>Vaccine Distribution</div>
            </NavbarBrand>
          ) : null}
          <Nav className="align-items-center d-md-none">
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("assets/img/theme/blank-profile.png")}
                    />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="user-profile">
                  <i className="fas fa-user text-blue" />
                  View Profile
                </DropdownItem>

                <DropdownItem onClick={this.signOut}>
                  <i className="fas fa-sign-out-alt text-red"/>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={this.state.collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={this.toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Navigation */}
            <hr className="my-3" />
            <h6 className="navbar-heading text-green" >Home</h6>
            <Nav navbar>
              {this.createLinks(routes)}
            </Nav>

            <hr className="my-3" />
            <h6 className="navbar-heading text-muted text-red ">Creation</h6>
            <Nav navbar>
            {this.createLinks(createRoutes)}
            </Nav>
            <hr className="my-3" />
            <h6 className="navbar-heading text-primary">Views</h6>
            <Nav navbar>
              {this.createLinks(viewRoutes)}
            </Nav>
            <hr className="my-3"/>
            <div>
              {(() => {
                if (this.props.isSuperAdmin) {
                  return (
                      <div>
                      <h6 className="navbar-heading text-green">Admin</h6>
                        <Nav navbar>
                          {this.createLinks(superAdminRoutes)}
                        </Nav>
                      </div>
                  )
                }else if(this.props.isAdmin){
                  return (
                      <div>
                        <h6 className="navbar-heading text-green">Admin</h6>
                        <Nav navbar>
                          {this.createLinks(adminRoutes)}
                        </Nav>
                      </div>
                  )
                } else {
                  return (
                      <div/>
                  )
                }
              })()}
            </div>
          </Collapse>
        </Container>
      </Navbar>

    );
  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;
