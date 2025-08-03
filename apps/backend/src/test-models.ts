import sequelizeConnection from './database/connection';
import models from './database/models';

const { User, Product, Cart, CartItem } = models;

async function testModels() {
  try {
    console.log('🔄 Iniciando pruebas de modelos...\n');

    //Probar conexión
    console.log('1️⃣ Probando conexión a la base de datos...');
    await sequelizeConnection.authenticate();
    console.log('✅ Conexión exitosa\n');

    //Probar sincronización de modelos
    console.log('2️⃣ Probando sincronización de modelos...');
    await sequelizeConnection.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente\n');

    //Probar creación de un usuario
    console.log('3️⃣ Probando creación de usuario...');
    const testUser = await User.create({
      name: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('✅ Usuario creado:', testUser.toJSON());

    //Probar creación de un producto
    console.log('\n4️⃣ Probando creación de producto...');
    const testProduct = await Product.create({
      name: 'Producto Test',
      description: 'Descripción del producto test',
      price: 1000
    });
    console.log('✅ Producto creado:', testProduct.toJSON());

    //Probar creación de un carrito
    console.log('\n5️⃣ Probando creación de carrito...');
    const testCart = await Cart.create({
      userId: testUser.id,
      totalAmount: 0
    });
    console.log('✅ Carrito creado:', testCart.toJSON());

    //Probar creación de un item del carrito
    console.log('\n6️⃣ Probando creación de item del carrito...');
    const testCartItem = await CartItem.create({
      cartId: testCart.id,
      productId: testProduct.id,
      quantity: 2,
      price: testProduct.price
    });
    console.log('✅ Item del carrito creado:', testCartItem.toJSON());

    //Probar consultas con asociaciones
    console.log('\n7️⃣ Probando consultas con asociaciones...');
    const cartWithItems = await Cart.findOne({
      where: { id: testCart.id },
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });
    console.log('✅ Consulta con asociaciones exitosa');
    console.log('Carrito con items:', JSON.stringify(cartWithItems?.toJSON(), null, 2));

    //Limpiar datos de prueba
    console.log('\n8️⃣ Limpiando datos de prueba...');
    await CartItem.destroy({ where: { id: testCartItem.id } });
    await Cart.destroy({ where: { id: testCart.id } });
    await Product.destroy({ where: { id: testProduct.id } });
    await User.destroy({ where: { id: testUser.id } });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n�� ¡Todas las pruebas pasaron exitosamente!');
    console.log('✅ Base de datos configurada correctamente');
    console.log('✅ Modelos funcionando correctamente');
    console.log('✅ Asociaciones configuradas correctamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await sequelizeConnection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

testModels();