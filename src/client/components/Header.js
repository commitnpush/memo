import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Search} from 'components';
import { connect } from 'react-redux';
import { searchRequest } from 'actions/search';

class Header extends Component{
  constructor(props){
    super(props);

    /* IMPREMENT: CREATE A SEARCH STATUS */
    this.state = {
      search: false
    }
    this.toggleSearch = this.toggleSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  /* IMPREMENT : CREATE toggleSearch METHOD THAT TOGGLES THE SEARCH STATE */
  toggleSearch(){
    this.setState({
      search: !this.state.search
    })
  }

  handleSearch(username){
    this.props.searchRequest(username)
    .then(()=>{
      if(this.props.search.status !== 'SUCCESS'){
        $toastContent = $("<span style='color:#FFB4BA>Something Broken</span>");
        Materialize.toast($toastContent, 2000);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    let current = {
      props: this.props,
      state: this.state
    };

    let next = {
      props: nextProps,
      state: nextState
    }
    if(JSON.stringify(this.state) !== JSON.stringify(nextState)) return true;
    return nextProps.search.status !== 'WAITING';
    
    
  }

  render() {
    const signInButton = (
      <li><Link to="/signin"><i className="material-icons">vpn_key</i></Link></li>
    );
    const signOutButton = (
      <li><a onClick={this.props.onSignOut}><i className="material-icons">lock_open</i></a></li>
    );
    return(
      <div>
        <nav>
          <div className="nav-wrapper blue darken-1">
            <Link to="/" className="brand-logo center">MEMOPAD</Link>

            <ul>
              <li><a><i className="material-icons" onClick={this.toggleSearch}>search</i></a></li>
            </ul>

            <div className="right">
              <ul>
                {this.props.isSignedIn ? signOutButton : signInButton}
              </ul>
            </div>
          </div>
        </nav>
        <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {this.state.search ? (<Search onClose={this.toggleSearch} onSearch={this.handleSearch} usernames={this.props.search.usernames} history={this.props.history}/>): undefined}
        </ReactCSSTransitionGroup>
      </div>
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

const mapStateToProps = (state) => {
  return {
    search: state.search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchRequest: (username) => {
      return dispatch(searchRequest(username));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);