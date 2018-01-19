import React, {Component} from 'react';
import Landing from './routes/Landing'
import Footer from './components/Footer'
import Menu from './components/Menu'
import LoadingPage from './routes/Loading';
import Checkout from './routes/Checkout'
import { connect } from 'react-redux';
import * as actions from './actions/theme'
import { withRouter, Route, Switch} from 'react-router-dom'
//import Loadable from 'react-loadable';
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import Page from './routes/Page';
import withTracker from './utils/withTracker';

class Index extends Component {
  
  state={
    loadingCode : false,
    loadingScreen: false
  }

  componentWillMount(){
    // Initialize google analytics

  }
  
  // AsyncPage = Loadable({
  //   loader: () => {
  //     this.setState({
  //       loadingCode: true
  //     });
  //     return (
  //       import ('./routes/Page'))
  //       .then((page) =>{
  //         this.setState({
  //           loadingCode: false
  //         });
  //         return page
  //     })
  //   },
  //   loading: LoadingComponent
  // });

  fininshAnimationIfDone = (cb) => {
    const {isFetchingData, showLoading} = this.props;
    const { loadingCode } = this.state;
    if(!isFetchingData && !showLoading && !loadingCode){
      this.setState({
        loadingScreen: false
      });
      cb && cb();
      return true;
    }
    return false;
  }

  handleTransitionLogic = (node, done) => {
    if(!this.state.loadingScreen){
      this.setState({
        loadingScreen: true
      }, ()=>{
          // Minimum 600ms loading screen
          setTimeout(() => {
            if (!this.fininshAnimationIfDone(done)){
              const interval = setInterval(() => { // Check if stuff fetched each 2000ms
                this.fininshAnimationIfDone(done) && clearInterval(interval);
              }, 2000);
            }
          }, 800);
      });
    }
  }

  componentWillReceiveProps(nextprops){
    const {showLoading} = nextprops;
    if(showLoading && !this.state.loadingScreen){
      this.handleTransitionLogic();
    }
  }

  render() {
    const { location, transparentLoading, loadingText, showLoading} = this.props;
    const currentKey = location.pathname.split('/')[1] || 'home';

    return (
      <div className={`${currentKey} ${this.state.loadingScreen ? "loading" : ''} page-wrapper`}>
         <LoadingPage 
          text={showLoading ? loadingText : "NIMA COPENHAGEN"}
          transparent={showLoading && transparentLoading}
          active={this.state.loadingScreen} />
        <Menu indicateActive />
        <TransitionGroup 
          component={'main'}
        >
          <CSSTransition 
          key={currentKey} 
          addEndListener={this.handleTransitionLogic}
          classNames={{
            appear: 'my-appear',
            appearActive: 'my-active-appear',
            enter: 'my-enter',
            enterActive: 'my-active-enter',
            exit: 'my-exit',
            exitActive: 'my-active-exit',
           }}
          >
            <section className="transition-page my-active-enter">
              <Switch location={location}>
                <Route exact path="/" component={withTracker(Landing)}/>
                <Route path="/checkout" component={withTracker(Checkout)}/>
                <Route component={withTracker(Page)}/>
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const isFetchingData = Object.keys(state.apiData).some(
    key => state.apiData[key].fetching === true
  ); 

  return{
    isFetchingData: isFetchingData,
    showLoading: state.theme.loading,
    transparentLoading: state.theme.transparentLoading,
    loadingText: state.theme.loadingText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginLoading: () => dispatch(actions.beginLoading()),
    endLoading: () => dispatch(actions.endLoading()),
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    Index
  )
);