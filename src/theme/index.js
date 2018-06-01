import React, {Component, Fragment} from 'react';
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
import NewsletterSignup from './components/Footer/NewsletterSignup';

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
    const x = window.matchMedia("(max-width: 462px)")

    if(!x.matches && !this.state.loadingScreen){
      this.setState({
        loadingScreen: true
      }, ()=>{
          // Minimum 600ms loading screen
          setTimeout(() => {
            window.scrollTo(0, 0)
            if (!this.fininshAnimationIfDone(done)){
              const interval = setInterval(() => { // Check if stuff fetched each 2000ms
                this.fininshAnimationIfDone(done) && clearInterval(interval);
              }, 2000);
            }
          }, 800);
      });
    }else{
      window.scrollTo(0, 0);
      done();
    }
  }

  componentWillReceiveProps(nextprops){
    const {showLoading} = nextprops;
    const x = window.matchMedia("(max-width: 462px)")
    if(!x.matches && showLoading && !this.state.loadingScreen){
      this.handleTransitionLogic();
    }
  }



  render() {
    const { location, transparentLoading, loadingText, showLoading, showNewsletterActive} = this.props;
    const currentKey = location.pathname.split('/')[1] || 'home';

    return (
      <Fragment>
      <div className={`
      ${currentKey} 
      ${this.state.loadingScreen ? "loading" : ''} 
      ${showNewsletterActive ? "show-newsletter" : ''} 
      page-wrapper`}
      onClick={() => showNewsletterActive && this.props.hideNewsletter()}
      > 
        <div id="dark-overlay"></div>
         <LoadingPage 
          text={showLoading ? loadingText : "nimacph."}
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
                <Route path="/checkout" component={(Checkout)}/>
                <Route component={withTracker(Page)}/>
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
        <Footer
          showNewsletterActive={showNewsletterActive}
          showNewsletter={this.props.showNewsletter}
          hideNewsletter={this.props.hideNewsletter}
        />
      </div>
      <NewsletterSignup 
         hideNewsletter={this.props.hideNewsletter}
      />

      </Fragment>
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
    loadingText: state.theme.loadingText,
    showNewsletterActive: state.theme.showNewsletter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginLoading: () => dispatch(actions.beginLoading()),
    endLoading: () => dispatch(actions.endLoading()),
    showNewsletter: () => dispatch(actions.showNewsletter()),
    hideNewsletter: () => dispatch(actions.hideNewsletter())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    Index
  )
);