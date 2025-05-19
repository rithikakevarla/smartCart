document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const searchInput = document.getElementById("search-input")
  const searchButton = document.getElementById("search-button")
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")
  const loading = document.getElementById("loading")
  const productInfo = document.querySelector(".product-info")
  const noResults = document.getElementById("no-results")
  const initialState = document.getElementById("initial-state")
  const productImage = document.getElementById("product-image")
  const productName = document.getElementById("product-name")
  const bestPrice = document.getElementById("best-price")
  const bestStore = document.getElementById("best-store")
  const priceList = document.getElementById("price-list")
  const ratingValue = document.getElementById("rating-value")
  const starRating = document.getElementById("star-rating")
  const reviewCount = document.getElementById("review-count")
  const reviewList = document.getElementById("review-list")
  const savedList = document.getElementById("saved-list")
  const noSaved = document.getElementById("no-saved")
  const historyList = document.getElementById("history-list")
  const noHistory = document.getElementById("no-history")

  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked tab
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Search functionality
  searchButton.addEventListener("click", performSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })

  // Load saved items and history from storage
  loadSavedItems()
  loadSearchHistory()

  function performSearch() {
    const query = searchInput.value.trim()
    if (!query) return

    // Show loading state
    initialState.classList.add("hidden")
    productInfo.classList.add("hidden")
    noResults.classList.add("hidden")
    loading.classList.remove("hidden")

    // Add to search history
    addToSearchHistory(query)

    // Mock API call - in a real extension, this would call your background script
    // to fetch data from various e-commerce sites
    setTimeout(() => {
      // Hide loading
      loading.classList.add("hidden")

      // Mock data - in a real extension, this would be actual data from e-commerce sites
      const results = getMockData(query)

      if (results && results.length > 0) {
        displayMultipleResults(results)
      } else {
        noResults.classList.remove("hidden")
      }
    }, 1000)
  }

  function displayMultipleResults(results) {
    // Clear any existing product info
    productInfo.innerHTML = ""

    // Create a container for multiple results
    const resultsContainer = document.createElement("div")
    resultsContainer.className = "results-container"

    // Add each product as a card
    results.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"

      productCard.innerHTML = `
      <div class="product-card-header">
        <img src="${product.image}" alt="${product.name}" class="product-card-image">
        <div class="product-card-info">
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-price">
            <span>Best Price: ${formatPrice(product.bestPrice)}</span>
            <span class="product-card-store">${product.bestStore}</span>
          </div>
          <div class="product-card-rating">
            <span>${product.rating.toFixed(1)}</span>
            <div class="product-card-stars">
              ${getStarRating(product.rating)}
            </div>
            <span>(${product.reviewCount})</span>
          </div>
        </div>
      </div>
      <div class="product-card-actions">
        <button class="view-details-button" data-id="${product.id}">View Details</button>
        <button class="save-item-button" data-id="${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    `

      resultsContainer.appendChild(productCard)
    })

    // Add the results container to the product info section
    productInfo.appendChild(resultsContainer)

    // Add event listeners to the view details buttons
    document.querySelectorAll(".view-details-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id")
        const product = results.find((p) => p.id === productId)
        if (product) {
          displayProductDetails(product)
        }
      })
    })

    // Add event listeners to the save item buttons
    document.querySelectorAll(".save-item-button").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id")
        const product = results.find((p) => p.id === productId)
        if (product) {
          saveItem(product)
          this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        `
          this.disabled = true
        }
      })
    })

    // Show the product info section
    productInfo.classList.remove("hidden")
  }

  function displayProductDetails(product) {
    // Clear the product info section
    productInfo.innerHTML = ""

    // Create the product details HTML
    const detailsHTML = `
    <div class="product-details">
      <button class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to results
      </button>
      
      <div class="product-header">
        <img src="${product.image}" alt="${product.name}" id="product-image">
        <div>
          <h2 id="product-name">${product.name}</h2>
          <div class="best-price">
            <span>Best Price:</span>
            <span id="best-price" class="price">${formatPrice(product.bestPrice)}</span>
            <span id="best-store" class="store">${product.bestStore}</span>
          </div>
        </div>
      </div>

      <div class="price-comparison">
        <h3>Price Comparison</h3>
        <ul id="price-list">
          ${product.prices
            .map(
              (price) => `
            <li class="price-item">
              <div class="store-info">
                <img src="${price.logo}" alt="${price.store}" class="store-logo">
                <span class="store-name">${price.store}</span>
              </div>
              <span class="store-price">${formatPrice(price.price)}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>

      <div class="reviews">
        <h3>Reviews</h3>
        <div class="overall-rating">
          <div class="stars">
            <span id="rating-value">${product.rating.toFixed(1)}</span>
            <div id="star-rating">
              ${getStarRating(product.rating)}
            </div>
          </div>
          <span id="review-count">(${product.reviewCount} reviews)</span>
        </div>
        <ul id="review-list">
          ${product.reviews
            .map(
              (review) => `
            <li class="review-item">
              <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${review.date}</span>
              </div>
              <div class="review-rating">
                ${getStarRating(review.rating)}
              </div>
              <p class="review-text">${review.text}</p>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    </div>
  `

    // Add the details HTML to the product info section
    productInfo.innerHTML = detailsHTML

    // Add event listener to the back button
    document.querySelector(".back-button").addEventListener("click", () => {
      const query = searchInput.value.trim()
      const results = getMockData(query)
      if (results && results.length > 0) {
        displayMultipleResults(results)
      }
    })

    // Show the product info section
    productInfo.classList.remove("hidden")
  }

  function saveItem(product) {
    // Check if chrome is defined, if not, define it (for testing purposes)
    if (typeof chrome === "undefined") {
      chrome = {}
      chrome.storage = {
        local: {
          get: (keys, callback) => {
            const result = {}
            if (keys.includes("savedItems") && localStorage.getItem("savedItems")) {
              result.savedItems = JSON.parse(localStorage.getItem("savedItems"))
            }
            callback(result)
          },
          set: (items, callback) => {
            if (items.savedItems) {
              localStorage.setItem("savedItems", JSON.stringify(items.savedItems))
            }
            callback()
          },
        },
      }
    }

    chrome.storage.local.get(["savedItems"], (result) => {
      const savedItems = result.savedItems || []

      // Check if the item is already saved
      const alreadySaved = savedItems.some((item) => item.id === product.id)

      if (!alreadySaved) {
        // Add the item to saved items
        savedItems.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.bestPrice,
          store: product.bestStore,
        })

        // Save to storage
        chrome.storage.local.set({ savedItems }, () => {
          // Show a notification
          showNotification("Item saved successfully!")

          // Reload saved items
          loadSavedItems()
        })
      }
    })
  }

  function showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    document.body.appendChild(notification)

    // Show the notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Hide and remove the notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  function getStarRating(rating) {
    let stars = ""
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? "★" : "☆"
    }
    return stars
  }

  function formatPrice(price) {
    return "$" + price.toFixed(2)
  }

  function addToSearchHistory(query) {
    // Check if chrome is defined, if not, define it (for testing purposes)
    if (typeof chrome === "undefined") {
      chrome = {}
      chrome.storage = {
        local: {
          get: (keys, callback) => {
            const result = {}
            if (keys.includes("searchHistory") && localStorage.getItem("searchHistory")) {
              result.searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
            }
            callback(result)
          },
          set: (items, callback) => {
            if (items.searchHistory) {
              localStorage.setItem("searchHistory", JSON.stringify(items.searchHistory))
            }
            callback()
          },
        },
      }
    }

    chrome.storage.local.get(["searchHistory"], (result) => {
      let history = result.searchHistory || []

      // Add new search to the beginning of the array
      history.unshift({
        query,
        timestamp: Date.now(),
      })

      // Limit history to 10 items
      if (history.length > 10) {
        history = history.slice(0, 10)
      }

      chrome.storage.local.set({ searchHistory: history }, () => {
        loadSearchHistory()
      })
    })
  }

  function loadSearchHistory() {
    // Check if chrome is defined, if not, define it (for testing purposes)
    if (typeof chrome === "undefined") {
      chrome = {}
      chrome.storage = {
        local: {
          get: (keys, callback) => {
            const result = {}
            if (keys.includes("searchHistory") && localStorage.getItem("searchHistory")) {
              result.searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
            }
            callback(result)
          },
          set: (items, callback) => {
            if (items.searchHistory) {
              localStorage.setItem("searchHistory", JSON.stringify(items.searchHistory))
            }
            callback()
          },
        },
      }
    }
    chrome.storage.local.get(["searchHistory"], (result) => {
      const history = result.searchHistory || []

      if (history.length === 0) {
        historyList.classList.add("hidden")
        noHistory.classList.remove("hidden")
        return
      }

      historyList.innerHTML = ""
      history.forEach((item) => {
        const li = document.createElement("li")
        li.className = "history-item"
        li.innerHTML = `
          <div class="history-item-info">
            <div class="history-item-name">${item.query}</div>
            <div class="history-item-date">${formatDate(item.timestamp)}</div>
          </div>
          <div class="history-item-actions">
            <button class="action-button search-again" data-query="${item.query}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        `
        historyList.appendChild(li)
      })

      // Add event listeners to search again buttons
      document.querySelectorAll(".search-again").forEach((button) => {
        button.addEventListener("click", function () {
          const query = this.getAttribute("data-query")
          searchInput.value = query
          performSearch()

          // Switch to results tab
          tabButtons.forEach((btn) => btn.classList.remove("active"))
          tabContents.forEach((content) => content.classList.remove("active"))
          document.querySelector('[data-tab="results"]').classList.add("active")
          document.getElementById("results").classList.add("active")
        })
      })

      historyList.classList.remove("hidden")
      noHistory.classList.add("hidden")
    })
  }

  function loadSavedItems() {
    // Check if chrome is defined, if not, define it (for testing purposes)
    if (typeof chrome === "undefined") {
      chrome = {}
      chrome.storage = {
        local: {
          get: (keys, callback) => {
            const result = {}
            if (keys.includes("savedItems") && localStorage.getItem("savedItems")) {
              result.savedItems = JSON.parse(localStorage.getItem("savedItems"))
            }
            callback(result)
          },
          set: (items, callback) => {
            if (items.savedItems) {
              localStorage.setItem("savedItems", JSON.stringify(items.savedItems))
            }
            callback()
          },
        },
      }
    }
    chrome.storage.local.get(["savedItems"], (result) => {
      const savedItems = result.savedItems || []

      if (savedItems.length === 0) {
        savedList.classList.add("hidden")
        noSaved.classList.remove("hidden")
        return
      }

      savedList.innerHTML = ""
      savedItems.forEach((item) => {
        const li = document.createElement("li")
        li.className = "saved-item"
        li.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="saved-item-image">
          <div class="saved-item-info">
            <div class="saved-item-name">${item.name}</div>
            <div class="saved-item-price">${formatPrice(item.price)}</div>
            <div class="saved-item-store">${item.store}</div>
          </div>
          <div class="saved-item-actions">
            <button class="action-button remove-saved" data-id="${item.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `
        savedList.appendChild(li)
      })

      // Add event listeners to remove buttons
      document.querySelectorAll(".remove-saved").forEach((button) => {
        button.addEventListener("click", function () {
          const id = this.getAttribute("data-id")
          removeSavedItem(id)
        })
      })

      savedList.classList.remove("hidden")
      noSaved.classList.add("hidden")
    })
  }

  function removeSavedItem(id) {
    // Check if chrome is defined, if not, define it (for testing purposes)
    if (typeof chrome === "undefined") {
      chrome = {}
      chrome.storage = {
        local: {
          get: (keys, callback) => {
            const result = {}
            if (keys.includes("savedItems") && localStorage.getItem("savedItems")) {
              result.savedItems = JSON.parse(localStorage.getItem("savedItems"))
            }
            callback(result)
          },
          set: (items, callback) => {
            if (items.savedItems) {
              localStorage.setItem("savedItems", JSON.stringify(items.savedItems))
            }
            callback()
          },
        },
      }
    }
    chrome.storage.local.get(["savedItems"], (result) => {
      let savedItems = result.savedItems || []
      savedItems = savedItems.filter((item) => item.id !== id)

      chrome.storage.local.set({ savedItems }, () => {
        loadSavedItems()
      })
    })
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Mock data function - in a real extension, this would be replaced with actual API calls
  function getMockData(query) {
    // More comprehensive mock data for demonstration
    const mockProducts = [
      {
        id: "1",
        name: "Nike Air Max 270 Running Shoes",
        image: "https://placeholder.svg?height=200&width=200&text=Nike+Air+Max+270",
        bestPrice: 129.99,
        bestStore: "Nike",
        prices: [
          { store: "Nike", price: 129.99, logo: "https://placeholder.svg?height=20&width=20&text=Nike" },
          { store: "Amazon", price: 139.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Foot Locker", price: 149.99, logo: "https://placeholder.svg?height=20&width=20&text=Foot+Locker" },
          { store: "Finish Line", price: 134.99, logo: "https://placeholder.svg?height=20&width=20&text=Finish+Line" },
        ],
        rating: 4.7,
        reviewCount: 1245,
        reviews: [
          { name: "John D.", date: "2023-03-15", rating: 5, text: "Great comfort and style!" },
          { name: "Sarah M.", date: "2023-02-28", rating: 4, text: "Good shoes but a bit pricey." },
          { name: "Mike T.", date: "2023-02-10", rating: 5, text: "Best running shoes I've ever owned." },
        ],
      },
      {
        id: "2",
        name: "Nike Revolution 6 Running Shoes",
        image: "https://placeholder.svg?height=200&width=200&text=Nike+Revolution+6",
        bestPrice: 59.99,
        bestStore: "Amazon",
        prices: [
          { store: "Nike", price: 65.99, logo: "https://placeholder.svg?height=20&width=20&text=Nike" },
          { store: "Amazon", price: 59.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Foot Locker", price: 69.99, logo: "https://placeholder.svg?height=20&width=20&text=Foot+Locker" },
          { store: "Finish Line", price: 64.99, logo: "https://placeholder.svg?height=20&width=20&text=Finish+Line" },
        ],
        rating: 4.5,
        reviewCount: 876,
        reviews: [
          { name: "Emily R.", date: "2023-04-02", rating: 5, text: "Great budget-friendly running shoes!" },
          { name: "David K.", date: "2023-03-20", rating: 4, text: "Good for everyday use, comfortable." },
          { name: "Lisa P.", date: "2023-03-05", rating: 5, text: "Perfect fit and very lightweight." },
        ],
      },
      {
        id: "3",
        name: "Nike Air Force 1 Low",
        image: "https://placeholder.svg?height=200&width=200&text=Nike+Air+Force+1",
        bestPrice: 89.99,
        bestStore: "Nike",
        prices: [
          { store: "Nike", price: 89.99, logo: "https://placeholder.svg?height=20&width=20&text=Nike" },
          { store: "Amazon", price: 99.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Foot Locker", price: 94.99, logo: "https://placeholder.svg?height=20&width=20&text=Foot+Locker" },
          { store: "Finish Line", price: 92.99, logo: "https://placeholder.svg?height=20&width=20&text=Finish+Line" },
        ],
        rating: 4.8,
        reviewCount: 2145,
        reviews: [
          { name: "Robert J.", date: "2023-04-10", rating: 5, text: "Classic style that goes with everything!" },
          { name: "Jennifer L.", date: "2023-03-25", rating: 5, text: "These never go out of style. Love them." },
          { name: "Thomas B.", date: "2023-03-15", rating: 4, text: "Great shoes, just a bit stiff at first." },
        ],
      },
      {
        id: "4",
        name: "Wireless Bluetooth Headphones",
        image: "https://placeholder.svg?height=200&width=200&text=Headphones",
        bestPrice: 79.99,
        bestStore: "Amazon",
        prices: [
          { store: "Amazon", price: 79.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Walmart", price: 84.99, logo: "https://placeholder.svg?height=20&width=20&text=Walmart" },
          { store: "Best Buy", price: 89.99, logo: "https://placeholder.svg?height=20&width=20&text=BestBuy" },
          { store: "Target", price: 82.99, logo: "https://placeholder.svg?height=20&width=20&text=Target" },
        ],
        rating: 4.5,
        reviewCount: 1245,
        reviews: [
          { name: "John D.", date: "2023-03-15", rating: 5, text: "Great sound quality and battery life!" },
          { name: "Sarah M.", date: "2023-02-28", rating: 4, text: "Comfortable to wear, but a bit pricey." },
          {
            name: "Mike T.",
            date: "2023-02-10",
            rating: 5,
            text: "Best headphones I've ever owned. Noise cancellation is amazing.",
          },
        ],
      },
      {
        id: "5",
        name: "Smart Watch Series 5",
        image: "https://placeholder.svg?height=200&width=200&text=SmartWatch",
        bestPrice: 199.99,
        bestStore: "Best Buy",
        prices: [
          { store: "Amazon", price: 219.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Walmart", price: 209.99, logo: "https://placeholder.svg?height=20&width=20&text=Walmart" },
          { store: "Best Buy", price: 199.99, logo: "https://placeholder.svg?height=20&width=20&text=BestBuy" },
          { store: "Target", price: 229.99, logo: "https://placeholder.svg?height=20&width=20&text=Target" },
        ],
        rating: 4.7,
        reviewCount: 876,
        reviews: [
          { name: "Emily R.", date: "2023-04-02", rating: 5, text: "Love all the fitness tracking features!" },
          {
            name: "David K.",
            date: "2023-03-20",
            rating: 4,
            text: "Battery life could be better, but otherwise great.",
          },
          {
            name: "Lisa P.",
            date: "2023-03-05",
            rating: 5,
            text: "The health monitoring features are incredibly accurate.",
          },
        ],
      },
      {
        id: "6",
        name: "Laptop Pro 13-inch",
        image: "https://placeholder.svg?height=200&width=200&text=Laptop",
        bestPrice: 1199.99,
        bestStore: "Amazon",
        prices: [
          { store: "Amazon", price: 1199.99, logo: "https://placeholder.svg?height=20&width=20&text=Amazon" },
          { store: "Walmart", price: 1249.99, logo: "https://placeholder.svg?height=20&width=20&text=Walmart" },
          { store: "Best Buy", price: 1229.99, logo: "https://placeholder.svg?height=20&width=20&text=BestBuy" },
          { store: "Target", price: 1299.99, logo: "https://placeholder.svg?height=20&width=20&text=Target" },
        ],
        rating: 4.8,
        reviewCount: 532,
        reviews: [
          { name: "Robert J.", date: "2023-04-10", rating: 5, text: "Incredibly fast and the display is stunning!" },
          {
            name: "Jennifer L.",
            date: "2023-03-25",
            rating: 5,
            text: "Perfect for work and entertainment. Battery lasts all day.",
          },
          {
            name: "Thomas B.",
            date: "2023-03-15",
            rating: 4,
            text: "Great performance, but runs a bit hot under heavy load.",
          },
        ],
      },
    ]

    // Improved search logic - returns multiple matches instead of just one
    const lowerQuery = query.toLowerCase()
    const results = mockProducts.filter((product) => product.name.toLowerCase().includes(lowerQuery))

    return results.length > 0 ? results : null
  }
})

