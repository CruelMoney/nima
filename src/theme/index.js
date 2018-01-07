import React, {Component} from 'react';
import Landing from './routes/Landing'
import Footer from './components/Footer'
import Menu from './components/Menu'
import LoadingPage from './routes/Loading';
import Checkout from './routes/Checkout'
import { connect } from 'react-redux';
import * as actions from './actions/theme'
import { withRouter, Route, Switch} from 'react-router-dom'
import Loadable from 'react-loadable';
import {TransitionGroup, CSSTransition} from 'react-transition-group'

class Index extends Component {
  
  state={
    loadingCode : false,
    loadingScreen: false
  }

  AsyncPage = Loadable({
    loader: () => {
      this.setState({
        loadingCode: true
      });
      return (
        import ('./routes/Page'))
        .then((page) =>{
          this.setState({
            loadingCode: false
          });
          return page
      })
    },
    loading: "loading"
  });

  handleTransitionLogic = (node, done) => {
    console.log("transition")

    if(!this.state.loadingScreen){
      this.setState({
        loadingScreen: true
      }, ()=>{
          // Minimum 1s loading screen
          // Check if stuff fetched after 1 sec
          setTimeout(() => {
            const interval = setInterval(() => {
              const {isFetchingData, showLoading} = this.props;
              const { loadingCode } = this.state;
             if(!isFetchingData && !showLoading && !loadingCode){
                this.setState({
                  loadingScreen: false
                });
                clearInterval(interval);
                done && done();
              }
            }, 100);
          }, 600);
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
    const { location, transparentLoading } = this.props;
    const currentKey = location.pathname.split('/')[1] || 'home';
    console.log("state: ", this.state.loadingScreen)

    return (
      <div className={`${currentKey} ${this.state.loadingScreen ? "loading" : ''} page-wrapper`}>
         <LoadingPage 
        transparent={transparentLoading}
        active={this.state.loadingScreen} />
        <Menu />
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
                <Route exact path="/" component={Landing}/>
                <Route path="/checkout" component={Checkout}/>
                <Route component={this.AsyncPage}/>
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
    transparentLoading: state.theme.transparentLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginLoading: () => dispatch(actions.beginLoading()),
    endLoading: () => dispatch(actions.endLoading()),
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Index)
);