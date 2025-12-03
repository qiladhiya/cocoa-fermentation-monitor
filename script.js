/* -----------------------------
   DATA DARI EXCEL (SUHU, pH, KIMIA)
   Sudah diringkas per hari & per jam
------------------------------*/

// Suhu & pH per hari, 7 titik (0–24 jam) per hari
const fermentationByDay = {
  1: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [27.73, 28.75, 29.98, 31.29, 32.51, 33.80, 34.99],
    phPulp: [3.77, 3.83, 3.92, 4.00, 4.08, 4.17, 4.25],
    phCot:  [6.75, 6.73, 6.70, 6.67, 6.65, 6.62, 6.60]
  },
  2: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [34.99, 35.68, 36.36, 37.02, 37.65, 38.34, 39.03],
    phPulp: [4.25, 4.29, 4.34, 4.38, 4.42, 4.46, 4.50],
    phCot:  [6.60, 6.57, 6.53, 6.50, 6.47, 6.43, 6.40]
  },
  3: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [39.03, 39.85, 40.64, 41.52, 42.31, 43.12, 44.03],
    phPulp: [4.50, 4.54, 4.58, 4.63, 4.67, 4.71, 4.75],
    phCot:  [6.40, 6.33, 6.27, 6.20, 6.14, 6.07, 5.99]
  },
  4: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [44.03, 44.74, 45.53, 46.26, 46.98, 47.78, 48.39],
    phPulp: [4.75, 4.79, 4.83, 4.88, 4.92, 4.96, 5.00],
    phCot:  [5.99, 5.90, 5.80, 5.70, 5.60, 5.50, 5.41]
  },
  5: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [48.39, 48.14, 47.84, 47.51, 47.16, 46.84, 46.51],
    phPulp: [5.00, 5.04, 5.07, 5.10, 5.13, 5.17, 5.20],
    phCot:  [5.41, 5.36, 5.32, 5.28, 5.23, 5.19, 5.15]
  },
  6: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [46.51, 46.17, 45.83, 45.50, 45.18, 44.83, 44.51],
    phPulp: [5.20, 5.22, 5.23, 5.25, 5.27, 5.28, 5.30],
    phCot:  [5.15, 5.14, 5.13, 5.13, 5.12, 5.11, 5.10]
  },
  7: {
    hours: [0, 4, 8, 12, 16, 20, 24],
    temp:  [44.51, 44.17, 43.82, 43.53, 43.20, 42.82, 42.49],
    phPulp: [5.30, 5.32, 5.33, 5.35, 5.37, 5.38, 5.40],
    phCot:  [5.10, 5.08, 5.07, 5.05, 5.03, 5.02, 5.00]
  }
};

// Build data overview (gabung semua hari tanpa jam duplikat)
function buildOverallData() {
  const hours = [];
  const temp = [];
  const phPulp = [];
  const phCot = [];

  Object.keys(fermentationByDay)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(day => {
      const d = fermentationByDay[day];
      d.hours.forEach((h, idx) => {
        if (day > 1 && idx === 0) return; // hindari duplikat di jam 24, 48, dst
        hours.push(h + 24 * (day - 1));
        temp.push(d.temp[idx]);
        phPulp.push(d.phPulp[idx]);
        phCot.push(d.phCot[idx]);
      });
    });

  return { hours, temp, phPulp, phCot };
}

const overallData = buildOverallData();

// ΔSuhu rata-rata per hari (discale biar orde-nya ~0.02 kayak di Power BI)
const deltaTempByDay = {
  labels: [1, 2, 3, 4, 5, 6, 7],
  values: [0.027, 0.013, 0.017, 0.015, -0.015, -0.014, -0.015]
};

