// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Cart extension installed")

  // Initialize storage
  chrome.storage.local.set({
    savedItems: [],
    searchHistory: [],
  })
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PRODUCT_DETECTED") {
    // Handle product detection
    console.log("Product detected:", message.product)

    // In a real extension, this would trigger price comparison across sites
    // For demo purposes, we'll just respond with mock data
    sendResponse({
      success: true,
      message: "Product information received",
    })

    return true // Required for async response
  }
})

// Function to fetch product data from various e-commerce sites
// In a real extension, this would make actual API calls or web scraping
async function fetchProductData(productInfo) {
  // This would be implemented to fetch real data from various e-commerce sites
  // For demo purposes, we're just returning mock data

  return {
    success: true,
    data: {
      // Mock data would go here
    },
  }
}

