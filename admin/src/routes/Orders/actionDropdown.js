import React, { Component } from 'react';
import Dropdown from '../../components/Dropdown';
import Modal from 'react-responsive-modal';
import RefundForm from '../../components/RefundForm';
import ConfirmForm from '../../components/ConfirmOrderForm';

export default class ActionDropdown extends Component {
  state={
    modal:{
      refund:false,
      contact:false,
      confirm:false
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
    const {order} = this.props;
    const {modal} = this.state;
    const {shippingLabel, delivery, email, phone, paymentStatus} = order;
    console.log(order);

    return (
      
      <Dropdown>
          <ul className="action-dropdown">
            {!!paymentStatus && paymentStatus.toLowerCase() === 'uncaptured' ? <li 
             onClick={()=>this.openModal('confirm')}>
              Confirm order
            </li> : null }
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
          <Modal 
            classNames={{
              modal: 'modal',
              overlay: 'modal-background'
            }}
            open={modal.confirm}
            onClose={()=>this.closeModal('confirm')} 
            center>
            <ConfirmForm
              order={order}
              reset={()=>this.closeModal('confirm')} 
            />
          </Modal>
       </Dropdown>
    )
  }
};
