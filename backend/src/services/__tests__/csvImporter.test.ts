import { importCsv } from '../csvImporter';
import { Person } from '../../models/Person';
import { Location } from '../../models/Location';
import { Affiliation } from '../../models/Affiliation';

describe('CSV Importer', () => {
  beforeEach(async () => {
    await Person.destroy({ where: {} });
    await Location.destroy({ where: {} });
    await Affiliation.destroy({ where: {} });
  });

  it('should import CSV data correctly', async () => {
    const csvData = 
      'Name,Location,Affiliations,Weapon,Vehicle\n' +
      'John Doe,New York,Rebels,Sword,Car';
    
    const buffer = Buffer.from(csvData);
    await importCsv(buffer);

    const person = await Person.findOne({
      where: { first_name: 'John' },
      include: [Location, Affiliation]
    });

    expect(person).toBeTruthy();
    expect(person?.first_name).toBe('John');
    expect(person?.last_name).toBe('Doe');
    expect(person?.weapon).toBe('Sword');
    expect(person?.vehicle).toBe('Car');
    expect(person?.locations[0].name).toBe('New York');
    expect(person?.affiliations[0].name).toBe('Rebels');
  });
});
