class ModalModel {
  message?: any;
  applyAction?: any;
  cancelAction?: any;
  close: any;
  type: string;

  constructor(
    message: string,
    applyAction: any,
    cancelAction: any,
    close: any,
    type: string
  ) {
    this.message = message;
    this.applyAction = applyAction;
    this.cancelAction = cancelAction;
    this.close = () => close(this);
    this.type = type;
  }
}

export default ModalModel;
