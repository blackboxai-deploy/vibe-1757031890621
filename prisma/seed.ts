import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'PLATO Demo Restaurant',
      slug: 'demo',
      subdomain: 'demo',
      logo: 'https://placehold.co/200x80?text=PLATO+DEMO+RESTAURANT+LOGO',
      primaryColor: '#f97316',
      secondaryColor: '#fed7aa',
      fontFamily: 'Inter',
      isActive: true,
    },
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create demo restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'demo-restaurant' },
    update: {},
    create: {
      id: 'demo-restaurant',
      tenantId: tenant.id,
      name: 'PLATO Demo Bistro',
      description: 'A cozy bistro offering fresh, locally-sourced dishes',
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      phone: '(11) 99999-9999',
      email: 'contact@platodemo.com',
      openingHours: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '11:00', close: '23:00', closed: false },
        sunday: { open: '12:00', close: '21:00', closed: false },
      },
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
    },
  })

  console.log('✅ Created restaurant:', restaurant.name)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@platodemo.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      email: 'admin@platodemo.com',
      name: 'Restaurant Admin',
      phone: '(11) 88888-8888',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create areas
  const mainArea = await prisma.area.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Salão Principal',
      description: 'Área principal do restaurante',
      sortOrder: 1,
    },
  })

  const terrace = await prisma.area.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Terraço',
      description: 'Área externa com vista',
      sortOrder: 2,
    },
  })

  console.log('✅ Created areas')

  // Create tables
  const tables = []
  for (let i = 1; i <= 12; i++) {
    const area = i <= 8 ? mainArea : terrace
    const capacity = [2, 4, 4, 6][Math.floor(Math.random() * 4)]
    
    const table = await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        areaId: area.id,
        number: i.toString().padStart(2, '0'),
        capacity,
        qrToken: `table-${i.toString().padStart(2, '0')}-${Math.random().toString(36).substring(7)}`,
        status: 'AVAILABLE',
      },
    })
    tables.push(table)
  }

  console.log('✅ Created 12 tables')

  // Create kitchen stations
  const kitchenStation = await prisma.station.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Cozinha Principal',
      description: 'Estação principal da cozinha',
      type: 'KITCHEN',
      sortOrder: 1,
    },
  })

  const barStation = await prisma.station.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Bar',
      description: 'Estação de bebidas e drinks',
      type: 'BAR',
      sortOrder: 2,
    },
  })

  const dessertStation = await prisma.station.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Sobremesas',
      description: 'Estação de sobremesas e doces',
      type: 'DESSERT',
      sortOrder: 3,
    },
  })

  console.log('✅ Created kitchen stations')

  // Create menu
  const menu = await prisma.menu.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Menu Principal',
      description: 'Nosso menu completo com pratos selecionados',
      isActive: true,
    },
  })

  console.log('✅ Created menu')

  // Create categories
  const appetizers = await prisma.category.create({
    data: {
      menuId: menu.id,
      name: 'Entradas',
      description: 'Deliciosas opções para começar sua refeição',
      image: 'https://placehold.co/400x300?text=Fresh+appetizers+and+starters+beautifully+plated',
      sortOrder: 1,
    },
  })

  const mains = await prisma.category.create({
    data: {
      menuId: menu.id,
      name: 'Pratos Principais',
      description: 'Nossos pratos principais irresistíveis',
      image: 'https://placehold.co/400x300?text=Gourmet+main+dishes+with+elegant+presentation',
      sortOrder: 2,
    },
  })

  const drinks = await prisma.category.create({
    data: {
      menuId: menu.id,
      name: 'Bebidas',
      description: 'Drinks, sucos e bebidas refrescantes',
      image: 'https://placehold.co/400x300?text=Refreshing+drinks+and+cocktails+collection',
      sortOrder: 3,
    },
  })

  const desserts = await prisma.category.create({
    data: {
      menuId: menu.id,
      name: 'Sobremesas',
      description: 'Doces e sobremesas irresistíveis',
      image: 'https://placehold.co/400x300?text=Decadent+desserts+and+sweet+treats',
      sortOrder: 4,
    },
  })

  console.log('✅ Created categories')

  // Create sample items
  const bruschetta = await prisma.item.create({
    data: {
      categoryId: appetizers.id,
      name: 'Bruschetta Italiana',
      description: 'Fatias de pão italiano tostado com tomate fresco, manjericão e azeite extra virgem',
      image: 'https://placehold.co/400x300?text=Italian+bruschetta+with+fresh+tomatoes+and+basil',
      basePrice: 18.90,
      sortOrder: 1,
      allergens: ['glúten'],
      tags: ['vegetariano', 'italiano'],
      calories: 150,
      prepTime: 10,
    },
  })

  const carpaccio = await prisma.item.create({
    data: {
      categoryId: appetizers.id,
      name: 'Carpaccio de Salmão',
      description: 'Finas fatias de salmão fresco com alcaparras, rúcula e molho de mostarda e mel',
      image: 'https://placehold.co/400x300?text=Fresh+salmon+carpaccio+with+arugula+and+capers',
      basePrice: 32.90,
      sortOrder: 2,
      allergens: ['peixe'],
      tags: ['peixe', 'gourmet'],
      calories: 180,
      prepTime: 15,
    },
  })

  // Create variations for bruschetta
  await prisma.variation.create({
    data: {
      itemId: bruschetta.id,
      name: 'Porção Individual',
      description: '2 unidades',
      priceChange: 0,
      isDefault: true,
      sortOrder: 1,
    },
  })

  await prisma.variation.create({
    data: {
      itemId: bruschetta.id,
      name: 'Porção para Compartilhar',
      description: '4 unidades',
      priceChange: 12.90,
      sortOrder: 2,
    },
  })

  // Create modifiers for appetizers
  await prisma.modifier.create({
    data: {
      itemId: bruschetta.id,
      name: 'Extra Manjericão',
      description: 'Adicione mais manjericão fresco',
      priceChange: 2.50,
      type: 'ADDON',
      sortOrder: 1,
    },
  })

  await prisma.modifier.create({
    data: {
      itemId: bruschetta.id,
      name: 'Sem Alho',
      description: 'Remover o alho da preparação',
      priceChange: 0,
      type: 'REMOVAL',
      sortOrder: 2,
    },
  })

  // Main dishes
  const risotto = await prisma.item.create({
    data: {
      categoryId: mains.id,
      name: 'Risotto de Camarão',
      description: 'Cremoso risotto de arbório com camarões frescos, aspargos e parmesão',
      image: 'https://placehold.co/400x300?text=Creamy+shrimp+risotto+with+asparagus+and+parmesan',
      basePrice: 68.90,
      sortOrder: 1,
      allergens: ['frutos do mar', 'laticínios'],
      tags: ['frutos do mar', 'cremoso', 'italiano'],
      calories: 520,
      prepTime: 25,
    },
  })

  const steak = await prisma.item.create({
    data: {
      categoryId: mains.id,
      name: 'Bife Ancho Grelhado',
      description: 'Suculento bife ancho grelhado acompanhado de batatas rústicas e salada verde',
      image: 'https://placehold.co/400x300?text=Grilled+ancho+steak+with+rustic+potatoes+and+salad',
      basePrice: 89.90,
      sortOrder: 2,
      allergens: [],
      tags: ['carne', 'grelhado'],
      calories: 680,
      prepTime: 20,
    },
  })

  // Steak cooking variations
  await prisma.variation.create({
    data: {
      itemId: steak.id,
      name: 'Mal Passado',
      description: 'Carne bem vermelha no interior',
      priceChange: 0,
      sortOrder: 1,
    },
  })

  await prisma.variation.create({
    data: {
      itemId: steak.id,
      name: 'Ao Ponto',
      description: 'Carne rosada no interior',
      priceChange: 0,
      isDefault: true,
      sortOrder: 2,
    },
  })

  await prisma.variation.create({
    data: {
      itemId: steak.id,
      name: 'Bem Passado',
      description: 'Carne completamente cozida',
      priceChange: 0,
      sortOrder: 3,
    },
  })

  // Drinks
  const caipirinha = await prisma.item.create({
    data: {
      categoryId: drinks.id,
      name: 'Caipirinha Tradicional',
      description: 'A clássica caipirinha brasileira com cachaça artesanal, limão e açúcar',
      image: 'https://placehold.co/400x300?text=Traditional+Brazilian+caipirinha+with+fresh+lime',
      basePrice: 24.90,
      sortOrder: 1,
      tags: ['bebida alcoólica', 'brasileiro', 'clássico'],
      prepTime: 5,
    },
  })

  const juice = await prisma.item.create({
    data: {
      categoryId: drinks.id,
      name: 'Suco Natural',
      description: 'Sucos frescos feitos na hora com frutas selecionadas',
      image: 'https://placehold.co/400x300?text=Fresh+natural+fruit+juices+in+glasses',
      basePrice: 12.90,
      sortOrder: 2,
      tags: ['natural', 'sem álcool', 'saudável'],
      prepTime: 3,
    },
  })

  // Juice flavors as variations
  await prisma.variation.create({
    data: {
      itemId: juice.id,
      name: 'Laranja',
      description: 'Suco de laranja natural',
      priceChange: 0,
      isDefault: true,
      sortOrder: 1,
    },
  })

  await prisma.variation.create({
    data: {
      itemId: juice.id,
      name: 'Maracujá',
      description: 'Suco de maracujá natural',
      priceChange: 2.00,
      sortOrder: 2,
    },
  })

  await prisma.variation.create({
    data: {
      itemId: juice.id,
      name: 'Açaí',
      description: 'Suco de açaí natural',
      priceChange: 5.00,
      sortOrder: 3,
    },
  })

  // Desserts
  const tiramisu = await prisma.item.create({
    data: {
      categoryId: desserts.id,
      name: 'Tiramisù da Casa',
      description: 'Tradicional tiramisù italiano com camadas de mascarpone, café e cacau',
      image: 'https://placehold.co/400x300?text=Classic+Italian+tiramisu+with+mascarpone+and+cocoa',
      basePrice: 22.90,
      sortOrder: 1,
      allergens: ['laticínios', 'ovos', 'glúten'],
      tags: ['italiano', 'cremoso', 'café'],
      calories: 380,
      prepTime: 5,
    },
  })

  const brownie = await prisma.item.create({
    data: {
      categoryId: desserts.id,
      name: 'Brownie com Sorvete',
      description: 'Brownie artesanal morno acompanhado de sorvete de baunilha e calda de chocolate',
      image: 'https://placehold.co/400x300?text=Warm+artisan+brownie+with+vanilla+ice+cream',
      basePrice: 19.90,
      sortOrder: 2,
      allergens: ['laticínios', 'ovos', 'glúten', 'nozes'],
      tags: ['chocolate', 'quente', 'sorvete'],
      calories: 450,
      prepTime: 8,
    },
  })

  console.log('✅ Created sample menu items with variations and modifiers')

  // Create sample ingredients for inventory
  const ingredients = await Promise.all([
    prisma.ingredient.create({
      data: {
        name: 'Tomate',
        description: 'Tomate fresco para saladas e pratos',
        unit: 'kg',
        costPerUnit: 8.50,
        currentStock: 25.5,
        minStock: 5.0,
        maxStock: 50.0,
        category: 'Vegetais',
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Camarão',
        description: 'Camarão grande limpo e descascado',
        unit: 'kg',
        costPerUnit: 65.00,
        currentStock: 8.5,
        minStock: 2.0,
        maxStock: 15.0,
        category: 'Frutos do Mar',
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Arroz Arbório',
        description: 'Arroz especial para risotto',
        unit: 'kg',
        costPerUnit: 18.90,
        currentStock: 15.0,
        minStock: 3.0,
        maxStock: 25.0,
        category: 'Grãos',
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Carne Ancho',
        description: 'Bife ancho premium',
        unit: 'kg',
        costPerUnit: 85.00,
        currentStock: 12.3,
        minStock: 5.0,
        maxStock: 20.0,
        category: 'Carnes',
      },
    }),
  ])

  console.log('✅ Created sample ingredients')

  // Create sample recipes
  const risottoRecipe = await prisma.recipe.create({
    data: {
      itemId: risotto.id,
      name: 'Receita Risotto de Camarão',
      description: 'Processo completo para preparar o risotto de camarão',
      instructions: `
1. Aqueça o caldo de camarão
2. Refogue a cebola em azeite
3. Adicione o arroz arbório e tueste por 2 minutos
4. Adicione vinho branco e deixe evaporar
5. Adicione o caldo quente aos poucos, mexendo sempre
6. Na metade do cozimento, adicione os camarões
7. Finalize com manteiga, parmesão e salsinha
      `,
      prepTime: 10,
      cookTime: 25,
      portionSize: 1,
    },
  })

  await Promise.all([
    prisma.recipeIngredient.create({
      data: {
        recipeId: risottoRecipe.id,
        ingredientId: ingredients[1].id, // Camarão
        quantity: 0.2,
        unit: 'kg',
        notes: 'Limpos e descascados',
      },
    }),
    prisma.recipeIngredient.create({
      data: {
        recipeId: risottoRecipe.id,
        ingredientId: ingredients[2].id, // Arroz Arbório
        quantity: 0.15,
        unit: 'kg',
        notes: 'Arroz especial para risotto',
      },
    }),
  ])

  console.log('✅ Created sample recipes with ingredients')

  console.log('🎉 Database seeded successfully!')
  console.log(`
📋 Summary:
- Tenant: ${tenant.name} (${tenant.slug})
- Restaurant: ${restaurant.name}
- Admin user: ${adminUser.email}
- Areas: 2 (${mainArea.name}, ${terrace.name})
- Tables: 12
- Kitchen stations: 3
- Menu categories: 4
- Menu items: 8
- Ingredients: 4
- Recipes: 1

🔗 Access URLs:
- Admin: http://localhost:3000/admin
- Customer Menu: http://localhost:3000/demo/menu
- Table QR: http://localhost:3000/demo/table/01

Login credentials:
- Email: admin@platodemo.com
- Password: (to be implemented with auth)
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })