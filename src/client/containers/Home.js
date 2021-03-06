import React, {Component} from 'react';
import { Write, MemoList } from 'components';
import { connect } from 'react-redux';
import { memoPostRequest, 
         memoListRequest, 
         memoEditRequest, 
         memoRemoveRequest,
         memoStarRequest } from 'actions/memo';
import PropTypes from 'prop-types';
class Home extends Component{
  constructor(props){
    super(props);
    this.handlePost = this.handlePost.bind(this);
    this.loadNewMemo = this.loadNewMemo.bind(this);
    this.loadOldMemo = this.loadOldMemo.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleStar = this.handleStar.bind(this);
    this.state = {
      loadingState: false,
      initiallyLoaded: false
    };
  }

  componentDidMount(){
    //LOAD NEW MEMO EVERY 5 SECONDS
    const loadMemoLoop = () => {
      this.loadNewMemo().then(
        () => {
          this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
        }
      );
    };

    const loadUntilScrollable = () => {
      //IF THE SCROLLBAR DEOS NOT EXISTS,
      if($('body').height() < $(window).height()){
        this.loadOldMemo().then(
          () => {
            //DO THIS RECURSIVERLY UNLESS IT'S LAST PAGE
            if(!this.props.isLast){
              loadUntilScrollable();
            }
          }
        );
      }
    }

    this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
      () => {
        //LOAD MEMO UNTIL SCROLLABLE
        setTimeout(loadUntilScrollable, 1000);
        //BEGIN NEW MEMO LOADING LOOP
        loadMemoLoop();

        this.setState({
          initiallyLoaded: true
        });
      }
    )

