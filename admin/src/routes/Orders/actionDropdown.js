import React, { Component } from 'react';
import Dropdown from '../../components/Dropdown';
import Modal from 'react-responsive-modal';
import RefundForm from '../../components/RefundForm';

export default class ActionDropdown extends Component {
  state={
    modal:{
      refund:false,
      contact:false
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

  confirmOrder = async () => { 
    const {order} = this.props;
    return await fetch('http://0.0.0.0:3001/api/confirm', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({order:order})
    }).then(result => result.json())
    .catch(console.log);
  }

  render() {
    const {order} = this.props;
    const {modal} = this.state;
    const {shippingLabel, delivery, email, phone} = order;
    console.log(order);

    return (
      
      <Dropdown>
          <ul className="action-dropdown">
            {!shippingLabel ? <li onClick={this.confirmOrder}>Ship order</li> : null }
            {!shippingLabel ? null : <li><a target={'_blank'} href={shippingLabel}>Print label</a></li>}
            <li 
              onClick={()=>this.openModal('contact')}>
              Contact customer
            </li>
            <li
             onClick={()=>this.openModal('refund')}>
              Refund
            </li>
          </ul>
          <Modal 
          classNames={{
            modal: 'modal',
            overlay: 'modal-background'
          }}
          open={modal.contact}
          onClose={()=>this.closeModal('contact')} 
          center>
            <h3>Contact {delivery.firstName}</h3>
            <a href={`mailto: ${email}`}>{email}</a>
            <br/>
            <a href={`tel:${phone}`}>{phone}</a>
          </Modal>
          <Modal 
            classNames={{
              modal: 'modal',
              overlay: 'modal-background'
            }}
            open={modal.refund}
            onClose={()=>this.closeModal('refund')} 
            center>
            <RefundForm
              order={order}
              reset={()=>this.closeModal('refund')} 
            />
          </Modal>
       </Dropdown>
    )
  }
};
