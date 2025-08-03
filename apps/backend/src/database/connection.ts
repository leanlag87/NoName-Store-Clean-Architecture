
import { Dialect, Sequelize } from 'sequelize';
import env from '../env';

const {db: {dialect, host, name, password, port, username}} = env;

let sequelizeConnection: Sequelize = new Sequelize(name, username, password, {
  host,
  dialect: dialect as Dialect,
  port: +port,
  logging: false
});

export default sequelizeConnection;