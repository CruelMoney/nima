import React, { Component } from 'react';
import { DBWysiwyg, fetcher } from 'cude-cms'
import ButtonOptions from '../../../components/Options';
import ImageMosaic from '../../../components/ImageMosaic';
import './index.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Product extends Component {
  render() {
    const { page } = this.props;
    const { thumbnail } = this.props.data
    return (
      <div className="product">
        <header className="py-12 mt-16">
        <div className="container mx-auto">
          <div className="flex">
          <div className="w-1/2">
            <h1>
            {page.title}
            </h1>
            <p>
              {page.description}
            </p>
            <p>
              Price: { page.price } DKK
            </p>
            <ButtonOptions
              editMode={true}
              options={
                [
                  {label: "XS", value: "extra small", disabled: false},
                  {label: "S", value: "small", disabled: false},
                  {label: "M", value: "medium", disabled: false},
                  {label: "L", value: "large", disabled: false},
                  {label: "XL", value: "extra large", disabled: true}
                ]}
            />
            <button className={"bg-transparent border hover:border-transparent hover:text-white font-bold py-4 px-12 mt-6"}>
              ADD TO BAG
            </button>
          </div>
          <div className="w-1/2">
            <div className="fixed-ratio">
            { thumbnail && <img 
              className={`object-fit-cover w-full h-full`}
              src={'/uploads/files/'+thumbnail.file.filename}
              alt={thumbnail.alt1}/>
            }
            </div>
            </div>
          </div>
          </div>
        </header>
        <div className="container mx-auto  mt-16">
        <article className="mb-16">
          <div className="mb-16">
            <ImageMosaic dbKey={`${page.slug}-image-mosaic`} />
          </div>
          <DBWysiwyg 
            dbKey={`${page.slug}-wysiwyg-content`}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
        </article>
        </div>
      </div>
    );
  }
}

export default (props)=>{
  const {page} = props;
  return fetcher(Product, `/api/pages/${page._id}`, true)(props);
};