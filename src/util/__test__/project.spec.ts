require('dotenv').config({ path: '.env' });
import { ProjectItem } from '../../interface';
import { saveProject } from '../project';
import { v4 as uuidV4 } from 'uuid';

describe('saveItem', () => {
  it('saveItem can operate correctly', async () => {
    const uuid = uuidV4();
    const project: ProjectItem = {
      name: uuid,
      path: '/Users/liu/我的项目/project-cli',
      execUnit: {},
    };
    const res = await saveProject(uuid, project);
    expect(res).toBeDefined();
  });
});
