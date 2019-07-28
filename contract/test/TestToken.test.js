const BigNumber = require('bignumber.js');
const TestToken = artifacts.require("TestToken");
require("chai")
.use(require("chai-bignumber")(BigNumber))
.should();

contract('TestToken', accounts => {
    const name = "TestToken";
    const symbol = "TST";
    const decimals = 18;
    const totalSupply = 1000000;

    beforeEach(async () => {
        this.token = await TestToken.new(name, symbol, decimals, totalSupply);
    });

    describe('token attributes', async () => {
        it('has correct name', async () => {
            (await this.token.name()).should.equal(name);
        });

        it('has correct symbol', async () => {
            (await this.token.symbol()).should.equal(symbol);
        });

        it('has correct decimals', async () => {
            BigNumber(await this.token.decimals()).should.be.bignumber.equal(decimals);
        });

        it('has correct total supply', async () => {
            BigNumber(await this.token.totalSupply()).should.be.bignumber.equal(totalSupply);
        });
    });
})