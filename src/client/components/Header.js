import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
class Header extends Component{
  render() {
    const signInButton = (
      <li><Link to="/signin"><i className="material-icons">vpn_key</i></Link></li>
    );
    const signOutButton = (
      <li><a onClick={this.props.onSignOut}><i className="material-icons">lock_open</i></a></li>
    );
    return(
      <nav>
        <div className="nav-wrapper blue darken-1">
          <Link to="/" className="brand-logo center">MEMOPAD</Link>

          <ul>
            <li><a><i className="material-icons">search</i></a></li>
          </ul>

          <div className="right">
            <ul>
              {this.props.isSignedIn ? signOutButton : signInButton}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  isSignedIn: PropTypes.bool,
  onSignOut: PropTypes.func
}
Header.defaultProps = {
  isSignedIn: false,
  onSignOut: () => console.error("signout function is not defined")
}

export default Header;