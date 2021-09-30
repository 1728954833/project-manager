import { readJSON } from 'fs-extra'
import { userSettingPath } from '../constant/file'

export const getUserSetting = () => {
  return readJSON(userSettingPath)
}