    $(window).scroll(() => {
      
      // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
      if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
          if(!this.state.loadingState){
              this.loadOldMemo();
              this.setState({
                  loadingState: true
              });
          }
      } else {
          if(this.state.loadingState){
              this.setState({
                  loadingState: false
              });
          }
      }
    });
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.username !== prevProps.username){
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  componentWillUnmount(){
    //STOP THE loadMemoLoop
    clearTimeout(this.memoLoaderTimeoutId);

    $(window).unbind();

    this.setState({
      initiallyLoaded: false
    });
  }

  loadOldMemo(){
    //CANCLE IF USER IS READING THE LAST PAGE
    if(this.props.isLast){
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    //GET ID OF THE AT THE BOTTOM
    let lastId = this.props.data[this.props.data.length - 1]._id;

    //START REQUEST
    return this.props.memoListRequest(false, 'old', lastId, this.props.username).then( () => {
        //IF IT IS LAST PAGE, NOTIFY
        if(this.props.isLast){
          Materialize.toast('You ar reading the last page', 2000);
        }
    });

    
  }

  loadNewMemo(){
    //CANCLE IF THERE IS A PENDING REQUEST
    if(this.props.listStatus === 'WAITING'){
      return new Promise((resolve, reject) =>{
        resolve();
      });
    }

    //IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if(this.props.data.length === 0){
      return this.props.memoListRequest(true, undefined, undefined, this.props.username);
    }


    return this.props.memoListRequest(false, 'new', this.props.data[0]._id, this.props.username);
  }

  /* REMOVE MEMO */
  handleRemove(id, index){
    return this.props.memoRemoveRequest(id, index).then(()=>{
      if(this.props.remove.status === 'SUCCESS'){
        Materialize.toast('Success!', 2000);
      }else{
        /*
          ERROR CODES
              1: INVALID ID
              2: NOT LOGGED IN
              3: NO RESOURCE
              4: PERMISSION FAILURE
        */
       const errorMessage = [
        'Something broke',
        'You are not logged in',
        'That memo does not exist anymore',
        'You do not have permission'
       ]

       let error = this.props.remove.error;

       // NOTIFY ERROR
       let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
       Materialize.toast($toastContent, 2000);
   
       // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
       if(error === 3) {
           setTimeout(()=> {location.reload(false)}, 2000);
       }
      }
    });
  }

  /* EDIT MEMO */
  handleEdit(id, index, content){
    return this.props.memoEditRequest(id, index, content).then(()=>{
      if(this.props.edit.status==="SUCCESS") {
        Materialize.toast('Success!', 2000);
    } else {
        /*
            ERROR CODES
                1: INVALID ID,
                2: EMPTY CONTENT
                3: NOT LOGGED IN
                4: NO RESOURCE
                5: PERMISSION FAILURE
        */
        let errorMessage = [
            'Something broke',
            'Please write soemthing',
            'You are not logged in',
            'That memo does not exist anymore',
            'You do not have permission'
        ];
        
        let error = this.props.edit.error;
        
        // NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
        Materialize.toast($toastContent, 2000);
    
        // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
        if(error === 3) {
            setTimeout(()=> {location.reload(false)}, 2000);
        }
      } 
    })
  }

  /* POST MEMO */
  handlePost(content){
    return this.props.memoPostRequest(content).then(
      () => {
        if(this.props.post.status === 'SUCCESS'){
          //TRIGGER LOAD NEW MEMO
          this.loadNewMemo().then(
            () => {
              Materialize.toast('Success!', 2000);
            }
          );
        }else{
          /*
            ERROR CODES
              1: NOT SIGNED IN
              2: EMPTY CONTENT
          */
         let $toastContent;
         switch(this.props.post.error){
           case 1:
            //IF NOT SIGNED IN, NOTIFY AND REFRESH AFTER
            $toastContent = $('<span style="color: #FFB4BA">You are not signed in</span>');
            Materialize.toast($toastContent, 2000);

            setTimeout(()=>{
              location.reload(false);
            }, 2000);
            break;
          case 2:
            $toastContent = $('<span style="color: #FFB4BA">Please write something </span>');
            break;
          default:
            $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
            break;
         }
         Materialize.toast($toastContent, 2000);
        }
      }
    )
  }

  /* STAR MEMO */
  handleStar(id, index){
    if(!this.props.isSignedIn) return;
    return this.props.memoStarRequest(id, index).then(()=>{
      console.log(this.props.star.status);
      if(this.props.star.status !== 'SUCCESS'){
        /*
          TOGGLE STAR OF MEMO: POST /api/memo/star/:id
          ERROR CODES
            1: INVALID ID
            2: NOT SIGNED IN
            3: NO RESOURCE
        */

        const errorMessage = [
          'Something broke',
          'You are not signed in',
          'That memo does not exist'
        ];

        //NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">'+errorMessage[this.props.star.error -1]+'</span>');
        Materialize.toast($toastContent,2000);
      }
    });
  }

  render(){

    const emptyView = (
      <div className="container">
        <div className="empty-page">
          <b>{this.props.username}</b> isn't registered or hasn't writer any memo
        </div>
      </div>
    )
    const wallHeader = (
      <div>
        <div className="container wall-info">
          <div className="card wall-info blue lighten-2 white-text">
            <div className="card-content">
              {this.props.username}
            </div>
          </div>
        </div>
        {this.props.data.length === 0 && this.state.initiallyLoaded ? emptyView : undefined}
      </div>
    )

    const write = (<Write onPost={this.handlePost}/>);
    return (
      <div className="wrapper">
        {typeof this.props.username !== 'undefined' ? wallHeader : undefined}
        {this.props.isSignedIn && typeof this.props.username === 'undefined' ? write : undefined}
        <MemoList data={this.props.data} currentUser={this.props.currentUser} onEdit={this.handleEdit} onRemove={this.handleRemove} onStar={this.handleStar}/>
      </div>
    )
  }
}

Home.propTypes = {
  username: PropTypes.string
}

Home.defaultProps = {
  username: undefined
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.authentication.status.isSignedIn,
    currentUser: state.authentication.status.currentUser,
    post: state.memo.post,
    data: state.memo.list.data,
    edit: state.memo.edit,
    remove: state.memo.remove,
    star: state.memo.star,
    listStatus: state.memo.list.status,
    isLast:state.memo.list.isLast
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    memoPostRequest: (content) => {
      return dispatch(memoPostRequest(content));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    },
    memoEditRequest: (id, index, content) => {
      return dispatch(memoEditRequest(id, index, content));
    },
    memoRemoveRequest: (id, index) => {
      return dispatch(memoRemoveRequest(id, index));
    },
    memoStarRequest: (id, index) => {
      return dispatch(memoStarRequest(id, index));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);