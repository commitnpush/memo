import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
class Search extends Component {
  constructor(props){
    super(props);

    this.state = {
      keyword: ''
    }

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    //LISTEN ESC KEY, CLOSE IF PRESSED

    document.onkeydown = (e) => {
      e = e || window.event;
      if(e.keyCode == 27){
        this.handleClose();
      }
    }
  }

  handleChange(e){
    this.setState({
      keyword: e.target.value
    });
    this.handleSearch(e.target.value);
  }

  handleClose(){
    this.handleSearch('');
    document.onkeydown = null;
    this.props.onClose();
  }

  handleSearch(keyword){
    this.props.onSearch(keyword);
  }

  handleKeyDown(e){
    //IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
    if(e.keyCode === 13){
      if(this.props.usernames.length > 0){
        console.log("history", this.props.history);
        this.props.history.push('/wall/' + this.props.usernames[0].username);
        this.handleClose();
      }
    }
  }
  componentDidMount(){
    console.log('did');
    document.getElementById('search').focus();
  }
  componentDidUpdate(){
    console.log('update');
  }

  render(){
    const mapDataToLinks = (data) => {
      //IMPLEMENT: map data array to array of Link components
      //create Links to '/wall/:username'
      return data.map((user, i) => {
        return <Link className="search-name" key={`${i}`} to={`/wall/${user.username}`} onClick={this.handleClose}>{user.username}</Link>
      });
    }

    return (
      <div className="search-screen white-text">
        <div className="right">
          <a className="waves-effect waves-light btn red lighten-1" onClick={this.handleClose}>CLOSE</a>
        </div>
        <div className="contianer">
          <input id="search" placeholder="Search a user" value={this.state.keyword} onChange={this.handleChange} onKeyDown={this.handleKeyDown} autoComplete="off"/>
          <ul className="search-results">
            {mapDataToLinks(this.props.usernames)}
          </ul>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
  usernames: PropTypes.array
}

Search.defaultProps = {
  onClose: () => console.error('onClose function is not defied'),
  onSearch: () => console.error('onSearch function is not defined'),
  usernames: []
}

export default Search;