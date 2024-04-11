export const Days = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export const getDayLabel = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => {
      const day = Days.find((day) => day.value === v);
      return day ? day.label : "Invalid Day";
    });
  } else {
    const day = Days.find((day) => day.value === value);
    return day ? day.label : "Invalid Day";
  }
};

export const getDayValue = (label) => {
  if (Array.isArray(label)) {
    return label.map((l) => {
      const day = Days.find((day) => day.label === l);
      return day ? day.value : "Invalid Day";
    });
  } else {
    const day = Days.find((day) => day.label === label);
    return day ? day.value : "Invalid Day";
  }
};
