// Fetch and process the indicator data from the CSV
async function fetchIndicatorData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v0dev_indicator_demo_data-EKaSnuX3K50A1I4Ez9SQqXG7YAubmP.csv",
    )
    const csvText = await response.text()

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const indicators = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const indicator = {
          id: i.toString(),
          name: values[0] || "",
          topic: values[1] || "",
          subtopic: values[2] || "",
          source: values[3] || "",
          reportingLevel: values[4] || "",
          trend: values[5] || "neutral",
          availability: values[6] || "",
          lastUpdated: values[7] || "",
        }
        indicators.push(indicator)
      }
    }

    console.log(`Loaded ${indicators.length} indicators`)
    console.log("Sample indicator:", indicators[0])

    // Analyze the data
    const topics = [...new Set(indicators.map((i) => i.topic))].filter(Boolean)
    const subtopics = [...new Set(indicators.map((i) => i.subtopic))].filter(Boolean)
    const sources = [...new Set(indicators.map((i) => i.source))].filter(Boolean)
    const reportingLevels = [...new Set(indicators.map((i) => i.reportingLevel))].filter(Boolean)

    console.log("Topics:", topics)
    console.log("Subtopics:", subtopics)
    console.log("Sources:", sources)
    console.log("Reporting Levels:", reportingLevels)

    return {
      indicators,
      topics,
      subtopics,
      sources,
      reportingLevels,
    }
  } catch (error) {
    console.error("Error fetching indicator data:", error)
    return null
  }
}

// Execute the function
fetchIndicatorData()
