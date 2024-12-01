import { parse } from 'csv-parse';
import { Person } from '../models/Person';
import { Location } from '../models/Location';
import { Affiliation } from '../models/Affiliation';
import { titleCase } from '../utils/stringUtils';
import { sanitizeString } from '../utils/sanitizer';

interface CsvRow {
  Name: string;
  Location: string;
  Affiliations: string;
  Weapon?: string;
  Vehicle?: string;
}

const splitName = (fullName: string): { firstName: string; lastName: string | null } => {
  const parts = fullName.split(' ').map(part => titleCase(part.trim()));
  return parts.length === 1 ? { firstName: parts[0], lastName: null } : {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

export const importCsv = async (fileBuffer: Buffer): Promise<void> => {
  const records: CsvRow[] = await new Promise((resolve, reject) => {
    const results: CsvRow[] = [];
    parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
    })
      .on('data', (data) => results.push(data))
      .on('error', reject)
      .on('end', () => resolve(results));
  });

  for (const record of records) {
    try {
      if (!record.Affiliations) {
        console.log('Skipping record: Missing affiliations', record);
        continue;
      }

      const { firstName, lastName } = splitName(record.Name);
      if (!firstName || !lastName) {
        console.log('Skipping record: Invalid name format', record);
        continue;
      }

      const locationNames = record.Location
        .split(',')
        .map((loc) => sanitizeString(titleCase(loc.trim())))
        .filter(Boolean);

      const locations = await Promise.all(
        locationNames.map((name) => Location.findOrCreate({ where: { name } }))
      );

      const affiliationNames = record.Affiliations
        .split(',')
        .map((aff) => sanitizeString(titleCase(aff.trim())))
        .filter(Boolean);

      const affiliations = await Promise.all(
        affiliationNames.map((name) => Affiliation.findOrCreate({ where: { name } }))
      );

      const personData = {
        first_name: sanitizeString(firstName),
        last_name: sanitizeString(lastName),
        weapon: sanitizeString(record.Weapon),
        vehicle: sanitizeString(record.Vehicle)
      };

      const person = await Person.create(personData);
      await person.$set('locations', locations.map(([location]) => location));
      await person.$set('affiliations', affiliations.map(([affiliation]) => affiliation));
    } catch (error) {
      console.error('Error processing record:', error);
    }
  }
};
