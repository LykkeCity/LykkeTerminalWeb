class ErrorParser {
  static getMessage(message: string) {
    return message
      .split(': ')[1]
      .split(/(?=[A-Z])/)
      .join(' ')
      .toLowerCase();
  }
}

export default ErrorParser;
