import React, { Component } from 'react';
import { DBWysiwyg, fetcher } from 'cude-cms'
import ImageMosaic from '../../../components/ImageMosaic';
import ProductAdder from './productAdder';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Product extends Component {
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
            <ImageMosaic dbKey={`${page._id}-image-mosaic`} />
          </div>
          <div className="product-description">
            <DBWysiwyg 
              dbKey={`${page._id}-wysiwyg-content`}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              toolbar={{
                fontFamily: {
                  options: ['Pier Sans', "Wash Care Symbols"]
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