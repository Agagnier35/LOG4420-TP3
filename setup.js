const MongoClient = require("mongodb").MongoClient;
const yaml = require("js-yaml");
const fs = require("fs");
const config = require("./config.json");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

const readFile = async path => {
  const yamlFile = await readFileAsync(path, "utf8").catch(err =>
    console.log(err)
  );
  const yamlOpt = yaml.safeLoad(yamlFile);
  return yamlOpt || [];
};

const insertFileIntoDB = async (path, db, collectionName) => {
  const data = await readFile(path);
  const filteredData = data.map(d => {
    const { key, ...rest } = d;
    return { ...rest };
  });

  const res = await db
    .collection(collectionName)
    .insertMany(filteredData)
    .catch(err => console.log(err));
  console.log(
    `Inserted ${res.insertedCount} entries into collection ${collectionName}`
  );
};

const insertDataIntoMongo = async () => {
  const client = await MongoClient.connect(config.dbUrl, {
    useNewUrlParser: true
  }).catch(err => console.log(err));

  try {
    //1. Connect
    const db = await client.db(config.dbName);
    //2. Remove all collections
    await db
      .listCollections(undefined, { nameOnly: true })
      .forEach(c => db.collection(c.name).drop());
    //3. Migrate data
    await insertFileIntoDB("./data/news.yml", db, "news");
    await insertFileIntoDB("./data/seminars.yml", db, "seminars");
    await insertFileIntoDB("./data/team.yml", db, "members");

    //4. Insert project & publications with relation
    const dataPublications = await readFile("./data/publications.yml");
    const filteredPublications = dataPublications.map(p => {
      const { key, ...rest } = p;
      return { ...rest };
    });
    const dataProjects = await readFile("./data/projects.yml");

    const { insertedIds, insertedCount } = await db
      .collection("publications")
      .insertMany(filteredPublications)
      .catch(err => console.log(err));
    console.log(
      `Inserted ${insertedCount} entries into collection publications`
    );

    const rebuiltPublications = Object.values(insertedIds).map((id, index) => ({
      _id: id,
      ...dataPublications[index]
    }));

    const linkedProjects = dataProjects.map(p => {
      const { publications, ...rest } = p;
      const linkedPublications = publications
        ? publications.map(
            pub => rebuiltPublications.find(rb => rb.key === pub)._id
          )
        : [];
      return { ...rest, publications: linkedPublications };
    });

    const { insertedCount: insertedCountProj } = await db
      .collection("projects")
      .insertMany(linkedProjects)
      .catch(err => console.log(err));
    console.log(
      `Inserted ${insertedCountProj} entries into collection projects`
    );
  } finally {
    client && client.close();
  }
};

insertDataIntoMongo();
