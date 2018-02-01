class SettingsModel {
  showConfirm: boolean;
  themeDark: boolean;
  layout: any;

  constructor(showConfirm: boolean, themeDark: boolean, layout: any) {
    this.showConfirm = showConfirm;
    this.themeDark = themeDark;
    this.layout = layout;
  }
}

export default SettingsModel;