// Nutrient maksimum per hari + overview (dari sheet Kimia & Sensoris)
const nutrientByDay = {
  0: { protein: 1.52, fat: 53.3, water: 54.3 },  // overall max
  1: { protein: 1.26, fat: 51.2, water: 54.3 },
  2: { protein: 1.30, fat: 52.0, water: 50.99 },
  3: { protein: 1.36, fat: 52.9, water: 47.98 },
  4: { protein: 1.36, fat: 52.9, water: 46.0 },
  5: { protein: 1.39, fat: 53.0, water: 46.0 },
  6: { protein: 1.49, fat: 53.1, water: 43.0 },
  7: { protein: 1.50, fat: 53.2, water: 42.5 }
};

// Rata-rata suhu per kategori kualitas (dari sheet Suhu + Keterangan)
const qualityTempData = {
  labels: [
    'Awal fermentasi',
    'Fermentasi aktif',
    'Mulai melonjak',
    'Lonjakan suhu – hati-hati',
    'Kualitas puncak',
    'Stabil',
    'Sedikit menurun',
    'Mulai over-fermentasi'
  ],
  temps: [29.2, 34.6, 44.0, 39.1, 47.7, 46.5, 44.5, 41.8]
};

// Skor kualitas rata-rata per hari (1-7) untuk donut chart
const qualityByDay = {
  labels: [
  'Mulai Melonjak',
  'Lonjakan suhu – Hati-hati',
  'Kualitas Puncak',
  'Stabil',
  'Sedikit Menurun',
  'Mulai Over Fermentasi'
],
values: [9.52, 4.76, 14.29, 19.05, 23.81, 28.5]
};

/* -----------------------------
   PENJELASAN GRAFIK (MODAL)
------------------------------*/
const chartExplanations = {
  tempHour: {
    title: 'Perubahan Suhu Kakao per Jam',
    text: `Grafik ini menunjukkan bagaimana suhu massa kakao berubah selama proses fermentasi dari jam ke jam. Pada awal fermentasi, suhu berada pada kisaran 27–28°C, kemudian meningkat secara bertahap seiring meningkatnya aktivitas mikroorganisme seperti ragi, bakteri asam laktat, dan bakteri asam asetat. Kenaikan suhu ini mencapai puncaknya sekitar jam ke-100 hingga 120, dengan suhu mendekati 50°C. Suhu puncak tersebut merupakan indikator fermentasi yang sehat karena menandakan mikroba bekerja optimal dalam menguraikan pulp dan membentuk prekursor cita rasa kakao. Setelah mencapai puncak, suhu mulai menurun kembali hingga sekitar 40°C, menandakan bahwa aktivitas mikroba mulai berkurang dan fermentasi memasuki fase stabilisasi. Grafik ini membantu memahami dinamika metabolisme mikroba selama fermentasi.`
  },
  deltaDay: {
    title: 'Perubahan ΔSuhu Berdasarkan Hari',
    text: `Berdasarkan grafik, lonjakan terbesar ada di hari ke-3 menuju hari ke-4, tetapi lonjakan ini justru berkaitan dengan peningkatan/kemantapan kualitas, bukan penurunan. Tidak ada hari yang menunjukkan lonjakan suhu tajam yang jelas-jelas menurunkan kualitas, justru penurunan kualitas lebih terkait dengan fase lanjut (over-fermentasi) ketika suhu dan skor kualitas mulai turun perlahan setelahnya.`
  },
  nutrients: {
    title: 'Nutrient’s Information',
    text: `Grafik ini menunjukkan informasi nutrisi pada kakao berupa protein, lemak, dan kadar air. Kadar lemak yang terkandung dalam kakao maksimal mencapai 53%, hal ini menunjukkan bahwa biji kakao memiliki kandungan lemak yang baik. Selama fermentasi kakao mengalami sedikit perubahan akibat proses denaturasi alami, sehingga kadar protein kakao sekitar 1,5%. Sementara itu, kadar air maksimum sekitar 54%, yang masih tergolong normal untuk biji kakao basah sebelum proses pengeringan.`
  },
  qualityTemp: {
    title: 'Kualitas Kakao Berdasarkan Rata-rata Suhu',
    text: `Grafik ini menjelaskan bagaimana rata-rata suhu fermentasi berhubungan dengan kategori kualitas kakao. Setiap rentang suhu dikaitkan dengan kondisi atau tahapan fermentasi, seperti “awal fermentasi”, “fermentasi aktif”, hingga “kualitas puncak”. Semakin tinggi rata-rata suhu (dalam batas ideal 40–50°C), semakin baik kualitas sensoris yang dihasilkan, karena suhu tersebut mendorong pembentukan prekursor aroma dan warna cokelat.`
  },
  qualityDay: {
    title: 'Kualitas Kakao Berdasarkan Hari',
    text: `Grafik ini menampilkan distribusi kategori kualitas kakao yang diperoleh pada setiap hari fermentasi. Dari grafik ini terlihat bahwa hari ke-3 memberikan proporsi kualitas terbaik, menandakan bahwa fermentasi telah mencapai puncak pembentukan flavor. Hari-hari awal didominasi oleh kategori “awal fermentasi” dan “fermentasi aktif”, sementara pada hari ke-5 dan ke-6 kualitas mulai menurun hingga terjadi over-fermentasi. Grafik ini membantu menentukan hari terbaik untuk menghentikan fermentasi agar diperoleh mutu biji yang maksimal.`
  },
  phChart: {
    title: 'Perubahan pH Pulp dan Kotiledon',
    text: `Grafik ini menggambarkan perubahan pH pulp dan pH kotiledon seiring waktu. pH pulp (bagian berlendir yang menyelimuti biji) mulai pada kisaran 3,7 dan perlahan naik hingga sekitar 4,2–4,3. Kenaikan ini menunjukkan bahwa gula dalam pulp terurai dan keasaman berkurang. Sebaliknya, pH kotiledon (bagian dalam biji) turun dari sekitar 6,7 menjadi sekitar 5,0 karena asam dari pulp berdifusi masuk ke biji. Penurunan pH kotiledon adalah proses penting yang membantu memicu reaksi biokimia pembentuk aroma khas cokelat. Grafik ini sangat berguna untuk memantau apakah fermentasi berlangsung ideal dari sisi kimia internal biji kakao.`
  }
};

