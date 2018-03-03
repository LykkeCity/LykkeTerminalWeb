class ModalModel {
  message?: any;
  applyAction?: any;
  cancelAction?: any;
  close: any;
  type: string;
  config?: any;

  constructor(
    message: string,
    applyAction: any,
    cancelAction: any,
    close: any,
    type: string,
    config: any
  ) {
    this.message = message;
    this.applyAction = applyAction;
    this.cancelAction = cancelAction;
    this.close = () => close(this);
    this.type = type;
    this.config = config;
  }
}

export default ModalModel;
