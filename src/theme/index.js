import React, {Component} from 'react';
import './assets/css/theme.css'
import Landing from './routes/Landing'
import Shop from './routes/Shop'
import NotFound from './routes/NotFound'
import Footer from './components/Footer'
import LoadingPage from './routes/Loading';
import { connect } from 'react-redux';
import { withRouter, Route, Switch} from 'react-router-dom'
import Loadable from 'react-loadable';
import {TransitionGroup, CSSTransition} from 'react-transition-group'

class Index extends Component {
  
  onTransitionDone = null;
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
    loading: LoadingPage
  });

  handleTransitionLogic = (node, done) => {    
    this.onTransitionDone = done;
    
    this.setState({
      loadingScreen: true
    }, ()=>{
        // Minimum 1s loading screen
        // Check if stuff fetched after 1 sec
        setTimeout(() => {
          const interval = setInterval(() => {
            if(!this.props.isFetchingData){
              this.setState({
                loadingScreen:false
              });
              clearInterval(interval);
            }
          }, 100);
        }, 1000);
    });
  }

  render() {
    if(this.onTransitionDone && !this.state.loadingScreen){
      this.onTransitionDone();
    }

    const { location, loading } = this.props;
    const currentKey = location.pathname.split('/')[1] || '/';

    return (
      <div className={this.state.loadingScreen ? "loading" : ""}>
        <TransitionGroup 
        
        className="page-main">
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
                <Route path="/shop" component={Shop}/>
                <Route path="/not-found" component={NotFound}/>
                <Route component={this.AsyncPage}/>
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
        <Footer/>
        <LoadingPage active={this.state.loadingScreen} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const isFetchingData = Object.keys(state.apiData).some(
    key => state.apiData[key].fetching === true
  ); 

  return{
    isFetchingData: isFetchingData
  }
}

export default withRouter(
  connect(mapStateToProps)(Index)
);