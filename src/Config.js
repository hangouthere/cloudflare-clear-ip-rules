import * as Conf from 'conf';

export const ConfigStore = new Conf({
  cwd: __dirname,
  configName: '.config'
});

export const BuildConfig = ({ email, token }) => ({
  token: token ? token : ConfigStore.get('token'),
  email: email ? email : ConfigStore.get('email')
});