/* -----------------------------
   NAVIGASI PAGE
------------------------------*/
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.dataset.page;

    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  });
});

/* -----------------------------
   MODAL LOGIC
------------------------------*/
const explanationModal = document.getElementById('explanationModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function showExplanation(key) {
  const info = chartExplanations[key];
  if (!info) return;
  modalTitle.textContent = info.title;
  modalBody.textContent = info.text;
  explanationModal.classList.add('active');
}

function hideExplanation() {
  explanationModal.classList.remove('active');
}

modalCloseBtn.addEventListener('click', hideExplanation);
explanationModal.addEventListener('click', (e) => {
  if (e.target === explanationModal) hideExplanation();
});

// mapping kategori kualitas -> hari fermentasi yang paling mewakili
const qualityToDay = {
  'Awal fermentasi': 1,
  'Fermentasi aktif': 2,
  'Mulai melonjak': 3,
  'Lonjakan suhu – hati-hati': 3,
  'Kualitas puncak': 4,
  'Stabil': 4,
  'Sedikit menurun': 5,
  'Mulai over-fermentasi': 6
};

/* -----------------------------
   SLICE & STATE
------------------------------*/
let selectedDay = 0; // 0 = overview
let selectedQuality = 'Awal fermentasi';

const daySlider = document.getElementById('daySlider');
const dayBadgeText = document.getElementById('dayBadgeText');

daySlider.addEventListener('input', () => {
  selectedDay = parseInt(daySlider.value, 10);
  if (selectedDay === 0) {
    dayBadgeText.textContent = 'Overview';
  } else {
    dayBadgeText.textContent = `Hari ke-${selectedDay}`;
  }
  updateTimeSeriesCharts();
  updateDeltaChartHighlight();
  updateQualityDayHighlight();
  updateNutrients();
});

