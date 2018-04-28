import React, { Component } from 'react';
import { DBImage } from 'cude-cms';
import "./index.css"; 

class ImageMosaic extends Component {
  render() {
    return (
      <div className="image-mosaic">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3">
          <div className="w-full">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-1"} />
              </div>
            </div>
            </div>
            <div className="w-full">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-2"} />
              </div>
            </div>
            </div>
          </div>
          <div className="w-full sm:w-2/3">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-3"} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-2/3">
            <div className="fixed-ratio ratio-2">
            <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-4"} />
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-5"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImageMosaic;