import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Memo } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
class MemoList extends Component{
  shouldComponentUpdate(nextProps, nextState){
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }
  render() {
    const mapToComponents = data => {
      return data.map((memo, i) => {
        return (
          <Memo data={memo} ownership={(memo.writer === this.props.currentUser)} key={memo._id} index={i} onEdit={this.props.onEdit} onRemove={this.props.onRemove} onStar={this.props.onStar} currentUser={this.props.currentUser}/>
        );
      });
    }
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="memo" 
                                transitionEnterTimeout={2000}
                                transitionLeaveTimeout={1000}>
          {mapToComponents(this.props.data)}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

MemoList.propTypes = {
  data: PropTypes.array,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onStar: PropTypes.func,

}

MemoList.defaultProps = {
  data: [],
  currentUser: '',
  onEdit: (id, index, content) => {
    console.error('edit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  },
  onStar: (id, index) => {
    console.error('star function not defined');
  },
}



export default MemoList