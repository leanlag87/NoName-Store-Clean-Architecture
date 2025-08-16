import sequelizeConnection from "./database/connection";

async function testConnection() {
  try {
    await sequelizeConnection.authenticate();
    console.log("✅ Conexión a la base de datos correctamente.");
  } catch (error) {
    console.log("❌ Error al conectar a la base de datos:", error);
  } finally {
    await sequelizeConnection.close();
  }
}

testConnection();
