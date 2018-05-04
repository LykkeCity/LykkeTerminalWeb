import * as React from 'react';
import {OrderBasicFormProps} from '../index';
import OrderLimit from '../OrderLimit';

interface EditOrderFormProps extends OrderBasicFormProps {
  onCancel?: any;
  amount?: string;
  price: string;
  buttonMessage: string;
  isEditForm: boolean;
}

const EditOrderForm = (props: EditOrderFormProps) => {
  return (
    <div>
      <OrderLimit {...props} />
    </div>
  );
};

export default EditOrderForm;
