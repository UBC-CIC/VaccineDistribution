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
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import createContainerComponent from "views/createContainerComponent";
import CreateCompany from "views/examples/CreateCompany";
import CreateVaccine from "views/examples/CreateVaccine";
import CreateContainer from "views/examples/CreateContainer";


import ViewCompany from "views/examples/ViewCompany";
import ViewContainer from "views/examples/ViewContainer";
import ViewVaccine from "views/examples/ViewVaccine";


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Containers",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/CreateCompany",
    name: "Create Company",
    icon: "ni ni-fat-add text-primary",
    component: CreateCompany,
    layout: "/admin"
  },
  /*
  {
    path: "/createContainer",
    name: "Create Container",
    icon: "ni ni-fat-add text-primary",
    component: createContainerComponent,
    layout: "/admin"
  },
  */

 {
  path: "/CreateContainer",
  name: "Create Container",
  icon: "ni ni-fat-add text-primary",
  component: CreateContainer,
  layout: "/admin"
},

  {
    path: "/CreateVaccine",
    name: "Create Vaccine",
    icon: "ni ni-fat-add text-primary",
    component: CreateVaccine,
    layout: "/admin"
  },
  
  {
    path: "/ViewCompany",
    name: "View Company",
    icon: "ni ni-tv-2 text-blue",
    component: ViewCompany,
    layout: "/admin"
  },
  {
    path: "/ViewContainer",
    name: "View Container",
    icon: "ni ni-tv-2 text-blue",
    component: ViewContainer,
    layout: "/admin"
  },
  {
    path: "/ViewVaccine",
    name: "View Vaccine",
    icon: "ni ni-tv-2 text-blue",
    component: ViewVaccine,
    layout: "/admin"
  },
 

  {/*
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
*/},
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
  {/*
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
  */}
];
export default routes;
