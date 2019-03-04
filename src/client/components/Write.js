import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Write extends Component{
  constructor(props){
    super(props);
    this.state = {
      content: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleChange(e){
    this.setState({
      content: e.target.value
    });
  }

  handlePost(){
    let content = this.state.content;
    this.props.onPost(content).then(
      () => {
        console.log('here');
        this.setState({
          content: ''
        });
      }
    );
  }

  render(){
    return (
      <div className="container write">
          <div className="card">
              <div className="card-content">
                  <textarea className="materialize-textarea" placeholder="Write down your memo" onChange={this.handleChange} value={this.state.content}></textarea>
              </div>
              <div className="card-action">
                  <a onClick={this.handlePost}>POST</a>
              </div>
          </div>
      </div>
    );
  }
}

Write.propType = {
  onPost: PropTypes.func
}

Write.defaultProp = {
  onPost: (content) => {
    console.error('post function not defined');
  }
}

export default Write;