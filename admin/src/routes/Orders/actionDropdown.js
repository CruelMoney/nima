import React, { Component } from 'react';
import Dropdown from '../../components/Dropdown';
import Modal from 'react-responsive-modal';
import RefundForm from '../../components/RefundForm';
import ConfirmForm from '../../components/ConfirmOrderForm';
import OrderDetails from '../../components/OrderDetails';

export default class ActionDropdown extends Component {
  state={
    modal:{
      refund:false,
      details:false,
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
    const {shippingLabel, paymentStatus} = order;

    return (
      
      <Dropdown>
          <ul className="action-dropdown">
            {paymentStatus === 'uncaptured' ? <li 
             onClick={()=>this.openModal('confirm')}>
              Confirm order
            </li> : null }
            {!shippingLabel ? null : <li><a target={'_blank'} href={shippingLabel}>Print label</a></li>}
            <li 
              onClick={()=>this.openModal('details')}>
              Order details
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
          open={modal.details}
          onClose={()=>this.closeModal('details')} 
          center>
            <OrderDetails order={order} />
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
