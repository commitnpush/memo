import React, { Component}  from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
class Memo extends Component{
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      value: props.data.content
    }

    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
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

  handleChange(e){
    this.setState({
      value: e.target.value
    });
  }
  toggleEdit(){
    if(this.state.editMode){
      let id = this.props.data._id;
      let index = this.props.index;
      let content = this.state.value;
      console.log(id);
      this.props.onEdit(id, index, content).then(()=>{
        this.setState({
          editMode: !this.state.editMode
        });
      });
    }else{
      this.setState({
        editMode: !this.state.editMode
      });
    }
  }

  render(){
    const { data, ownership } = this.props;

    let editInfo = (
      <span style={{color: '#AAB5BC'}}>· Edited <TimeAgo date={data.date.edited} live={true}/></span>
    );

    const dropDownMenu = (
      <div className="option-button">
          <a className='dropdown-button'
               id={`dropdown-button-${data._id}`}
               data-activates={`dropdown-${data._id}`}>
              <i className="material-icons icon-button">more_vert</i>
          </a>
          <ul id={`dropdown-${data._id}`} className='dropdown-content'>
              <li><a onClick={this.toggleEdit}>Edit</a></li>
              <li><a>Remove</a></li>
          </ul>
      </div>
    );
    const memoView = (
      <div className="card">
        <div className="info">
          <a className="username">{data.writer}</a> <TimeAgo date={data.date.created}/>
          {data.is_edited ? editInfo : null}
          {ownership ? dropDownMenu : null}
        </div>
        <div className="card-content">
          {data.content}
        </div>
        <div className="footer">
          <i className="material-icons log-footer star icon-button">star</i>
          <span className="star-count">{data.starred.length}</span>
        </div>
      </div>
    )
    const editView = (
      <div className="write">
        <div className="card">
          <div className="card-content">
            <textarea className="materialize-textarea" value={this.state.value} onChange={this.handleChange}></textarea>
          </div>
          <div className="card-action">
            <a onClick={this.toggleEdit}>OK</a>
          </div>
        </div>
      </div>
    )

    return (
      <div className="container memo">
        {this.state.editMode ? editView : memoView}
      </div>
    )
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool,
  onEdit: PropTypes.func,
  index: PropTypes.number
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
  ownership: true,
  onEdit: (id, index, contents) => {
    console.error('onEdit function is not defined');
  },
  index: -1
}
export default Memo;