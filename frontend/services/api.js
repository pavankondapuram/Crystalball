// Placeholder for API service
// In a real app, you would use fetch or a library like Axios to make API calls

export const fetchForecast = async (location) => {
  // Simulate API call
  console.log(`Fetching forecast for ${location}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperature: `${Math.floor(Math.random() * 30) + 10}°C`,
        condition: 'Sunny', // Placeholder
      });
    }, 1000);
  });
};

export const fetchOtherData = async () => {
  // Simulate another API call
  console.log('Fetching other data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: 'Some other data',
      });
    }, 500);
  });
};
