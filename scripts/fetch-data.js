// Fetch and process the CSV data
const response = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/savi-profile-menu-QNeDflU6PrD5DAhy80GZPg1JjHqbhe.csv",
)
const csvText = await response.text()

console.log("CSV Data fetched successfully")
console.log("First 500 characters:", csvText.substring(0, 500))

// Parse CSV manually (simple parser for this structure)
const lines = csvText.split("\n")
const headers = lines[0].split(",").map((h) => h.trim())
console.log("Headers:", headers)

// Process the data
const data = {
  Populations: new Set(),
  Topics: new Set(),
  Metros: new Set(),
  Counties: new Set(),
  Neighborhoods: new Set(),
}

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue

  const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

  headers.forEach((header, index) => {
    const value = values[index]
    if (value && value !== "" && data[header]) {
      data[header].add(value)
    }
  })
}

// Convert sets to sorted arrays
const processedData = {}
Object.keys(data).forEach((key) => {
  processedData[key] = Array.from(data[key]).sort()
  console.log(`${key}: ${processedData[key].length} items`)
  console.log(`First 5 ${key}:`, processedData[key].slice(0, 5))
})

console.log("Data processing complete")
