export const omnBsConfig = (config: any) => {
  const bsConfig = {
    containerClass: 'theme-omn',
    showWeekNumbers: false,
    placement: 'bottom right',
  };
  if (config) {
    return { ...bsConfig, ...config };
  } else {
    return bsConfig;
  }
};
