const Land = artifacts.require("./Land");

require("chai").use(require("chai-as-promised")).should();

const EVM_REVERT = "VM Exception while processing transaction: revert";

contract("Land", ([owner1, owner2]) => {
  const NAME = "The Nights";
  const SYMBOL = "NIGHT";
  const COST = web3.utils.toWei("1", "ether");

  let land, result;

  const landToMint = {
    id: 1,
  };

  beforeEach(async () => {
    land = await Land.new(NAME, SYMBOL, COST);
  });

  describe("Deployment", () => {
    it("returns the contract name", async () => {
      result = await land.name();

      result.should.equal(NAME);
    });

    it("returns the contract symbol", async () => {
      result = await land.symbol();

      result.should.equal(SYMBOL);
    });

    it("returns the cost to mint", async () => {
      result = await land.initialCost();

      result.toString().should.equal(COST);
    });

    it("returns the max supply", async () => {
      result = await land.maxSupply();

      result.toString().should.equal("5");
    });

    it("returns the initial supply", async () => {
      result = await land.totalSupply();

      result.toString().should.equal("0");
    });

    it("returns the number of buildings/lands available", async () => {
      result = await land.getBuildings();

      result.length.should.equal(5);
    });
  });

  describe("Minting", () => {
    describe("Success", async () => {
      beforeEach(async () => {
        result = await land.mint(landToMint.id, { from: owner1, value: COST });
      });

      it("updates the owner address", async () => {
        result = await land.ownerOf(landToMint.id);

        result.should.equal(owner1);
      });

      it("updates building details", async () => {
        result = await land.getBuilding(landToMint.id);

        result.owner.should.equal(owner1);
      });
    });

    describe("Failure", () => {
      it("prevents mint with wrong value", async () => {
        const wrongValue = 0;

        await land
          .mint(landToMint.id, { from: owner1, value: wrongValue })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("prevents mint with invalid id", async () => {
        const falseId = 100;

        await land
          .mint(falseId, { from: owner1, value: COST })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("prevents minting if already owned", async () => {
        await land.mint(landToMint.id, { from: owner1, value: COST });

        await land
          .mint(landToMint.id, { from: owner2, value: COST })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("Transfers", () => {
    describe("success", () => {
      beforeEach(async () => {
        await land.mint(landToMint.id, { from: owner1, value: COST });
        await land.approve(owner2, landToMint.id, { from: owner1 });
        await land.transferFrom(owner1, owner2, landToMint.id, {
          from: owner2,
        });
      });

      it("updates the owner address", async () => {
        result = await land.ownerOf(landToMint.id);
        result.should.equal(owner2);
      });

      it("updates building details", async () => {
        result = await land.getBuilding(landToMint.id);

        result.owner.should.equal(owner2);
      });
    });

    describe("failure", () => {
      it("prevents transfer without ownership", async () => {
        await land
          .transferFrom(owner1, owner2, landToMint.id, { from: owner2 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("prevents transfer without approval", async () => {
        await land.mint(landToMint.id, { from: owner1, value: COST });

        await land
          .transferFrom(owner1, owner2, landToMint.id, { from: owner2 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });
});
