import React, { Component } from 'react';
import { DBImage } from 'cude-cms';

class ImageMosaic extends Component {
  render() {
    return (
      <div className="image-mosaic">
        <div className="flex">
          <div className="w-1/3">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-1"} />
              </div>
            </div>
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-2"} />
              </div>
            </div>
          </div>
          <div className="w-2/3">
            <div className="fixed-ratio">
              <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-3"} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-2/3">
            <div className="fixed-ratio ratio-2">
            <div className="fixed-ratio-content">
              <DBImage dbKey={this.props.dbKey+"-4"} />
              </div>
            </div>
          </div>
          <div className="w-1/3">
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