// This script runs on e-commerce websites to detect products

// Function to detect product information on the current page
function detectProductInfo() {
  let productInfo = null

  // Different detection logic for different websites
  if (window.location.hostname.includes("amazon.com")) {
    productInfo = detectAmazonProduct()
  } else if (window.location.hostname.includes("walmart.com")) {
    productInfo = detectWalmartProduct()
  } else if (window.location.hostname.includes("bestbuy.com")) {
    productInfo = detectBestBuyProduct()
  } else if (window.location.hostname.includes("ebay.com")) {
    productInfo = detectEbayProduct()
  } else if (window.location.hostname.includes("target.com")) {
    productInfo = detectTargetProduct()
  }

  return productInfo
}

// Detection functions for different websites
function detectAmazonProduct() {
  try {
    // Get product name
    const productName = document.getElementById("productTitle")?.textContent.trim()

    // Get product price
    const priceElement = document.querySelector(".a-price .a-offscreen")
    const price = priceElement ? priceElement.textContent.trim() : null

    // Get product image
    const imageElement = document.getElementById("landingImage") || document.getElementById("imgBlkFront")
    const imageUrl = imageElement ? imageElement.getAttribute("src") : null

    // Get product ID (ASIN)
    const asinMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]+)/)
    const asin = asinMatch ? asinMatch[1] : null

    if (productName && price) {
      return {
        name: productName,
        price: price,
        image: imageUrl,
        id: asin,
        url: window.location.href,
        store: "Amazon",
      }
    }
  } catch (error) {
    console.error("Error detecting Amazon product:", error)
  }

  return null
}

function detectWalmartProduct() {
  try {
    // Get product name
    const productName = document.querySelector('h1[itemprop="name"]')?.textContent.trim()

    // Get product price
    const priceElement = document.querySelector('[itemprop="price"]')
    const price = priceElement ? priceElement.textContent.trim() : null

    // Get product image
    const imageElement = document.querySelector("img.product-image-carousel-image")
    const imageUrl = imageElement ? imageElement.getAttribute("src") : null

    // Get product ID
    const idMatch = window.location.pathname.match(/\/ip\/([^/]+)/)
    const productId = idMatch ? idMatch[1] : null

    if (productName && price) {
      return {
        name: productName,
        price: price,
        image: imageUrl,
        id: productId,
        url: window.location.href,
        store: "Walmart",
      }
    }
  } catch (error) {
    console.error("Error detecting Walmart product:", error)
  }

  return null
}

function detectBestBuyProduct() {
  try {
    // Get product name
    const productName = document.querySelector(".sku-title h1")?.textContent.trim()

    // Get product price
    const priceElement = document.querySelector(".priceView-customer-price span")
    const price = priceElement ? priceElement.textContent.trim() : null

    // Get product image
    const imageElement = document.querySelector(".primary-image")
    const imageUrl = imageElement ? imageElement.getAttribute("src") : null

    // Get product ID (SKU)
    const skuElement = document.querySelector(".sku .product-data-value")
    const sku = skuElement ? skuElement.textContent.trim() : null

    if (productName && price) {
      return {
        name: productName,
        price: price,
        image: imageUrl,
        id: sku,
        url: window.location.href,
        store: "Best Buy",
      }
    }
  } catch (error) {
    console.error("Error detecting Best Buy product:", error)
  }

  return null
}

function detectEbayProduct() {
  try {
    // Get product name
    const productName = document.querySelector("h1.x-item-title__mainTitle")?.textContent.trim()

    // Get product price
    const priceElement = document.querySelector("div.x-price-primary span")
    const price = priceElement ? priceElement.textContent.trim() : null

    // Get product image
    const imageElement = document.querySelector("img.mainImg")
    const imageUrl = imageElement ? imageElement.getAttribute("src") : null

    // Get product ID
    const idMatch = window.location.pathname.match(/\/itm\/([^/]+)/)
    const itemId = idMatch ? idMatch[1] : null

    if (productName && price) {
      return {
        name: productName,
        price: price,
        image: imageUrl,
        id: itemId,
        url: window.location.href,
        store: "eBay",
      }
    }
  } catch (error) {
    console.error("Error detecting eBay product:", error)
  }

  return null
}

function detectTargetProduct() {
  try {
    // Get product name
    const productName = document.querySelector('h1[data-test="product-title"]')?.textContent.trim()

    // Get product price
    const priceElement = document.querySelector('[data-test="product-price"]')
    const price = priceElement ? priceElement.textContent.trim() : null

    // Get product image
    const imageElement = document.querySelector('img[data-test="product-image"]')
    const imageUrl = imageElement ? imageElement.getAttribute("src") : null

    // Get product ID (TCIN)
    const tcinMatch = window.location.pathname.match(/\/p\/([A-Z0-9-]+)/)
    const tcin = tcinMatch ? tcinMatch[1] : null

    if (productName && price) {
      return {
        name: productName,
        price: price,
        image: imageUrl,
        id: tcin,
        url: window.location.href,
        store: "Target",
      }
    }
  } catch (error) {
    console.error("Error detecting Target product:", error)
  }

  return null
}

// Run product detection when page is loaded
window.addEventListener("load", () => {
  // Delay detection to ensure page is fully loaded
  setTimeout(() => {
    const productInfo = detectProductInfo()

    if (productInfo) {
      console.log("Product detected:", productInfo)

      // Send product info to background script
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(
          {
            type: "PRODUCT_DETECTED",
            product: productInfo,
          },
          (response) => {
            console.log("Background script response:", response)
          },
        )
      } else {
        console.warn("Chrome runtime is not available.")
      }

      // Add a button to the page to compare prices
      addCompareButton(productInfo)
    }
  }, 1500)
})

// Function to add a compare button to the page
function addCompareButton(productInfo) {
  // Create button element
  const button = document.createElement("button")
  button.textContent = "Compare Prices"
  button.style.position = "fixed"
  button.style.bottom = "20px"
  button.style.right = "20px"
  button.style.zIndex = "9999"
  button.style.padding = "10px 15px"
  button.style.backgroundColor = "#6366f1"
  button.style.color = "white"
  button.style.border = "none"
  button.style.borderRadius = "8px"
  button.style.fontFamily = "Arial, sans-serif"
  button.style.fontWeight = "bold"
  button.style.cursor = "pointer"
  button.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"

  // Add hover effect
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#4f46e5"
  })

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#6366f1"
  })

  // Add click event
  button.addEventListener("click", () => {
    // Open popup with product info
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: "OPEN_POPUP",
        product: productInfo,
      })
    } else {
      console.warn("Chrome runtime is not available.")
    }
  })

  // Add button to page
  document.body.appendChild(button)
}

