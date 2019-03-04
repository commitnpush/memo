import React, { Component}  from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
class Memo extends Component{
  componentDidUpdate(){
    //INITIALIZE DROPDOWN
    $('#dropdown-button-'+this.props.data._id).dropdown({
      belowOrigin: true //Display dropdown below the button
    });
  }
  componentDidMount(){
    $('#dropdown-button-'+this.props.data._id).dropdown({
      belowOrigin: true //Display dropdown below the button
    });
  }
  render(){
    const { data, ownership } = this.props;
    
    const memoView = (
      <div className="card">
        <div className="info">
          <a className="username">{data.writer}</a> <TimeAgo date={data.date.created}/>
          <div className="option-button">
            <a className="dropdown-button" id={`dropdown-button-${data._id}`} data-activates='dropdown-id'>
              <i className="material-icons icon-button">more_vert</i>
            </a>
            <ul id="dropdown-id" className="dropdown-content">
              <li><a>Edit</a></li>
              <li><a>Remove</a></li>
            </ul>
          </div>
          <div className="card-content">
            {data.content}
          </div>
          <div className="footer">
            <i className="material-icons log-footer star icon-button">star</i>
            <span className="star-count">{data.starred.length}</span>
          </div>
        </div>
      </div>
    )

    return (
      <div className="container memo">
        {memoView}
      </div>
    )
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool
}

Memo.defaultProps = {
  data: {
    _id: 'id1234567890',
    writer: 'Writer',
    content: "Contents",
    is_edited: false,
    date: {
      edited: new Date(),
      created: new Date()
    },
    starred: []
  },
  ownership: true
}
export default Memo;