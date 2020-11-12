const iconLoc = {
  messages: {
    info: 'assets/images/info.svg',
    danger: 'assets/images/error.svg',
    success: 'assets/images/check.svg',
    warning: 'assets/images/warning.svg',
  },
};

export const iconLoader = (module: string, iconName?: string) => {
  if (iconLoc.hasOwnProperty(module)) {
    if (iconName) {
      return iconLoc[module].hasOwnProperty(iconName)
        ? iconLoc[module][iconName]
        : null;
    } else {
      return iconLoc[module];
    }
  }
  return null;
};
