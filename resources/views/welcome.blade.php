<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0f766e">
    <meta name="description" content="A progressive web app for taking and summarizing individual census records.">
    <title>Census Desk</title>
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.svg">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <main class="app-shell">
        <section class="hero-panel" aria-labelledby="app-title">
            <div>
                <p class="eyebrow">Progressive census app</p>
                <h1 id="app-title">Census Desk</h1>
                <p class="hero-copy">Capture individual records offline and review the population by age group, sex, and nationality.</p>
            </div>
            <div class="hero-stats" aria-label="Census totals">
                <div>
                    <span id="totalRecords">0</span>
                    <small>People counted</small>
                </div>
                <div>
                    <span id="uniqueNationalities">0</span>
                    <small>Nationalities</small>
                </div>
                <div>
                    <span id="lastUpdated">Never</span>
                    <small>Last update</small>
                </div>
            </div>
        </section>

        <section class="workspace">
            <form id="censusForm" class="entry-panel" autocomplete="off">
                <div class="section-title">
                    <p class="eyebrow">New record</p>
                    <h2>Resident details</h2>
                </div>

                <label>
                    Full name
                    <input name="name" type="text" placeholder="Example: Amina Bello" required>
                </label>

                <div class="field-row">
                    <label>
                        Age
                        <input name="age" type="number" min="0" max="120" placeholder="28" required>
                    </label>
                    <label>
                        Sex
                        <select name="sex" required>
                            <option value="">Select</option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                        </select>
                    </label>
                </div>

                <label>
                    Nationality
                    <input name="nationality" type="text" placeholder="Example: Cameroonian" required>
                </label>

                <label>
                    Location or household
                    <input name="location" type="text" placeholder="Quarter, street, or household code">
                </label>

                <div class="form-actions">
                    <button type="submit" class="primary-button">Add person</button>
                    <button type="button" id="resetForm" class="ghost-button">Clear form</button>
                </div>
            </form>

            <section class="insights-panel" aria-labelledby="summary-title">
                <div class="summary-header">
                    <div>
                        <p class="eyebrow">Live summary</p>
                        <h2 id="summary-title">Population breakdown</h2>
                    </div>
                    <div class="summary-actions">
                        <button id="exportCsv" type="button" class="icon-button" title="Export CSV" aria-label="Export CSV">CSV</button>
                        <button id="clearRecords" type="button" class="icon-button danger" title="Delete all records" aria-label="Delete all records">Clear</button>
                    </div>
                </div>

                <div class="charts-grid">
                    <article class="chart-block">
                        <h3>Age groups</h3>
                        <div id="ageChart" class="bar-list" aria-live="polite"></div>
                    </article>
                    <article class="chart-block">
                        <h3>Sex</h3>
                        <div id="sexChart" class="bar-list" aria-live="polite"></div>
                    </article>
                    <article class="chart-block">
                        <h3>Nationality</h3>
                        <div id="nationalityChart" class="bar-list" aria-live="polite"></div>
                    </article>
                </div>
            </section>
        </section>

        <section class="records-panel" aria-labelledby="records-title">
            <div class="records-header">
                <div>
                    <p class="eyebrow">Collected entries</p>
                    <h2 id="records-title">Recent records</h2>
                </div>
                <label class="search-field">
                    Search
                    <input id="searchRecords" type="search" placeholder="Name, nationality, location">
                </label>
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age group</th>
                            <th>Sex</th>
                            <th>Nationality</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody id="recordsTable"></tbody>
                </table>
            </div>
            <p id="emptyState" class="empty-state">No records yet. Add the first person to begin the census.</p>
        </section>
    </main>
</body>
</html>
