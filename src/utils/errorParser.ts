class ErrorParser {
  static getMessage(message: string) {
    return message
      .split(/(?=[A-Z])/)
      .join(' ')
      .toLowerCase();
  }
}

export default ErrorParser;
