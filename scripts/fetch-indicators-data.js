// Fetch and process the CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile_Category_Tile_Indicator-pmfvxMXkJwbZbjbfhplu7PYqux1V8R.csv"

async function fetchAndProcessIndicators() {
  try {
    console.log("Fetching CSV data from:", csvUrl)

    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("CSV data fetched successfully")
    console.log("First 500 characters:", csvText.substring(0, 500))

    // Parse CSV manually (simple parser for this structure)
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("Headers:", headers)

    const indicators = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      // Handle CSV parsing with potential commas in quoted fields
      const values = []
      let current = ""
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add the last value

      if (values.length >= 4) {
        const indicator = {
          id: `indicator_${i}`,
          topic: values[0]?.replace(/"/g, "") || "",
          category: values[1]?.replace(/"/g, "") || "",
          tile: values[2]?.replace(/"/g, "") || "",
          indicator: values[3]?.replace(/"/g, "") || "",
          // Add some mock metadata for the interface
          source: "SAVI Data Portal",
          lastUpdated: "2024-01-15",
          value: Math.floor(Math.random() * 100000) + 1000, // Mock values
          reportingArea: "Marion County",
          availability: "2020-2024",
          description: `${values[3]?.replace(/"/g, "") || ""} - Detailed indicator description`,
          notes: "Data sourced from SAVI community indicators",
        }

        indicators.push(indicator)
      }
    }

    console.log(`Processed ${indicators.length} indicators`)
    console.log("Sample indicators:", indicators.slice(0, 3))

    // Group by topic for analysis
    const topicGroups = indicators.reduce((acc, indicator) => {
      const topic = indicator.topic
      if (!acc[topic]) acc[topic] = []
      acc[topic].push(indicator)
      return acc
    }, {})

    console.log("Topics found:", Object.keys(topicGroups))
    console.log(
      "Topic distribution:",
      Object.entries(topicGroups).map(([topic, items]) => ({
        topic,
        count: items.length,
      })),
    )

    return indicators
  } catch (error) {
    console.error("Error fetching or processing CSV:", error)
    return []
  }
}

// Execute the function
fetchAndProcessIndicators()
