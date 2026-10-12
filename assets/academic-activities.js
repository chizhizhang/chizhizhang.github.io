'use strict';
const activitySearch = document.getElementById('activity-search');
const activitySections = Array.from(document.querySelectorAll('.activity-section'));
const activityRecords = Array.from(document.querySelectorAll('.activity-record'));
const activityResults = document.getElementById('activity-results');
const activityNavigation = document.querySelector('.activity-navigation');
if (window.matchMedia('(max-width: 991.98px)').matches) activityNavigation.open = false;
function filterActivities() {
  const query = activitySearch.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const record of activityRecords) {
    record.hidden = query !== '' && !record.textContent.toLocaleLowerCase().includes(query);
    if (!record.hidden) visible++;
  }
  for (const section of activitySections) {
    section.hidden = !Array.from(section.querySelectorAll('.activity-record')).some(record => !record.hidden);
  }
  activityResults.textContent = query ? `${visible} of ${activityRecords.length} records` : `${activityRecords.length} records`;
  document.getElementById('activity-empty').hidden = visible !== 0;
}
activitySearch.addEventListener('input', filterActivities);
activityNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if (activitySearch.value) { activitySearch.value = ''; filterActivities(); }
  if (window.matchMedia('(max-width: 991.98px)').matches) activityNavigation.open = false;
}));
filterActivities();
