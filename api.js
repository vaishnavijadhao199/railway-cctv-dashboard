export const fetchData = async (endpoint) => {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};
