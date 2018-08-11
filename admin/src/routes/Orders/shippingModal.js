import React, { PureComponent } from 'react';
import Modal from 'react-responsive-modal';

class shippingModal extends PureComponent {
  state={
    modal: false
  }

  closeModal = () => {
    this.setState({
      modal: false
    });
  }

  openModal = () => {
    this.setState({
      modal: true
    });
  }

  render() {
    const {shipping} = this.props;
    const { modal } = this.state;

    const defaultStatus = {
      status: "Not available",
      body: "",
      header: "",
      events: []
    };
    let status = !!shipping ? shipping : defaultStatus
    
    return( 
      <div>
        <Modal 
          classNames={{
            modal: 'modal shipping-modal',
            overlay: 'modal-background'
          }}
          open={modal}
          onClose={this.closeModal} 
          center>
            <table>
                  <tr>
                    <th>
                      Description
                    </th>
                    <th>
                      Location
                    </th> 
                    <th>
                      Date
                    </th>
                  </tr>
            {
              status.events.map(e => {
                return(
                  <tr>
                    <td>
                      {e.eventDescription}
                    </td>
                    <td>
                      {e.location.displayName}  
                    </td> 
                    <td>
                      {new Date(e.eventTime).long()}
                    </td>
                  </tr>
                );
              })
            }
           </table>
        </Modal>
      <div onClick={this.openModal} className='status delivery tooltip' data-status={status.status}>
        {status.status}
        {
          !!status.header ? 
          <div class="tooltiptext popup">
          <p>
            <strong>{status.header}</strong>
            {status.body}
          </p>
        </div>
        : null
        }
      </div>
      </div>
    
    )
  }
}



export default shippingModal;