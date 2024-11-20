export const jsonTranstion = (value: any) => {
  try {
    const data = JSON.parse(value);
    if (data) {
      return data;
    }
    return {};
  } catch (error) {
    return {};
  }
};
