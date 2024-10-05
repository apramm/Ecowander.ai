# Data Sent From The Frontend
```json
{
  "startLocation": string, // e.g. "Paris, France" (city, country)
  "endLocation": string, // e.g. "New York, United States" (city, country)
  "startDate": string, // e.g. 2024-02-27
  "endDate": string,
  "budgetInDollars": integer, // e.g. 3323233
  "numberOfPeople": integer,
  "scheduleGranularity": integer, // 1, 4, 8, 24 (i.e. 1 hour, 4 hours, 8 hours, 24 hours)
  "mustSeeAttractions": string[],
  "additionalInfo": string,
}
```
