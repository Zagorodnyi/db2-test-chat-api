const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("supertest");
const server = require("../index.js");
const agent = request(server);
const expect = chai.expect;

require("dotenv").config();
chai.should();
chai.use(chaiHttp);

describe("API general test", () => {
  /**
   *  Get list of messages
   */

  it("Get list of All messages", (done) => {
    agent.get("/api/messages/list").end((err, response) => {
      response.should.have.status(200);
      expect(response.body).to.be.an("object").and.have.own.property("list");
    });
    done();
  });

  /**
   * Get list of 10 messages
   */

  it("Get list of 10 messages", (done) => {
    agent
      .get("/api/messages/list/0")
      .then((response) => {
        expect(response.body)
          .to.be.an("object")
          .and.have.any.keys("list", "message");
        if (response.body.list) {
          expect(response.body.list).length.lessThan(11);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  /**
   * Get single message by id
   */

  it("Get single message", (done) => {
    agent
      .get(`/api/messages/single/5f8e0842ab74b685bb36f059`)
      .then((response) => {
        expect(response.body)
          .to.be.an("object")
          .and.have.own.property("message");
        expect(response.body.message).to.have.all.keys(
          "author",
          "email",
          "createdAt",
          "text",
          "_id",
          "__v"
        );
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  it("Get list of messages in date range", (done) => {
    agent
      .get(
        "/api/messages/list-in-range/0?startDate=2020/10/10&endDate=2020/11/11"
      )
      .then((response) => {
        expect(response.body)
          .to.be.an("object")
          .and.have.any.keys("list", "message");
        if (response.body.list) {
          expect(response.body.list).to.be.an("array").and.length.lessThan(11);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  it("Get list of messages by match", (done) => {
    agent
      .get("/api/messages/search?searchParams=enim")
      .then((response) => {
        expect(response.body).to.be.an("array");
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});

describe("API errors test", () => {
  it("trigger 'no message' when looking by ID", (done) => {
    agent
      .get(`/api/messages/single/5f8dc41eda8fa77595868145`)
      .then((response) => {
        expect(response.status).to.be.eq(404);
        expect(response.body)
          .to.be.an("object")
          .and.have.own.property("message");
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  it("trigger 'Incorrect Range' when looking by date", (done) => {
    agent
      .get(
        `/api/messages/list-in-range/0?startDate=2020/14/05&endDate=2020/0/30`
      )
      .then((response) => {
        expect(response.status).to.be.eq(400);
        expect(response.body).to.be.an("object").and.have.own.property("error");
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  it("trigger 'No messages' when looking by string match", (done) => {
    agent
      .get(`/api/messages/search?searchParams=ttttt`)
      .then((response) => {
        expect(response.status).to.be.eq(404);
        expect(response.body)
          .to.be.an("object")
          .and.have.own.property("message");
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });

  it("Trigger input errors when creating new message", (done) => {
    agent
      .post("/api/messages/create")
      .send({})
      .then((response) => {
        expect(response.status).to.be.eq(400);
        expect(response.body)
          .to.be.an("object")
          .and.to.have.own.property("errors")
          .to.have.all.keys("email", "author", "text");
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});
