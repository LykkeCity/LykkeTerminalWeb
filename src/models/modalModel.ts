class ModalModel {
  message: string;
  applyAction: any;
  cancelAction: any;
  close: any;

  constructor(
    message: string,
    applyAction: any,
    cancelAction: any,
    close: any
  ) {
    this.message = message;
    this.applyAction = applyAction;
    this.cancelAction = cancelAction;
    this.close = () => close(this);
  }
}

export default ModalModel;
