import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import Modal from 'react-responsive-modal';

class ShippingMethods extends PureComponent {

  state={
    modal : false
  }

  toggleModal = (open, m) => {
    this.setState({
      modal: open,
      activeMethod: m
    });
  }

  deleteItem = async (values) => {
    const {deleteItem} = this.props;

    try {
      await deleteItem(values);
      this.setState({
        modal: false,
      });
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {modal, activeMethod} = this.state;
    const {shippingMethods, saveItem} = this.props;
    
    return (
      <div className="card padding">
        <h2>Shipping methods</h2>
        <div className="flex-items fourths">
          {shippingMethods.map((m, idx) => (
            <div key={m._id || ('method-'+idx)}>
              <button 
              onClick={_ => this.toggleModal(true, m)} 
              className="transparent item">
                <h4>{m.name}</h4>
                <p>{m.description}</p>
                <p>{m.deliveryDescription}</p>
              </button>
            </div>
          ))}
          <div>
            <button 
            onClick={_ => this.toggleModal(true)} 
            className="add transparent center item">
              <span>+</span>
            </button>
          </div>
        </div>
        <Modal 
          classNames={{
            modal: 'modal shipping-modal',
            overlay: 'modal-background'
          }}
          open={modal}
          onClose={_ => this.toggleModal(false)} 
          center>
          <ShippingMethodDetail 
            items={shippingMethods}
            saveItem={saveItem}
            deleteItem={this.deleteItem}
            method={activeMethod}
          />
        </Modal>
      </div>
    );
  }
}


export default ShippingMethods;



class ShippingMethodDetail extends PureComponent{

  updateOrCreate = async ({values, setSubmitting}) => {
    const { saveItem } = this.props;
    try {
      await saveItem({method: values});
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  delete = async ({setSubmitting}) => {
    const { method, deleteItem} = this.props;
    try {
      await deleteItem({method});
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  }

  render(){
    let { method } = this.props;
    method = method ? method : {
      id: null,
      name: '', 
      deliveryDescription: '',
      description: '',
      pacsoftCode: '',
      pickupPoint: false
    }

    return (
    <div>
        <h1>Add shipping method</h1>
        <Formik
          initialValues={method}
          validate={values => {
            let errors = {};
            // if (!values.name) {
            //   errors.name = 'Required';
            // } else if (
            //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            // ) {
            //   errors.email = 'Invalid email address';
            // }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.updateOrCreate({
              values, setSubmitting
            });
          }}
        >
          {({ values, errors, touched, isSubmitting, setSubmitting}) => (
            <Form className="nima-form">
              <label htmlFor="name">
                Name
                <Field type="text" name="name" />
              </label>
              {errors.name && touched.name && errors.name}

              <label htmlFor="description">
                Description
                <Field type="text" name="description" />
              </label>

              <label htmlFor="deliveryDescription">
                Delivery details
                <Field type="text" name="deliveryDescription" />
              </label>

              <label htmlFor="pacsoftCode">
                PacsoftCode
                <Field type="text" name="pacsoftCode" />
              </label>

              <label htmlFor="pickupPoint">
                Show pickup points (only DK)
                <Field name="pickupPoint" component="input" type="checkbox" checked={values.pickupPoint} />
              </label>
              
              <div className="buttons">
                <button 
                  type="button" 
                  className="warning" 
                  disabled={isSubmitting}
                  onClick={_ => this.delete({setSubmitting})}
                  >
                  Delete
                </button>

                <button type="submit" disabled={isSubmitting}>
                  Save
                </button>
              </div>
             
            </Form>
          )}
        </Formik>
      </div>
    )}
} 