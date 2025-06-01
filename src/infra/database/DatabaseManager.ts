import AppDataSource from '../../config/dataSource';

class DatabaseManager {
  async connect(): Promise<void> {
    console.log('Connecting to the database...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
        .then(() => {
          console.log('Database connected!');
        })
        .catch((error) => {
          console.log('Database connection failed!', error);
        });
    } else {
      console.log('Database connected!');
    }
  }

  async repository(entity: Function): Promise<any> {
    if (!AppDataSource.isInitialized) {
      await this.connect();
    }
    return AppDataSource.getRepository(entity);
  }
}

export default new DatabaseManager();
