import React, { Component } from 'react';
import Dropdown from '../../components/Dropdown';
import Modal from 'react-responsive-modal';
import ProductVariants from "../../components/ProductVariants";
export default class ActionDropdown extends Component {
  state={
    modal:{
      variants:false
    }
  }

  openModal = (val) => {
    this.setState({
      modal:{
        ...this.state.modal,
        [val]: true
      }
    });
  }
  closeModal = (val) => {
    this.setState({
      modal:{
        ...this.state.modal,
        [val]: false
      }
    });
  }

  render() {
    const {product} = this.props;
    const {modal} = this.state;

    return (
      
      <Dropdown>
          <ul className="action-dropdown">
            <li 
             onClick={()=>this.openModal('variants')}>
              Variants and stock
            </li>
            <li>
              <a target={'_blank'} href={product.slug}>See product</a>
            </li>
          </ul>
          <Modal 
          classNames={{
            modal: 'modal variants-editor',
            overlay: 'modal-background'
          }}
          open={modal.variants}
          onClose={()=>this.closeModal('variants')} 
          center>
            <ProductVariants
              closePopup={()=>this.closeModal('variants')} 
              product={product}
            />
          </Modal>
       </Dropdown>
    )
  }
};
