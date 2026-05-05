import './bootstrap';

const STORAGE_KEY = 'census-desk-records';
const ageGroups = [
    { label: '0-14', min: 0, max: 14 },
    { label: '15-24', min: 15, max: 24 },
    { label: '25-44', min: 25, max: 44 },
    { label: '45-64', min: 45, max: 64 },
    { label: '65+', min: 65, max: Infinity },
];

const form = document.querySelector('#censusForm');
const resetForm = document.querySelector('#resetForm');
const clearRecords = document.querySelector('#clearRecords');
const exportCsv = document.querySelector('#exportCsv');
const searchRecords = document.querySelector('#searchRecords');
const recordsTable = document.querySelector('#recordsTable');
const emptyState = document.querySelector('#emptyState');

const totalRecords = document.querySelector('#totalRecords');
const uniqueNationalities = document.querySelector('#uniqueNationalities');
const lastUpdated = document.querySelector('#lastUpdated');

const charts = {
    age: document.querySelector('#ageChart'),
    sex: document.querySelector('#sexChart'),
    nationality: document.querySelector('#nationalityChart'),
};

let records = loadRecords();

function loadRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
        return [];
    }
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getAgeGroup(age) {
    return ageGroups.find((group) => age >= group.min && age <= group.max)?.label ?? 'Unknown';
}

function normalizeText(value) {
    return value.trim().replace(/\s+/g, ' ');
}

function countBy(items, getter) {
    return items.reduce((summary, item) => {
        const key = getter(item) || 'Unknown';
        summary[key] = (summary[key] ?? 0) + 1;
        return summary;
    }, {});
}

function renderBarList(container, summary) {
    const entries = Object.entries(summary).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const max = Math.max(...entries.map(([, count]) => count), 1);

    container.innerHTML = entries.length
        ? entries.map(([label, count]) => {
            const percent = Math.round((count / max) * 100);

            return `
                <div class="bar-row">
                    <div class="bar-meta">
                        <span>${escapeHtml(label)}</span>
                        <span>${count}</span>
                    </div>
                    <div class="bar-track" aria-hidden="true">
                        <div class="bar-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p class="empty-state">No data yet.</p>';
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function renderStats() {
    totalRecords.textContent = records.length;
    uniqueNationalities.textContent = new Set(records.map((record) => record.nationality.toLowerCase())).size;

    const latest = records[0]?.createdAt;
    lastUpdated.textContent = latest
        ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(latest))
        : 'Never';
}

function renderCharts() {
    renderBarList(charts.age, countBy(records, (record) => getAgeGroup(record.age)));
    renderBarList(charts.sex, countBy(records, (record) => record.sex));
    renderBarList(charts.nationality, countBy(records, (record) => record.nationality));
}

function renderTable() {
    const query = searchRecords.value.trim().toLowerCase();
    const visibleRecords = records.filter((record) => {
        return [record.name, record.nationality, record.location, record.sex]
            .join(' ')
            .toLowerCase()
            .includes(query);
    });

    recordsTable.innerHTML = visibleRecords.map((record) => `
        <tr>
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(getAgeGroup(record.age))} <span class="muted">(${record.age})</span></td>
            <td>${escapeHtml(record.sex)}</td>
            <td>${escapeHtml(record.nationality)}</td>
            <td>${escapeHtml(record.location || 'Not specified')}</td>
        </tr>
    `).join('');

    emptyState.classList.toggle('is-hidden', records.length > 0);
}

function render() {
    renderStats();
    renderCharts();
    renderTable();
}

function downloadCsv() {
    if (!records.length) {
        return;
    }

    const headers = ['Name', 'Age', 'Age group', 'Sex', 'Nationality', 'Location', 'Created at'];
    const rows = records.map((record) => [
        record.name,
        record.age,
        getAgeGroup(record.age),
        record.sex,
        record.nationality,
        record.location,
        record.createdAt,
    ]);

    const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `census-records-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const age = Number(data.get('age'));

    if (!Number.isInteger(age) || age < 0 || age > 120) {
        form.age.focus();
        return;
    }

    records = [
        {
            id: crypto.randomUUID(),
            name: normalizeText(data.get('name')),
            age,
            sex: data.get('sex'),
            nationality: normalizeText(data.get('nationality')),
            location: normalizeText(data.get('location') || ''),
            createdAt: new Date().toISOString(),
        },
        ...records,
    ];

    saveRecords();
    form.reset();
    form.name.focus();
    render();
});

resetForm.addEventListener('click', () => {
    form.reset();
    form.name.focus();
});

clearRecords.addEventListener('click', () => {
    if (!records.length || !confirm('Delete all census records from this device?')) {
        return;
    }

    records = [];
    saveRecords();
    render();
});

exportCsv.addEventListener('click', downloadCsv);
searchRecords.addEventListener('input', renderTable);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

render();
