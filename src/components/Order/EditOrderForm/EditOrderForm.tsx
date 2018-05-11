import * as React from 'react';
import {OrderBasicFormProps} from '../index';
import OrderLimit from '../OrderLimit';

interface EditOrderFormProps extends OrderBasicFormProps {
  onCancel?: any;
  amount?: string;
  price: string;
  buttonMessage: string;
  isEditForm: boolean;
  onPriceArrowClick: (operation: string) => void;
  onPriceChange: (value?: string) => void;
}

const EditOrderForm = (props: EditOrderFormProps) => {
  return (
    <div>
      <OrderLimit {...props} />
    </div>
  );
};

export default EditOrderForm;
