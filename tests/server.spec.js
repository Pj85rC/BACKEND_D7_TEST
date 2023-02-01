const request = require("supertest");
const server = require("../index");
const jwt = require("jwt-simple");

describe("Operaciones CRUD de cafes", () => {
  it("obteniendo todos los cafes", async () => {
    const response = await request(server).get("/cafes").send();
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  it("eliminando un cafe con id que no existe", async () => {
    const token = jwt.encode({ user_id: 1 }, "secret");
    const response = await request(server)
      .delete("/cafes/9999")
      .set("Authorization", token)
      .send();
    const status = response.statusCode;
    expect(status).toBe(404);
    expect(response.body).toEqual({
      message: "No se encontró ningún cafe con ese id",
    });
  });
  it("agregando un cafe nuevo", async () => {
    const id = Math.floor(Math.random() * 999);
    const cafe = { id, nombre: "cafe irish" };
    const { body: cafes } = await request(server).post("/cafes").send(cafe);
    expect(cafes).toContainEqual(cafe);
  });
  it("modificando un café con ids que no coinciden en payload y params", async () => {
    const id = 1;
    const cafe = { id, nombre: "cafe lava" };
    const response = await request(server).put(`/cafes/3`).send(cafe);
    const status = response.statusCode;
    expect(status).toBe(400);
    expect(response.body).toEqual({
      message: "El id del parámetro no coincide con el id del café recibido",
    });
  });
});
