import React, { Component } from 'react';
import { DBWysiwyg, fetcher } from 'cude-cms'
import ImageMosaic from '../../../components/ImageMosaic';
import ProductAdder from './productAdder';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Animate} from 'cude-animations';


// // these are relative to the viewport, i.e. the window
// const top = viewportOffset.top;
// const left = viewportOffset.left;
// const height = viewportOffset.height;
// const width = viewportOffset.width;
// const nImg = img.cloneNode(true);

// nImg.style.height=height+'px';
// nImg.style.width=width+'px';
// nImg.style.transform= `translate(${left}px,${top}px)`;
// nImg.style.position= 'fixed';
// nImg.style.top= 0;
// nImg.style.left= 0;
// nImg.classList = ['modal-image'];

// document.body.appendChild(nImg);

// nImg.onclick = () => {
//   nImg.classList.add('fade-out');
//   setTimeout(() => {
//     nImg.parentNode.removeChild(nImg);
//   }, 300);
// }
// const screenWidth = window.innerWidth
//   || document.documentElement.clientWidth
//   || document.body.clientWidth;
// const screenHeight = window.innerHeight
//   || document.documentElement.clientHeight
//   || document.body.clientHeight;

// const dW = Math.min(screenWidth-20, 600)
// const s = dW/width;
// const dX = (screenWidth/2) - ((width)/2) 
// const dY = (screenHeight/2) - ((height)/2) 

// console.log(screenWidth, dX,dY, dW)

// const pToV = (p, s, v) => {
//   const dv = v-s;
//   return p * dv/100 + s;
// }

// const manipulator = (val) => {
//   nImg.style.transform= `translate(${pToV(val, left, dX)}px,${pToV(val, top, dY)}px) scale(${pToV(val, 1, s)}) `;
// }

// var options = {
//   manipulator: manipulator,
//   start: 0,
//   end: 100,
//   duration: 300
// }

// var animation = new Animate(options)
// animation.start()

class Product extends Component {

  zoomImage = (e) => {
    const img = e.target;
    const viewportOffset = img.getBoundingClientRect();
    const top = viewportOffset.top;
    const left = viewportOffset.left;
    const height = viewportOffset.height;
    const width = viewportOffset.width;
    const oX = (e.clientX-left)/width; 
    const oY = (e.clientY-top)/height;

    img.style.transformOrigin = `${oX*100}% ${oY*100}%`

    if(!img.style.transform){
      img.style.transform = `scale(2)`;    
    }else if(img.style.transform === `scale(2)`){
      img.style.transform = `scale(4)`;
      img.classList.add("zoomed");
    }else{
      img.style.transform = '';
      img.classList.remove("zoomed");
    }

  }

  render() {
    const { page, editMode } = this.props;
    const { thumbnail } = this.props.data
    let { stock } = page
    stock = !!stock ? JSON.parse(stock) : [];

    return (
      <div className="product">
        <header className="py-6 lg:py-12 mt-16">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row-reverse">
          
          <div className="lg:w-1/2">
            <div className="fixed-ratio">
            { thumbnail && <img 
              onClick={this.zoomImage}
              className={`object-fit-cover w-full h-full fixed-ratio-content`}
              src={'/uploads/files/'+thumbnail.file.filename}
              alt={thumbnail.alt1}/>
            }
            </div>
          </div>
          <div className="lg:w-1/2 lg:m-0 mt-6 lg:pr-4">
            <ProductAdder 
              editMode={editMode}
              product={
                {
                  ...page,
                  thumbnail: thumbnail,
                  stock: stock
                }
              }
            />
          </div>
          </div>
          </div>
        </header>
        <div className="container mx-auto my-6 lg:my-12">
        <article className="mb-6 sm:mb-24">
          <div className="mb-6 sm:mb-16">
            <ImageMosaic 
            onImgClick={this.zoomImage}
            dbKey={`${page._id}-image-mosaic`} />
          </div>
          <div className="product-description">
            <DBWysiwyg 
              dbKey={`${page._id}-wysiwyg-content`}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              toolbar={{
                fontFamily: {
                  options: ['Pier Sans, sans-serif', "Wash Care Symbols"]
                }
              }}
            />
          </div>

        </article>
        <hr className="mb-6 sm:mb-16 mobile-hide"/>
        </div>
      </div>
    );
  }
}

export default (props)=>{
  const {page} = props;
  return fetcher(Product, `/api/pages/${page._id}`, true)(props);
};