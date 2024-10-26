import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
// import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from 'react-i18next';

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader
} from "../../store/actions";
import withRouter from "../Common/withRouter";

class SidebarContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pathName: this.props.router.location.pathname,
    };

  }

  componentDidMount() {
    this.initMenu();
  }

  UNSAFE_componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {

        if (this.props.type !== prevProps.type) {
            this.initMenu();
        }

    }
    if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
      this.setState({ pathName: this.props.router.location.pathname }, () => {
        this.initMenu();
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");
    const { pathName } = this.state;


    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">

          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{this.props.t('Menu')}</li> */}

            <li className="li-hover">
              <Link to="/auth/dashboard" className="waves-effect">
                <i class="ph-bold ph-house"></i>
                <span className="ms-1">{this.props.t('Dashboard')}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i class="ph-bold ph-package"></i>
                <span className="ms-1">{this.props.t('Products')}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/products/all-products">{this.props.t('Products')}</Link></li>
                <li><Link to="/products/add-products">{this.props.t('Add Product')}</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i class="ph-bold ph-barcode"></i>
                <span className="ms-1">{this.props.t('Warranty')}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/products/all-warranties">{this.props.t('All Warranty Customer')}</Link></li>
                <li><Link to="/warranty/all-warranties-list">{this.props.t('All Warranty')}</Link></li>
                <li><Link to="/warranty/add-product-warranty">{this.props.t('Add Warranty Customer')}</Link></li>
                <li><Link to="/warranty/add-warranty">{this.props.t('Add Warranty')}</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i class="ph-bold ph-siren"></i>
                <span className="ms-1">{this.props.t('Complaints')}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/complaints/all-complaints">{this.props.t('All Complaints')}</Link></li>
                <li><Link to="/ecommerce-add-product">{this.props.t('Add New Complaint')}</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i class="ph-bold ph-user"></i>
                <span className="ms-1">{this.props.t('Users')}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/users/all-customers">{this.props.t('All Customer')}</Link></li>
                <li><Link to="/users/all-users">{this.props.t('All Users')}</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i class="ph-bold ph-briefcase"></i>
                <span className="ms-1">{this.props.t('Roles')}</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/roles/all-roles">{this.props.t('All Roles')}</Link></li>
                <li><Link to="/roles/add-roles">{this.props.t('Add Roles')}</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/auth/dashboard" className="waves-effect">
                <i class="ph-bold ph-gear"></i>
                <span className="ms-1">{this.props.t('Settings')}</span>
              </Link>
            </li>

          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return { ...state.Layout };
};

export default withRouter(connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  changePreloader
})(withTranslation()(SidebarContent)));
