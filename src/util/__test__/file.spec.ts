require('dotenv').config({ path: '.env' });
import { ProjectItem } from '../../interface';
import { saveProject } from '../file';
import { readJSON } from 'fs-extra';
import { v4 as uuidV4 } from 'uuid';

describe('saveItem', () => {
  it('saveItem can operate correctly', async () => {
    const uuid = uuidV4();
    const project: ProjectItem = {
      name: uuid,
      path: '/Users/liu/我的项目/project-cli',
      excuUnit: {},
    };
    const res = await saveProject(uuid, project);
    const newJson = await readJSON('./config.json');
    expect(res).toEqual(newJson);
  });
});
