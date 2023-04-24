const gremlin = require("gremlin");
const express = require("express");
const cors = require("cors");

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const __ = gremlin.process.statics;

const app = express();
app.use(cors());
const PORT = 3000;

const g = traversal().withRemote(
  new DriverRemoteConnection("ws://localhost:8182/gremlin")
);

async function createPeople(name, age, cityId) {
  const personVertex = await g.V().hasLabel("People").has("name", name).next();

  if (personVertex.value) {
    await g.V(personVertex.value.id).addE("belongsTo").to(__.V(cityId)).next();
  } else {
    const newPersonVertex = await g
      .addV("People")
      .property("name", name)
      .property("age", age)
      .next();
    const newPersonVertexId = newPersonVertex.value.id;

    await g.V(newPersonVertexId).addE("livesIn").to(__.V(cityId)).next();
  }
}

async function createCountry(name) {
  const country = await g.V().hasLabel("Country").has("name", name).next();
  if (country.value) {
    return country.value.id;
  } else {
    const newCountry = await g.addV("Country").property("name", name).next();
    return newCountry.value.id;
  }
}

async function createState(name, countryId) {
  const state = await g
    .V()
    .hasLabel("State")
    .has("name", name)
    .has("countryId", countryId)
    .next();

  if (state.value) {
    return state.value.id;
  } else {
    const newState = await g
      .addV("State")
      .property("name", name)
      .property("countryId", countryId)
      .next();
    await g.V(newState.value.id).addE("belongsTo").to(__.V(countryId)).next();
    return newState.value.id;
  }
}

async function createCity(name, stateId) {
  const cityQuery = await g.V().has("City", "name", name).next();
  if (cityQuery.value) {
    return cityQuery.value.id;
  }

  const city = await g.addV("City").property("name", name).next();

  await g.V(city.value.id).addE("isPartOf").to(__.V(stateId)).next();

  return city.value.id;
}

async function getAllData() {
  const result = await g
    .V()
    .project("id", "name", "label")
    .by(__.id())
    .by("name")
    .by(__.label())
    .toList();

  return result.map((node) => ({
    id: node.get("id"),
    name: node.get("name"),
    label: node.get("label"),
  }));
}

async function getAllState() {
  result = await g
    .V()
    .hasLabel("State")
    .project("id", "name", "label")
    .by(__.id())
    .by("name")
    .by(__.label())
    .toList();

  return result.map((node) => ({
    id: node.get("id"),
    name: node.get("name"),
    label: node.get("label"),
  }));
}

async function listAllEdges() {
  const result = await g.E().toList();

  return result.map((item) => ({
    source: item.inV.id,
    target: item.outV.id,
  }));
}

async function deleteAll() {
  await g.V().drop().iterate();

  return;
}

async function generateRandomData(lenght = 1000) {
  const data = [
    {
      country: "Brazil",
      state: "Acre",
      abbreviation: "AC",
      cities: [
        { name: "Rio Branco", population: 413418 },
        { name: "Cruzeiro do Sul", population: 88376 },
      ],
    },
    {
      country: "Brazil",
      state: "Alagoas",
      abbreviation: "AL",
      cities: [
        { name: "Maceió", population: 1025360 },
        { name: "Arapiraca", population: 231968 },
      ],
    },
    {
      country: "Brazil",
      state: "Amazonas",
      abbreviation: "AM",
      cities: [
        { name: "Manaus", population: 2219580 },
        { name: "Parintins", population: 114530 },
      ],
    },
    {
      country: "Argentina",
      state: "Buenos Aires",
      abbreviation: "BA",
      cities: [
        { name: "Buenos Aires", population: 2890000 },
        { name: "La Plata", population: 776138 },
      ],
    },
    {
      country: "Argentina",
      state: "Córdoba",
      abbreviation: "CBA",
      cities: [
        { name: "Córdoba", population: 1330789 },
        { name: "Río Cuarto", population: 157972 },
      ],
    },
    {
      country: "United States",
      state: "California",
      abbreviation: "CA",
      cities: [
        { name: "Los Angeles", population: 3990456 },
        { name: "San Francisco", population: 883305 },
      ],
    },
    {
      country: "United States",
      state: "New York",
      abbreviation: "NY",
      cities: [
        { name: "New York City", population: 8398748 },
        { name: "Buffalo", population: 256902 },
      ],
    },
    {
      country: "Canada",
      state: "Alberta",
      abbreviation: "AB",
      cities: [
        { name: "Calgary", population: 1237656 },
        { name: "Edmonton", population: 981280 },
      ],
    },
    {
      country: "Canada",
      state: "Ontario",
      abbreviation: "ON",
      cities: [
        { name: "Toronto", population: 2930000 },
        { name: "Ottawa", population: 994837 },
      ],
    },
    {
      country: "Mexico",
      state: "Jalisco",
      abbreviation: "JAL",
      cities: [
        { name: "Guadalajara", population: 1460148 },
        { name: "Zapopan", population: 1244442 },
      ],
    },
    {
      country: "Mexico",
      state: "Nuevo Leon",
      abbreviation: "NL",
      cities: [
        { name: "Monterrey", population: 1122874 },
        { name: "San Nicolas de los Garza", population: 475415 },
      ],
    },
    {
      country: "Australia",
      state: "New South Wales",
      abbreviation: "NSW",
      cities: [
        { name: "Sydney", population: 5312000 },
        { name: "Newcastle", population: 322278 },
      ],
    },
    {
      country: "Australia",
      state: "Queensland",
      abbreviation: "QLD",
      cities: [
        { name: "Brisbane", population: 2392560 },
        { name: "Gold Coast", population: 679127 },
      ],
    },
  ];

  let cityIDs = [];

  for (let i = 0; i < data.length; i++) {
    let countryId = await createCountry(data[i].country);

    for (let j = 0; j < data[i].cities.length; j++) {
      let stateId = await createState(data[i].state, countryId);
      let cityId = await createCity(data[i].cities[j].name, stateId);
      cityIDs.push(cityId);
    }
  }

  for (let i = 0; i < lenght; i++) {
    let cityIdSorted = Math.floor(Math.random() * cityIDs.length);
    await createPeople(i.toString(), 10, cityIDs[cityIdSorted]);
  }
}

async function teste() {
  result = await listAllEdges();

  return result;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/people/all", async (req, res) => {
  const result = await getAllData();

  res.json(result);
});

app.get("/state/all", async (req, res) => {
  const result = await getAllState();

  res.json(result);
});

app.get("/graph/all", async (req, res) => {
  const nodes = await getAllData();
  const links = await listAllEdges();

  res.json({ nodes, links });
});

app.get("/state/all", async (req, res) => {});

app.get("/generate", async (req, res) => {
  await generateRandomData();

  res.send("Ok");
});

app.get("/people/teste", async (req, res) => {
  teste = await teste();

  res.json(teste);
});

app.get("/delete/all", async (req, res) => {
  await deleteAll();

  res.send("Ok");
});

app.listen(PORT, () => {
  console.log(`Server starting at port ${PORT}.`);
});