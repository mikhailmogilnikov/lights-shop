import { prisma } from '~prisma/client';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Incandescent Bulb E27 60W',
    price: 59,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/964/wcmbzdan7q9ze4klez8gw2fhgnowo12g/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-matovaya-3320300.jpg',
    stockQuantity: 1000,
  },
  {
    id: '2',
    name: 'Incandescent Bulb E27 100W',
    price: 69,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/c74/630_630_1/vamsvet-lampa-nakalivaniya-uniel-e14-15w-prozrachnaya-il-f22-cl-15-e14-ul-00002327.jpeg',
    stockQuantity: 10,
  },
  {
    id: '3',
    name: 'Incandescent Bulb E14 40W',
    price: 49,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/f40/ihxbtlzme3p8oe6tjf3nvivbwfe7xs19/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-matovaya-3320560.jpg',
    stockQuantity: 213,
  },
  {
    id: '4',
    name: 'Incandescent Globe Bulb G95 40W',
    price: 89,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/4ba/xiw8l37qyjxewmx6x6lufnd2d8kk4aoa/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-matovaya-3321437.jpg',
    stockQuantity: 421,
  },
  {
    id: '5',
    name: 'Incandescent Candle Bulb E14 25W',
    price: 55,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/da4/pds9we5r970z5sbh6wv6uwgcxpzjv3qz/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-prozrachnaya-3320263.jpg',
    stockQuantity: 4123,
  },
  {
    id: '6',
    name: 'Incandescent Tubular Bulb T45 40W',
    price: 79,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/44a/zqq4e290p0gzq9r894lpjrwl3ania7rx/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-prozrachnaya-3320546.jpg',
    stockQuantity: 2,
  },
  {
    id: '7',
    name: 'Incandescent Reflector Bulb R63 60W',
    price: 99,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/9c5/x61psy7krh2wlnknbe3ourred2qxinhz/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-40w-2700k-prozrachnaya-3326623.jpg',
    stockQuantity: 1,
  },
  {
    id: '8',
    name: 'Incandescent Bulb E27 25W',
    price: 45,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/71e/8jagsz3twadw1y8v82n422jtoz4ptakj/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-60w-2700k-matovaya-3320324.jpg',
    stockQuantity: 32,
  },
  {
    id: '9',
    name: 'Incandescent Bulb E14 15W',
    price: 39,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/144/gwm9b7jfdjp9kgpb7s6qkjmooc0ohgrl/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-60w-2700k-matovaya-3320362.jpg',
    stockQuantity: 65,
  },
  {
    id: '10',
    name: 'Incandescent Globe Bulb G80 60W',
    price: 95,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/cb1/wjojpzan5bx18g4k4qrzptbnlevte13y/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-30w-2700k-matovaya-3321390.jpg',
    stockQuantity: 10040,
  },
  {
    id: '11',
    name: 'Incandescent Bulb B22 60W',
    price: 59,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/01d/qgx324z2ah12pyr7ltvt1sxssbc27cce/230_230_0/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-matovaya-3321413.jpg',
    stockQuantity: 23,
  },
  {
    id: '12',
    name: 'Incandescent Bulb E27 200W',
    price: 119,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/360/ghuwsegpu449zaq1ast1epp488rkebvx/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-60w-2700k-matovaya-3321444.jpg',
    stockQuantity: 124,
  },
  {
    id: '13',
    name: 'Incandescent Bulb E14 60W',
    price: 65,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/cb1/wjojpzan5bx18g4k4qrzptbnlevte13y/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-30w-2700k-matovaya-3321390.jpg',
    stockQuantity: 1000,
  },
  {
    id: '14',
    name: 'Incandescent Bulb E27 15W',
    price: 39,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/9a7/wcih68sjn8fkyv80oek75piw9lgh6b1e/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-matovaya-3320294.jpg',
    stockQuantity: 11,
  },
  {
    id: '15',
    name: 'Incandescent Bulb E14 25W',
    price: 49,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/d38/9tm908ntr271j7sw78pbd3bl3u3xbkmr/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-matovaya-3320515.jpg',
    stockQuantity: 3,
  },
  {
    id: '16',
    name: 'Incandescent Bulb B22 100W',
    price: 79,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/9b2/kfbuiccq873hc2bg6pu02gssj4n4cszr/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-matovaya-3321475.jpg',
    stockQuantity: 412,
  },
  {
    id: '17',
    name: 'Incandescent Bulb E27 75W',
    price: 69,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/01d/qgx324z2ah12pyr7ltvt1sxssbc27cce/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-matovaya-3321413.jpg',
    stockQuantity: 23,
  },
  {
    id: '18',
    name: 'Incandescent Bulb E14 40W',
    price: 55,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/ee9/xofvzlpncgsi4qontt1rxy6jinzts2md/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-prozrachnaya-3320256.jpg',
    stockQuantity: 1224,
  },
  {
    id: '19',
    name: 'Incandescent Bulb E27 150W',
    price: 109,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/203/hptfrwjhhwvtv6tz8u356e7rl8z54jbz/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e14-40w-2700k-prozrachnaya-3320539.jpg',
    stockQuantity: 2222,
  },
  {
    id: '20',
    name: 'Incandescent Bulb E14 100W',
    price: 89,
    imageUrl:
      'https://www.vamsvet.ru/upload/resize_cache/iblock/cf1/swhxk3j2ox7cefc2jhlgz6ww9a9kg02e/630_630_1/vamsvet-lampa-nakalivaniya-jazzway-e27-60w-2700k-prozrachnaya-3320287.jpg',
    stockQuantity: 2,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Проверяем наличие продуктов в базе
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length > 0) {
      console.log(`⚠️ Found ${existingProducts.length} existing products in the database`);

      // Спрашиваем окружение, нужно ли очистить таблицу
      const shouldReset = process.env.RESET_DATABASE === 'true';

      if (shouldReset) {
        console.log('🗑️ Cleaning product table...');
        await prisma.product.deleteMany({});
        console.log('✅ Product table cleaned');
      } else {
        console.log('⏭️ Skipping seeding as products already exist (set RESET_DATABASE=true to force reset)');
        process.exit(0);
      }
    }

    // Создаем новые продукты
    console.log(`📝 Creating ${MOCK_PRODUCTS.length} products...`);

    const createPromises = MOCK_PRODUCTS.map(async (product) => {
      await prisma.product.create({
        data: {
          ...product,
          // Генерируем даты
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    });

    await Promise.all(createPromises);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
