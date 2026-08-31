async function run() {
  const res = await fetch('https://celebrease-backend-production-4778.up.railway.app/api/v1/holidays');
  const data = await res.json();
  if (data.items) {
    console.log("Holidays:");
    data.items.forEach(h => console.log(h.name, h.id));
  } else {
    console.log("Error:", data);
  }
}
run();
