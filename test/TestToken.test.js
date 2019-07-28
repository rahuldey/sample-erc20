const BigNumber = require("bignumber.js");
const TestToken = artifacts.require("TestToken");
require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("TestToken", accounts => {
  const name = "TestToken";
  const symbol = "TST";
  const decimals = 18;
  const totalSupply = 1000000;

  beforeEach(async () => {
    this.token = await TestToken.new(name, symbol, decimals, totalSupply);
  });

    describe("token attributes", async () => {
      it("contract has correct name", async () => {
        (await this.token.name()).should.equal(name);
      });

      it("contract has correct symbol", async () => {
        (await this.token.symbol()).should.equal(symbol);
      });

      it("contract has correct decimals", async () => {
        BigNumber(await this.token.decimals()).should.be.bignumber.equal(
          decimals
        );
      });
    });

    describe("intiial balances", async () => {
      it("contract has correct total supply", async () => {
        BigNumber(await this.token.totalSupply()).should.be.bignumber.equal(
          web3.utils.toWei(totalSupply.toString(), "ether")
        );
      });

      it("owner has correct starting balance", async () => {
        BigNumber(
          await this.token.balanceOf(accounts[0])
        ).should.be.bignumber.equal(
          web3.utils.toWei(totalSupply.toString(), "ether")
        );
      });
    });

  describe("transfer of tokens", async () => {
    it("correct transfer amount", async () => {
      const value = 100;

      // send 1 token to account[1] from account[0]
      const receipt = await this.token.transfer(
        accounts[1],
        web3.utils.toWei(value.toString(), "ether"),
        {
          from: accounts[0]
        }
      );

      // check whether the transaction was successful
      receipt.logs.length.should.equal(1);
      receipt.logs[0].event.should.equal("Transfer");
      receipt.logs[0].args.from.should.equal(accounts[0]);
      receipt.logs[0].args.to.should.equal(accounts[1]);
      BigNumber(receipt.logs[0].args.value).should.be.bignumber.equal(
        web3.utils.toWei(value.toString(), "ether")
      );

      // check if the amount is credited to account[1]
      BigNumber(
        await this.token.balanceOf(accounts[1])
      ).should.be.bignumber.equal(web3.utils.toWei(value.toString(), "ether"));

      // check if the amount was debited from account[0]
      BigNumber(
        await this.token.balanceOf(accounts[0])
      ).should.be.bignumber.equal(
        web3.utils.toWei((totalSupply - value).toString(), "ether")
      );
    });

    it("approval for allowance", async () => {
      const value = 100;

      // approve account[1] to transfer 100 tokens on behalf of account[0]
      const receipt = await this.token.approve(
        accounts[1],
        web3.utils.toWei(value.toString(), "ether")
      );

      // check whether the transaction was successful
      receipt.logs.length.should.equal(1);
      receipt.logs[0].event.should.equal("Approval");
      receipt.logs[0].args.owner.should.equal(accounts[0]);
      receipt.logs[0].args.spender.should.equal(accounts[1]);
      BigNumber(receipt.logs[0].args.value).should.be.bignumber.equal(
        web3.utils.toWei(value.toString(), "ether")
      );

      // check the allowance of account[1] for account[0]
      BigNumber(
        await this.token.allowance(accounts[0], accounts[1])
      ).should.be.bignumber.equal(web3.utils.toWei(value.toString(), "ether"));
    });

    it("delegated transfers", async () => {
      const value = 100;

      const fromAccount = accounts[2];
      const toAccount = accounts[3];
      const spendingAccount = accounts[4];

      // send token to the fromAccount
      await this.token.transfer(
        fromAccount,
        web3.utils.toWei(value.toString(), "ether"),
        {
          from: accounts[0]
        }
      );

      // approve spendingAccount to transfer 100 tokens on behalf of fromAccount
      await this.token.approve(
        spendingAccount,
        web3.utils.toWei(value.toString(), "ether"),
        { from: fromAccount }
      );

      // initiate transfer of 100 tokens from account[0] to account[2] by account[1]
      const receipt = await this.token.transferFrom(
        fromAccount,
        toAccount,
        web3.utils.toWei(value.toString(), "ether"),
        { from: spendingAccount }
      );

      // check whether the transaction was successful
      receipt.logs.length.should.equal(2);
      receipt.logs[0].event.should.equal("Transfer");
      receipt.logs[0].args.from.should.equal(fromAccount);
      receipt.logs[0].args.to.should.equal(toAccount);
      BigNumber(receipt.logs[0].args.value).should.be.bignumber.equal(
        web3.utils.toWei(value.toString(), "ether")
      );
    });
  });
});