const qualityPills = document.querySelectorAll('.quality-pill');
qualityPills.forEach(pill => {
  pill.addEventListener('click', () => {
    qualityPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedQuality = pill.dataset.quality;
    updateQualityTempHighlight();

    const mappedDay = qualityToDay[selectedQuality];

    if (mappedDay) {
      selectedDay = mappedDay;
      daySlider.value = mappedDay;
      dayBadgeText.textContent = `Hari ke-${mappedDay}`;

      updateTimeSeriesCharts();
      updateDeltaChartHighlight();
      updateQualityDayHighlight();
      updateNutrients();
    }
  });
});

/* -----------------------------
   CHARTS
------------------------------*/
let tempHourChart, deltaDayChart, phChart, qualityTempChart, qualityDayChart;

function createCharts() {
  const initData = overallData;

  // a. Suhu vs Jam
  const ctxTemp = document.getElementById('tempHourChart').getContext('2d');
  tempHourChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: initData.hours,
      datasets: [
        {
          label: 'Suhu massa kakao (°C)',
          data: initData.temp,
          borderColor: '#BA0101',
          backgroundColor: 'rgba(186,1,1,0.18)',
          tension: 0.3,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 4
        },
        {
          label: 'Zona suhu optimal (~45°C)',
          data: Array(initData.hours.length).fill(45),
          borderColor: '#A0A7B5',
          borderDash: [6, 6],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 25 }
      },
      plugins: {
        legend: { 
          display: true,
          position:'bottom',
          labels:{
            padding: 12 
          } 
        },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Jam fermentasi (total)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Suhu (°C)'
          }
        }
      }
    }
  });

  // b. Delta suhu vs Hari
  const ctxDelta = document.getElementById('deltaDayChart').getContext('2d');
  deltaDayChart = new Chart(ctxDelta, {
    type: 'line',
    data: {
      labels: deltaTempByDay.labels,
      datasets: [{
        label: 'ΔSuhu rata-rata (°C)',
        data: deltaTempByDay.values,
        borderColor: '#E99D25',
        backgroundColor: 'rgba(233,157,37,0.16)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 25 }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hari fermentasi'
          },
          ticks: { stepSize: 1 }
        },
        y: {
          title: {
            display: true,
            text: 'ΔSuhu (°C)'
          }
        }
      }
    }
  });

  // f. pH chart (area)
  const ctxPh = document.getElementById('phChart').getContext('2d');
  phChart = new Chart(ctxPh, {
    type: 'line',
    data: {
      labels: initData.hours,
      datasets: [
        {
          label: 'pH pulp',
          data: initData.phPulp,
          borderColor: '#E59D2C',
          backgroundColor: 'rgba(229,157,44,0.20)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        },
        {
          label: 'pH kotiledon',
          data: initData.phCot,
          borderColor: '#2E4365',
          backgroundColor: 'rgba(46,67,101,0.10)',
          tension: 0.3,
          fill: true,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Jam fermentasi (total)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'pH'
          },
          min: 3.5,
          max: 7.0
        }
      }
    }
  });

  // d. Bar chart kualitas vs suhu
  const ctxQualTemp = document.getElementById('qualityTempChart').getContext('2d');
  const baseColors = qualityTempData.labels.map(label =>
    label === selectedQuality ? '#8A3B08' : '#E59D2C'
  );
  qualityTempChart = new Chart(ctxQualTemp, {
    type: 'bar',
    data: {
      labels: qualityTempData.labels,
      datasets: [{
        label: 'Rata-rata suhu (°C)',
        data: qualityTempData.temps,
        backgroundColor: baseColors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 9
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Rata-rata suhu (°C)'
          }
        }
      }
    }
  });

  // e. Donut kualitas per hari
  const ctxQualDay = document.getElementById('qualityDayChart').getContext('2d');
  const donutColors = qualityByDay.labels.map(() => '#E59D2C');
  qualityDayChart = new Chart(ctxQualDay, {
    type: 'doughnut',
    data: {
      labels: qualityByDay.labels,
      datasets: [{
        data: qualityByDay.values,
        backgroundColor: donutColors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: { enabled: true }
      },
      cutout: '60%'
    }
  });
}

