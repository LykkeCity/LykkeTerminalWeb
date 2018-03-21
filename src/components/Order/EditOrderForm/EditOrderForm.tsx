import * as React from 'react';
import {OrderLimitProps} from '../index';
import OrderLimit from '../OrderLimit';

interface EditOrderFormProps extends OrderLimitProps {
  onCancel?: any;
}

const EditOrderForm = (props: EditOrderFormProps) => {
  return (
    <div>
      <OrderLimit {...props} />
    </div>
  );
};

export default EditOrderForm;
