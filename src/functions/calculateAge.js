function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  // Get the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday hasn't occurred yet this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default calculateAge;

// // Example usage:
// const birthday = "2024-03-06T16:00:00.000Z";
// const age = calculateAge(birthday);
// console.log("Age:", age);