function updateTimeSeriesCharts() {
  const data = selectedDay === 0
    ? overallData
    : (fermentationByDay[selectedDay] || fermentationByDay[3]);

  // Overview: jam total; Hari 1–7: jam relatif 0–24
  let labels = data.hours.slice();
  if (selectedDay !== 0) {
    const first = labels[0];
    labels = labels.map(h => h - first);
  }

  const optimalLine = Array(labels.length).fill(45);

  // Suhu vs jam
  tempHourChart.data.labels = labels;
  tempHourChart.data.datasets[0].data = data.temp;
  tempHourChart.data.datasets[1].data = optimalLine;
  tempHourChart.options.scales.x.title.text =
    selectedDay === 0
      ? 'Jam fermentasi (total)'
      : 'Jam fermentasi pada hari tersebut';
  tempHourChart.update();

  // pH
  phChart.data.labels = labels;
  phChart.data.datasets[0].data = data.phPulp;
  phChart.data.datasets[1].data = data.phCot;
  phChart.options.scales.x.title.text =
    selectedDay === 0
      ? 'Jam fermentasi (total)'
      : 'Jam fermentasi pada hari tersebut';
  phChart.update();
}

function updateDeltaChartHighlight() {
  const dataset = deltaDayChart.data.datasets[0];
  if (selectedDay === 0) {
    dataset.pointRadius = deltaTempByDay.labels.map(() => 4);
    dataset.pointBackgroundColor = deltaTempByDay.labels.map(() => '#E59D2C');
  } else {
    dataset.pointRadius = deltaTempByDay.labels.map(d =>
      d === selectedDay ? 6 : 4
    );
    dataset.pointBackgroundColor = deltaTempByDay.labels.map(d =>
      d === selectedDay ? '#8A3B08' : '#E59D2C'
    );
  }
  deltaDayChart.update();
}

function updateQualityTempHighlight() {
  const dataset = qualityTempChart.data.datasets[0];
  dataset.backgroundColor = qualityTempData.labels.map(label =>
    label === selectedQuality ? '#8A3B08' : '#E59D2C'
  );
  qualityTempChart.update();
}

function updateQualityDayHighlight() {
  const dataset = qualityDayChart.data.datasets[0];
  if (selectedDay === 0) {
    dataset.backgroundColor = qualityByDay.labels.map(() => '#E59D2C');
  } else {
    dataset.backgroundColor = qualityByDay.labels.map((label, idx) =>
      (idx + 2) === selectedDay ? '#8A3B08' : '#E59D2C'
    );
  }
  qualityDayChart.update();
}

function updateNutrients() {
  const n = nutrientByDay[selectedDay] || nutrientByDay[0];
  document.getElementById('proteinMax').textContent = n.protein.toFixed(2);
  document.getElementById('fatMax').textContent = n.fat.toFixed(2);
  document.getElementById('waterMax').textContent = n.water.toFixed(2);
}

// Inisialisasi
createCharts();
updateTimeSeriesCharts();
updateDeltaChartHighlight();
updateQualityTempHighlight();
updateQualityDayHighlight();
updateNutrients();

/* -----------------------------
   CLICK PENJELASAN
------------------------------*/
document.getElementById('card-temp-hour').addEventListener('click', () => showExplanation('tempHour'));
document.getElementById('card-delta-day').addEventListener('click', () => showExplanation('deltaDay'));
document.getElementById('nutrient-card').addEventListener('click', () => showExplanation('nutrients'));
document.getElementById('card-quality-temp').addEventListener('click', () => showExplanation('qualityTemp'));
document.getElementById('card-quality-day').addEventListener('click', () => showExplanation('qualityDay'));
document.getElementById('card-ph').addEventListener('click', () => showExplanation('phChart'));
