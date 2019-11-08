const db = require('./models');

const { vegetable: Vegetable, gardener: Gardener, plot: Plot } = db.models;

const vegetableData = [
  { name: 'Carrot', color: 'orange' },
  { name: 'Tomato', color: 'red' },
  { name: 'Lemon', color: 'yellow' }
];

const gardenerData = [
  { name: 'Ozlem', age: 32 },
  { name: 'Paul', age: 39 },
  { name: 'Rich', age: 70 }
];

const plotData = [
  { size: 20, shaded: true },
  { size: 40, shaded: false },
  { size: 10, shaded: true }
];

const seed = async () => {
  try {
    await db.sync({ force: true }); // make this one false when you are sure, you dont want to delete your db whn you make changes
    console.log('Database synced!');

    const insertedData =  Promise.all([
      Vegetable.bulkCreate(vegetableData, { returning: true }), //this one does not have any foreign key, so it should be created first!
      Gardener.bulkCreate(gardenerData, { returning: true }),
      Plot.bulkCreate(plotData, { returning: true })
    ]);

    const [vegetables, gardeners, plots] = await insertedData;
    const [carrot, tomato, lemon] = vegetables;
    const [ozlem, paul, rich] = gardeners;
    const [ozlemPlot, paulPlot, richPlot] = plots;

    await Promise.all([
      ozlem.setFavoriteVegetable(lemon),
      ozlemPlot.setGardener(ozlem),
      ozlemPlot.setVegetables([tomato, lemon, carrot]),

      paul.setFavoriteVegetable(carrot),
      paulPlot.setGardener(paul),
      paulPlot.setVegetables([tomato]),

      rich.setFavoriteVegetable(carrot),
      richPlot.setGardener(rich),
      richPlot.setVegetables([tomato, lemon, carrot])
    ]);

    console.log('database seeded! Yey!');
  } catch (err) {
    console.log('Upps! Something went wrong!');
    console.log(err);
  } finally {
    console.log('Closing the database connection!');
    db.close();
  }
};

seed();

// db.sync({ force: true })
//   .then(() => {
//     console.log('Database synced!');
//     // db.close() // only if using a version of node without `finally`
//   })
//   .catch((err) => {
//     console.log('Disaster! Something went wrong! ');
//     console.log(err);
//     // db.close() // only if using a version of node without `finally`
//   })
//   .finally(() => {
//     // only if using a version of node WITH `finally`
//     db.close();
//   });
