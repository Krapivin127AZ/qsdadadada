const placeholderImage = "assets/images/hero-car.png";

const newCars = [
  {
    name: "Porsche 911 (991)",
    type: "Купе",
    badge: "НОВЫЕ",
    image: "assets/images/porsche-911-991.jpg"
  },
  {
    name: "Porsche Taycan",
    type: "Седан",
    badge: "НОВЫЕ",
    image: "assets/images/porsche-taycan.jpg"
  },
  {
    name: "Porsche Cayenne",
    type: "Кросовер",
    badge: "НОВЫЕ",
    image: "assets/images/porsche-cayenne.jpg"
  }
];

const baseUsedCars = [
  {
    brand: "Toyota",
    model: "Camry (XV70)",
    year: 2018,
    price: 22900,
    mileage: 76000,
    city: "Київ",
    type: "Седан",
    image: "assets/images/toyota-camry-xv70.jpg"
  },
  {
    brand: "BMW",
    model: "3 Series (G20)",
    year: 2019,
    price: 31500,
    mileage: 52000,
    city: "Львів",
    type: "Седан",
    image: "assets/images/bmw-3series-g20.jpg"
  },
  {
    brand: "Audi",
    model: "A4 (B9)",
    year: 2018,
    price: 26800,
    mileage: 68000,
    city: "Одеса",
    type: "Седан",
    image: "assets/images/audi-a4-b9.jpg"
  },
  {
    brand: "Volkswagen",
    model: "Golf Mk7",
    year: 2017,
    price: 14800,
    mileage: 93000,
    city: "Дніпро",
    type: "Хетчбек",
    image: "assets/images/vw-golf-mk7.jpg"
  },
  {
    brand: "Mazda",
    model: "CX-5",
    year: 2019,
    price: 25500,
    mileage: 61000,
    city: "Запоріжжя",
    type: "Кросовер",
    image: "assets/images/mazda-cx5.jpg"
  },
  {
    brand: "Hyundai",
    model: "Tucson",
    year: 2018,
    price: 21900,
    mileage: 74000,
    city: "Харків",
    type: "Кросовер",
    image: "assets/images/hyundai-tucson.jpg"
  },
  {
    brand: "Škoda",
    model: "Octavia Combi",
    year: 2020,
    price: 23500,
    mileage: 56000,
    city: "Івано-Франківськ",
    type: "Універсал",
    image: "assets/images/skoda-octavia-combi.jpg"
  },
  {
    brand: "Honda",
    model: "Civic sedan",
    year: 2015,
    price: 12900,
    mileage: 102000,
    city: "Полтава",
    type: "Седан",
    image: "assets/images/honda-civic-sedan.jpg"
  }
];

const loadCustomCars = () => {
  try {
    const raw = localStorage.getItem("usedCarsCustom");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map((car) => ({ ...car, isCustom: true }))
      : [];
  } catch {
    return [];
  }
};

const saveCustomCars = (cars) => {
  try {
    localStorage.setItem("usedCarsCustom", JSON.stringify(cars));
  } catch {
    // Ignore storage errors.
  }
};

let customUsedCars = loadCustomCars();
const usedCars = [...customUsedCars, ...baseUsedCars];

const usedGrid = document.getElementById("usedCarsGrid");
const newCarsGrid = document.getElementById("newCarsGrid");
const usedCount = document.getElementById("usedCount");
const shuffleButton = document.getElementById("shuffleUsedCars");
const usedCarForm = document.getElementById("usedCarForm");
const usedBrand = document.getElementById("usedBrand");
const usedModel = document.getElementById("usedModel");
const usedYear = document.getElementById("usedYear");
const usedPrice = document.getElementById("usedPrice");
const usedMileage = document.getElementById("usedMileage");
const usedCity = document.getElementById("usedCity");
const usedType = document.getElementById("usedType");
const usedImage = document.getElementById("usedImage");
const catalogForm = document.getElementById("catalogForm");
const brandInput = document.getElementById("brandInput");
const modelInput = document.getElementById("modelInput");
const typeSelect = document.getElementById("typeSelect");
const resetFilters = document.getElementById("resetFilters");

const priceRange = document.getElementById("priceRange");
const downRange = document.getElementById("downRange");
const termRange = document.getElementById("termRange");
const priceValue = document.getElementById("priceValue");
const downValue = document.getElementById("downValue");
const termValue = document.getElementById("termValue");
const monthlyPayment = document.getElementById("monthlyPayment");

const formatNumber = (value) => new Intl.NumberFormat("uk-UA").format(value);
const formatPrice = (value) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalize = (value) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const shuffleArray = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const renderNewCars = () => {
  if (!newCarsGrid) return;

  newCarsGrid.innerHTML = newCars
    .map(
      (car) => `
      <article class="car-card">
        <span class="tag">${car.badge}</span>
        <img src="${car.image}" alt="${car.name}">
        <div class="car-info">
          <h3>${car.name}</h3>
          <p>${car.type}</p>
        </div>
      </article>
    `
    )
    .join("");
};

const filterCars = () => {
  const brand = normalize(brandInput?.value ?? "");
  const model = normalize(modelInput?.value ?? "");
  const type = typeSelect?.value ?? "Всі автомобілі";

  return usedCars.filter((car) => {
    const matchesBrand = !brand || normalize(car.brand).includes(brand);
    const matchesModel = !model || normalize(car.model).includes(model);
    const matchesType = type === "Всі автомобілі" || car.type === type;
    return matchesBrand && matchesModel && matchesType;
  });
};

const renderUsedCars = (cars) => {
  if (!usedGrid) return;

  if (!cars.length) {
    usedGrid.innerHTML = "<p class=\"used-empty\">Нічого не знайдено. Спробуйте інші фільтри.</p>";
    return;
  }

  usedGrid.innerHTML = cars
    .map((car) => {
      const imageSrc = car.image || placeholderImage;
      return `
      <article class="used-card">
        <img src="${imageSrc}" alt="${car.brand} ${car.model}">
        <div>
          <h3>${car.brand} ${car.model}</h3>
          <p class="used-price">${formatPrice(car.price)}</p>
          <ul class="used-meta">
            <li>${car.year} рік</li>
            <li>${formatNumber(car.mileage)} км</li>
            <li>${car.type}</li>
            <li>${car.city}</li>
          </ul>
        </div>
      </article>
    `
    })
    .join("");
};

const refreshUsedCars = () => {
  const filtered = filterCars();
  const pinned = filtered.filter((car) => car.isCustom);
  const rest = filtered.filter((car) => !car.isCustom);
  const limit = Math.min(6, filtered.length);
  const selection = [
    ...pinned.slice(0, limit),
    ...shuffleArray(rest).slice(0, Math.max(0, limit - pinned.length))
  ];

  if (usedCount) {
    usedCount.textContent = String(filtered.length);
  }

  renderUsedCars(selection);
};

const addUsedCar = (car) => {
  customUsedCars = [car, ...customUsedCars];
  usedCars.unshift(car);
  saveCustomCars(customUsedCars);
};

const updateCalculator = () => {
  if (!priceRange || !downRange || !termRange) return;

  const price = Number(priceRange.value);
  let down = Number(downRange.value);
  const term = Number(termRange.value);

  if (down > price) {
    down = price;
    downRange.value = String(price);
  }

  if (priceValue) priceValue.textContent = formatPrice(price);
  if (downValue) downValue.textContent = formatPrice(down);
  if (termValue) termValue.textContent = `${term} міс`;

  const principal = Math.max(price - down, 0);
  const monthlyRate = 0.049 / 12;
  let payment = 0;

  if (principal > 0) {
    payment =
      monthlyRate === 0
        ? principal / term
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  }

  if (monthlyPayment) {
    monthlyPayment.textContent = formatPrice(Math.round(payment));
  }
};

renderNewCars();
if (catalogForm) {
  catalogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    refreshUsedCars();
  });
}

if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    if (brandInput) brandInput.value = "";
    if (modelInput) modelInput.value = "";
    if (typeSelect) typeSelect.value = "Всі автомобілі";
    refreshUsedCars();
  });
}

if (shuffleButton) {
  shuffleButton.addEventListener("click", refreshUsedCars);
}

if (usedCarForm) {
  usedCarForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const brand = usedBrand?.value.trim() ?? "";
    const model = usedModel?.value.trim() ?? "";
    const city = usedCity?.value.trim() ?? "";

    if (!brand || !model || !city) {
      return;
    }

    const newCar = {
      brand,
      model,
      year: safeNumber(usedYear?.value, 2020),
      price: safeNumber(usedPrice?.value, 0),
      mileage: safeNumber(usedMileage?.value, 0),
      city,
      type: usedType?.value ?? "Седан",
      image: usedImage?.value.trim() || placeholderImage,
      isCustom: true
    };

    addUsedCar(newCar);
    usedCarForm.reset();
    refreshUsedCars();
  });
}

if (priceRange && downRange && termRange) {
  [priceRange, downRange, termRange].forEach((input) => {
    input.addEventListener("input", updateCalculator);
  });
  updateCalculator();
}

refreshUsedCars();
